import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data, error } = await supabase.from('categories').select('*')
  
  if (error) return <pre style={{color:'red'}}>{JSON.stringify(error, null, 2)}</pre>
  
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}