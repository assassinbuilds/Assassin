type Queryable = {
  query: (text: string, values?: unknown[]) => Promise<unknown>
}

let editProfileColumnsReady = false

export async function ensureEditProfileColumns(client: Queryable) {
  if (editProfileColumnsReady) {
    return
  }

  await client.query(`
    ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS phone TEXT,
    ADD COLUMN IF NOT EXISTS aadhaar_number TEXT,
    ADD COLUMN IF NOT EXISTS avatar_url TEXT,
    ADD COLUMN IF NOT EXISTS github_url TEXT,
    ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
    ADD COLUMN IF NOT EXISTS twitter_url TEXT,
    ADD COLUMN IF NOT EXISTS portfolio_url TEXT,
    ADD COLUMN IF NOT EXISTS banner_url TEXT,
    ADD COLUMN IF NOT EXISTS bio TEXT,
    ADD COLUMN IF NOT EXISTS readme TEXT,
    ADD COLUMN IF NOT EXISTS address TEXT,
    ADD COLUMN IF NOT EXISTS first_name TEXT,
    ADD COLUMN IF NOT EXISTS last_name TEXT,
    ADD COLUMN IF NOT EXISTS gender TEXT,
    ADD COLUMN IF NOT EXISTS tshirt_size TEXT,
    ADD COLUMN IF NOT EXISTS dietary_preference TEXT,
    ADD COLUMN IF NOT EXISTS allergies TEXT,
    ADD COLUMN IF NOT EXISTS has_education BOOLEAN DEFAULT TRUE NOT NULL,
    ADD COLUMN IF NOT EXISTS education TEXT,
    ADD COLUMN IF NOT EXISTS university TEXT,
    ADD COLUMN IF NOT EXISTS degree_type TEXT,
    ADD COLUMN IF NOT EXISTS graduation_year INTEGER,
    ADD COLUMN IF NOT EXISTS graduation_month TEXT,
    ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS roles TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS resume_url TEXT,
    ADD COLUMN IF NOT EXISTS has_experience BOOLEAN DEFAULT FALSE NOT NULL,
    ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
    ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
    ADD COLUMN IF NOT EXISTS is_email_public BOOLEAN DEFAULT FALSE NOT NULL,
    ADD COLUMN IF NOT EXISTS is_phone_public BOOLEAN DEFAULT FALSE NOT NULL,
    ADD COLUMN IF NOT EXISTS is_address_public BOOLEAN DEFAULT FALSE NOT NULL,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()
  `)

  await client.query(`
    UPDATE public.profiles
    SET first_name = NULLIF(split_part(full_name, ' ', 1), '')
    WHERE (first_name IS NULL OR first_name = '')
      AND full_name IS NOT NULL
      AND full_name <> ''
  `)

  await client.query(`
    UPDATE public.profiles
    SET last_name = NULLIF(trim(regexp_replace(full_name, '^\\S+\\s*', '')), '')
    WHERE (last_name IS NULL OR last_name = '')
      AND full_name IS NOT NULL
      AND full_name <> ''
      AND position(' ' in full_name) > 0
  `)

  editProfileColumnsReady = true
}
