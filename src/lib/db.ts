import { getDB } from './mongodb'

export async function getCounters() {
  const db = await getDB()
  const cfg = await db.collection('config').findOne({ key: 'counters' })
  return cfg || { nextId: 8, nextLogId: 2, nextAvisoId: 2, nextCupomId: 1 }
}

export async function incCounter(field: string) {
  const db = await getDB()
  const cfg = await db.collection('config').findOne({ key: 'counters' })
  const val = (cfg?.[field] || 1)
  await db.collection('config').updateOne({ key: 'counters' }, { $inc: { [field]: 1 } }, { upsert: true })
  return val
}

export async function addLog(type: string, icon: string, color: string, msg: string) {
  const db = await getDB()
  const id = await incCounter('nextLogId')
  await db.collection('logs').insertOne({ id, type, icon, color, msg, time: new Date().toISOString() })
  // Keep max 500 logs
  const count = await db.collection('logs').countDocuments()
  if (count > 500) {
    const oldest = await db.collection('logs').find().sort({ id: 1 }).limit(count - 500).toArray()
    const ids = oldest.map((l: any) => l._id)
    await db.collection('logs').deleteMany({ _id: { $in: ids } })
  }
}
