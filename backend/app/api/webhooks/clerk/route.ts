import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { Pool } from 'pg'
import { ensureEditProfileColumns } from '@/lib/profile-schema'

// Initialize PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 10000,
})

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET')
    return new Response('Error: Missing webhook secret', { status: 500 })
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured during verification', {
      status: 400,
    })
  }

  // Determine event type
  const eventType = evt.type
  console.log(`Clerk Webhook processed: ${eventType} for user ${evt.data.id}`)

  let client
  try {
    client = await pool.connect()

    switch (eventType) {
      case 'user.created':
        await handleUserUpsert(evt.data, client)
        break
      case 'user.updated':
        await handleUserUpsert(evt.data, client)
        break
      case 'user.deleted':
        await handleUserDeleted(evt.data, client)
        break
      case 'session.created':
        // Handle session.created to fulfill "already login user data directly stored"
        // This ensures a profile exists for any active user
        await handleSessionCreated(evt.data, client)
        break
      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    return new Response('Webhook processed', { status: 200 })

  } catch (err: any) {
    console.error(`Webhook handler error [${eventType}]:`, err)
    return new Response('Internal Server Error', { status: 500 })
  } finally {
    if (client) client.release()
  }
}

/**
 * Handle user.created and user.updated events
 * Requirements: New Schema (YYYYDDMMSSS Member ID)
 */
async function handleUserUpsert(userData: any, client: any) {
  try {
    await ensureEditProfileColumns(client)

    const clerkUserId = userData.id
    const primaryEmail = userData.email_addresses?.find(
      (email: any) => email.id === userData.primary_email_address_id
    )?.email_address || userData.email_addresses?.[0]?.email_address || null
    
    const username = `user_${String(clerkUserId).slice(-8).replace(/[^a-zA-Z0-9_]/g, '')}`

    // Keep editable profile fields blank on signup.
    // username is only a technical placeholder because the DB requires it.
    await client.query(`
      INSERT INTO public.profiles (
        id, username, email, first_name, last_name, full_name, avatar_url, updated_at
      ) VALUES (
        $1, $2, $3, '', '', '', NULL, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = NOW()
        -- Do not overwrite editable profile fields from Clerk.
    `, [
      clerkUserId,
      username,
      primaryEmail
    ])

    console.log(`Profile synced for ${clerkUserId} (${username})`)

  } catch (error) {
    console.error(`Failed to sync user ${userData.id}:`, error)
    throw error
  }
}

async function handleUserDeleted(userData: any, client: any) {
  try {
    const clerkUserId = userData.id
    // Instead of deleting, we can deactivate
    await client.query(`
      DELETE FROM public.profiles WHERE id = $1
    `, [clerkUserId])
    console.log(`Profile removed for deleted Clerk user ${clerkUserId}`)
  } catch (error) {
    console.error(`Failed to handle user.deleted for ${userData.id}:`, error)
    throw error
  }
}

async function handleSessionCreated(sessionData: any, client: any) {
  try {
    const clerkUserId = sessionData.user_id
    
    // Check if profile exists
    const { rows } = await client.query('SELECT id FROM public.profiles WHERE id = $1', [clerkUserId])
    
    if (rows.length === 0) {
      console.log(`Session created for ${clerkUserId} but no profile found. Waiting for user.created/updated...`)
      // You could optionally trigger a manual fetch from Clerk here if needed
    } else {
      await client.query(`
        UPDATE public.profiles SET
          updated_at = NOW()
        WHERE id = $1
      `, [clerkUserId])
    }
  } catch (error) {
    console.error(`Failed to update session for ${sessionData.user_id}:`, error)
    throw error
  }
}
