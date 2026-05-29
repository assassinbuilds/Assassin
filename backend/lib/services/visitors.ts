import crypto from 'crypto'
import { Pool } from 'pg'

const databaseUrl = process.env.DATABASE_URL

const pool = new Pool({
  connectionString: databaseUrl,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: databaseUrl && !databaseUrl.includes('localhost')
    ? { rejectUnauthorized: false }
    : undefined,
})

const ensureVisitorTableSql = `
  CREATE TABLE IF NOT EXISTS public.site_visitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_hash TEXT NOT NULL UNIQUE,
    user_agent TEXT,
    first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_site_visitors_last_seen_at
    ON public.site_visitors(last_seen_at DESC);
`

let tableReady: Promise<void> | null = null

async function ensureVisitorTable() {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for visitor tracking')
  }

  tableReady ||= pool.query(ensureVisitorTableSql)
    .then(() => undefined)
    .catch((error) => {
      tableReady = null
      throw error
    })

  return tableReady
}

function hashIpAddress(ipAddress: string) {
  const salt = process.env.VISITOR_HASH_SALT || process.env.JWT_SECRET || 'techassassin-visitor-salt'

  return crypto
    .createHash('sha256')
    .update(`${salt}:${ipAddress}`)
    .digest('hex')
}

export async function trackUniqueVisitor(ipAddress: string, userAgent?: string | null) {
  await ensureVisitorTable()

  const ipHash = hashIpAddress(ipAddress)
  const result = await pool.query(
    `
      WITH upserted AS (
        INSERT INTO public.site_visitors (ip_hash, user_agent)
        VALUES ($1, $2)
        ON CONFLICT (ip_hash) DO UPDATE
        SET last_seen_at = NOW(),
            user_agent = COALESCE(public.site_visitors.user_agent, EXCLUDED.user_agent)
        RETURNING (xmax = 0) AS counted_this_visit
      )
      SELECT
        (SELECT COUNT(*)::int FROM public.site_visitors) AS total_visitors,
        (SELECT counted_this_visit FROM upserted) AS counted_this_visit
    `,
    [ipHash, userAgent || null]
  )

  return {
    totalVisitors: Number(result.rows[0]?.total_visitors || 0),
    countedThisVisit: Boolean(result.rows[0]?.counted_this_visit),
  }
}
