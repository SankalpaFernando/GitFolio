import { cookies } from 'next/headers'
import { addCertificate, getCertificates, updateCertificate, deleteCertificate } from '@/lib/github'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('github_user_id')?.value

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = await addCertificate(userId, body)

    if (!result) {
      return Response.json({ error: 'Failed to add certificate' }, { status: 500 })
    }

    return Response.json(result, { status: 201 })
  } catch (error) {
    console.error('[API] Error in certificates POST:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('github_user_id')?.value

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const certificates = await getCertificates(userId)

    return Response.json(certificates || [], { status: 200 })
  } catch (error) {
    console.error('[API] Error in certificates GET:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return Response.json({ error: 'Certificate ID is required' }, { status: 400 })
    }

    const result = await updateCertificate(id, updates)

    if (!result) {
      return Response.json({ error: 'Failed to update certificate' }, { status: 500 })
    }

    return Response.json(result, { status: 200 })
  } catch (error) {
    console.error('[API] Error in certificates PUT:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'Certificate ID is required' }, { status: 400 })
    }

    const success = await deleteCertificate(id)

    if (!success) {
      return Response.json({ error: 'Failed to delete certificate' }, { status: 500 })
    }

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[API] Error in certificates DELETE:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
