import { supabaseAdmin } from './supabase'

export async function getCounters() {
  const { data, error } = await supabaseAdmin
    .from('counters')
    .select('*')
    .eq('key', 'default')
    .single()

  if (error) {
    console.error('Error getting counters:', error)
    return { nextId: 8, nextLogId: 2, nextAvisoId: 2, nextCupomId: 1 }
  }

  return data
}

export async function incCounter(field: 'nextId' | 'nextLogId' | 'nextAvisoId' | 'nextCupomId') {
  const counters = await getCounters()
  const currentValue = counters[field]

  const { error } = await supabaseAdmin
    .from('counters')
    .update({ [field]: currentValue + 1, updated_at: new Date().toISOString() })
    .eq('key', 'default')

  if (error) {
    console.error(`Error incrementing ${field}:`, error)
  }

  return currentValue
}

export async function addLog(type: string, icon: string, color: string, msg: string) {
  try {
    const id = await incCounter('nextLogId')

    const { error } = await supabaseAdmin
      .from('logs')
      .insert({
        id,
        type,
        icon,
        color,
        msg,
        time: new Date().toISOString(),
      })

    if (error) {
      console.error('Error adding log:', error)
    }

    // Keep max 500 logs
    const { count, error: countError } = await supabaseAdmin
      .from('logs')
      .select('*', { count: 'exact', head: true })

    if (!countError && count && count > 500) {
      const { data: oldest, error: oldestError } = await supabaseAdmin
        .from('logs')
        .select('id')
        .order('id', { ascending: true })
        .limit(count - 500)

      if (!oldestError && oldest) {
        const ids = oldest.map((l) => l.id)
        await supabaseAdmin.from('logs').delete().in('id', ids)
      }
    }
  } catch (err) {
    console.error('Error in addLog:', err)
  }
}

export async function seedIfNeeded() {
  // This is handled via the seed API route
}

// Staff helpers
export async function findStaffByUsername(username: string) {
  const { data, error } = await supabaseAdmin
    .from('staffs')
    .select('*')
    .ilike('username', username)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error finding staff:', error)
  }

  return data || null
}

export async function findStaffById(id: number) {
  const { data, error } = await supabaseAdmin
    .from('staffs')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error finding staff:', error)
  }

  return data || null
}

export async function updateStaffOnline(id: number, online: boolean) {
  const { error } = await supabaseAdmin
    .from('staffs')
    .update({
      online,
      ultimoAcesso: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating staff online status:', error)
  }
}

export async function updateStaffComissions(id: number, usos: number, valorGerado: number, pct: number) {
  const novaComissao = valorGerado * (pct / 100)

  const { error } = await supabaseAdmin
    .from('staffs')
    .update({
      usos,
      valorGerado,
      comissaoTotal: novaComissao,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating staff comissions:', error)
  }
}
