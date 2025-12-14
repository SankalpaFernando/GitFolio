import { cookies } from 'next/headers'
import { addLanguage, getLanguages, updateLanguage, deleteLanguage } from '@/lib/github'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('github_user_id')?.value

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = await addLanguage(userId, body)

    if (!result) {
      return Response.json({ error: 'Failed to add language' }, { status: 500 })
    }

    return Response.json(result, { status: 201 })
  } catch (error) {
    console.error('[API] Error in languages POST:', error)
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

    const languages = await getLanguages(userId)

    return Response.json(languages || [], { status: 200 })
  } catch (error) {
    console.error('[API] Error in languages GET:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return Response.json({ error: 'Language ID is required' }, { status: 400 })
    }

    const result = await updateLanguage(id, updates)

    if (!result) {
      return Response.json({ error: 'Failed to update language' }, { status: 500 })
    }

    return Response.json(result, { status: 200 })
  } catch (error) {
    console.error('[API] Error in languages PUT:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'Language ID is required' }, { status: 400 })
    }

    const success = await deleteLanguage(id)

    if (!success) {
      return Response.json({ error: 'Failed to delete language' }, { status: 500 })
    }

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[API] Error in languages DELETE:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
