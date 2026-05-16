import {
  getCounters as _getCounters,
  incCounter as _incCounter,
  addLog as _addLog,
} from './db-supabase'

export async function getCounters() {
  return _getCounters()
}

export async function incCounter(field: string) {
  // db-supabase incCounter already validates fields
  return _incCounter(field as any)
}

export async function addLog(type: string, icon: string, color: string, msg: string) {
  return _addLog(type, icon, color, msg)
}
