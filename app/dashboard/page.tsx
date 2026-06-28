import { supabase } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const { userId } = await auth()

  const [{ data: transactions }, { data: goals }, { data: categories }] = await Promise.all([
    supabase.from('transactions').select('*, categories(name, icon)').eq('user_id', userId).order('date', { ascending: false }),
    supabase.from('goals').select('*').eq('user_id', userId),
    supabase.from('categories').select('*').or(`user_id.eq.${userId},is_preset.eq.true`)
  ])

  return (
    <DashboardClient
      transactions={transactions || []}
      goals={goals || []}
      categories={categories || []}
      userId={userId!}
    />
  )
}