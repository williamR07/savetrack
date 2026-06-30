import { supabase } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data, error } = await supabase.from('transactions').insert([{
    user_id: userId,
    amount: body.amount,
    type: body.type,
    category_id: body.category_id || null,
    note: body.note || null,
    date: body.date,
  }])

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ data })
}

export async function PUT(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...updates } = body

  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}