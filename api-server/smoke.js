// Simple smoke tests for the API server
const API_BASE = process.env.API_BASE || '/api'

async function req(path, opts = {}) {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, opts)
  const text = await res.text()
  return { status: res.status, body: text }
}

async function run() {
  console.log('API base:', API_BASE)
  const tests = [
    { name: 'GET /api/seed', fn: () => req('/api/seed') },
    { name: 'GET /api/staffs', fn: () => req('/api/staffs') },
    { name: 'GET /api/logs', fn: () => req('/api/logs') },
    { name: 'POST /api/auth/login (seeded user)', fn: () => req('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'bruno', password: 'bruno123' })
      })
    }
  ]

  let failed = 0
  for (const t of tests) {
    try {
      const r = await t.fn()
      const ok = r.status >= 200 && r.status < 300
      console.log(`${t.name}: ${r.status} ${ok ? 'OK' : 'FAIL'}`)
      if (!ok) {
        console.log('  body:', r.body)
        failed++
      }
    } catch (err) {
      console.log(`${t.name}: ERROR`, err.message)
      failed++
    }
  }

  if (failed) {
    console.error(`${failed} test(s) failed`)
    process.exit(2)
  }
  console.log('All smoke tests passed')
}

run()
