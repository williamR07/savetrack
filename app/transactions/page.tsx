import { supabase } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'
import TransactionsClient from './TransactionsClient'

export default async function TransactionsPage() {
  const { userId } = await auth()

  const [{ data: transactions }, { data: categories }] = await Promise.all([
    supabase.from('transactions').select('*, categories(name, icon)').eq('user_id', userId).order('date', { ascending: false }),
    supabase.from('categories').select('*').or(`user_id.eq.${userId},is_preset.eq.true`)
  ])

  return (
    <TransactionsClient
      initialTransactions={transactions || []}
      categories={categories || []}
      userId={userId!}
    />
  )
}