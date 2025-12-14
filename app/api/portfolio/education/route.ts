import { cookies } from 'next/headers'
import { addEducation, getEducation, updateEducation, deleteEducation } from '@/lib/github'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('github_user_id')?.value

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = await addEducation(userId, body)

    if (!result) {
      return Response.json({ error: 'Failed to add education' }, { status: 500 })
    }

    return Response.json(result, { status: 201 })
  } catch (error) {
    console.error('[API] Error in education POST:', error)
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

    const education = await getEducation(userId)

    return Response.json(education || [], { status: 200 })
  } catch (error) {
    console.error('[API] Error in education GET:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return Response.json({ error: 'Education ID is required' }, { status: 400 })
    }

    const result = await updateEducation(id, updates)

    if (!result) {
      return Response.json({ error: 'Failed to update education' }, { status: 500 })
    }

    return Response.json(result, { status: 200 })
  } catch (error) {
    console.error('[API] Error in education PUT:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'Education ID is required' }, { status: 400 })
    }

    const success = await deleteEducation(id)

    if (!success) {
      return Response.json({ error: 'Failed to delete education' }, { status: 500 })
    }

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[API] Error in education DELETE:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
