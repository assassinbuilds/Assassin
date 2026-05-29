import { auth } from '@clerk/nextjs/server'
import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { collaborationCreateSchema } from '@/lib/validations/collaboration'
import { handleApiError } from '@/lib/errors'
import { requireAuth, requireAdmin } from '@/lib/middleware/auth'
import { ensureCollaborationRequestTable } from '@/lib/collaboration-schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false },
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    await requireAdmin(user.id)

    const status = request.nextUrl.searchParams.get('status')
    const limit = Math.min(parseInt(request.nextUrl.searchParams.get('limit') || '50', 10), 100)

    const client = await pool.connect()
    try {
      await ensureCollaborationRequestTable(client)

      const values: unknown[] = []
      const whereClauses: string[] = []

      if (status) {
        values.push(status)
        whereClauses.push(`status = $${values.length}`)
      }

      values.push(limit)
      const { rows } = await client.query(
        `
          SELECT *
          FROM public.collaboration_requests
          ${whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : ''}
          ORDER BY created_at DESC
          LIMIT $${values.length}
        `,
        values
      )

      return NextResponse.json({ data: rows })
    } finally {
      client.release()
    }
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = collaborationCreateSchema.parse(body)
    const { userId } = await auth()

    const client = await pool.connect()
    try {
      await ensureCollaborationRequestTable(client)

      const { rows } = await client.query(
        `
          INSERT INTO public.collaboration_requests (
            user_id,
            organization_name,
            organization_type,
            contact_name,
            role_title,
            work_email,
            phone,
            website_url,
            collaboration_interests,
            budget_range,
            timeline,
            student_audience,
            message,
            source_page,
            metadata
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
          )
          RETURNING *
        `,
        [
          userId || null,
          validatedData.organization_name,
          validatedData.organization_type,
          validatedData.contact_name,
          validatedData.role_title || null,
          validatedData.work_email.toLowerCase(),
          validatedData.phone || null,
          validatedData.website_url || null,
          validatedData.collaboration_interests,
          validatedData.budget_range || null,
          validatedData.timeline || null,
          validatedData.student_audience || null,
          validatedData.message,
          validatedData.source_page || 'collaborate',
          {
            userAgent: request.headers.get('user-agent'),
            referrer: request.headers.get('referer'),
          },
        ]
      )

      // Send Email Notification
      try {
        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_APP_PASSWORD,
            },
          })

          const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER, // Send to the admin
            subject: `New Collaboration Request: ${validatedData.organization_name}`,
            text: `
New Collaboration Request Received:

Organization: ${validatedData.organization_name} (${validatedData.organization_type})
Contact Name: ${validatedData.contact_name}
Role: ${validatedData.role_title || 'N/A'}
Email: ${validatedData.work_email}
Phone: ${validatedData.phone || 'N/A'}
Website: ${validatedData.website_url || 'N/A'}

Interests: ${validatedData.collaboration_interests.join(', ')}
Budget Range: ${validatedData.budget_range || 'N/A'}
Timeline: ${validatedData.timeline || 'N/A'}
Audience: ${validatedData.student_audience || 'N/A'}

Message:
${validatedData.message}
            `
          }

          await transporter.sendMail(mailOptions)
          console.log('Collaboration email sent successfully.')
        } else {
          console.warn('GMAIL_USER or GMAIL_APP_PASSWORD not configured.')
        }
      } catch (emailError) {
        console.error('Failed to send collaboration email:', emailError)
        // Don't throw error to ensure the API still returns 201 success
      }

      return NextResponse.json(rows[0], { status: 201 })
    } finally {
      client.release()
    }
  } catch (error) {
    return handleApiError(error)
  }
}
