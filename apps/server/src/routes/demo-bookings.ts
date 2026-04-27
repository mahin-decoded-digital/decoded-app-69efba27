import { Router } from 'express'
import { db } from '../lib/db.js'

const router = Router()

type PreferredTime = '09:00' | '10:00' | '11:00' | '14:00' | '15:00' | '16:00'

interface DemoBookingRecord {
  _id: string
  createdAt: string
  name: string
  email: string
  company: string
  preferredDate: string
  preferredTime: PreferredTime
  timezone: string
  status: 'pending' | 'confirmed'
}

function normalizePreferredTime(value: string): PreferredTime | null {
  const allowed: PreferredTime[] = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
  return allowed.includes(value as PreferredTime) ? (value as PreferredTime) : null
}

router.get('/', async (_req, res) => {
  const docs = await db.collection('demoBookings').find()
  const bookings = docs.map((doc) => ({
    id: String(doc._id),
    createdAt: String(doc.createdAt ?? ''),
    name: String(doc.name ?? ''),
    email: String(doc.email ?? ''),
    company: String(doc.company ?? ''),
    preferredDate: String(doc.preferredDate ?? ''),
    preferredTime: normalizePreferredTime(String(doc.preferredTime ?? '09:00')) ?? '09:00',
    timezone: String(doc.timezone ?? 'UTC'),
    status: doc.status === 'pending' ? 'pending' : 'confirmed',
  }))
  res.json(bookings)
  return
})

router.get('/:id', async (req, res) => {
  const booking = await db.collection('demoBookings').findById(String(req.params.id))
  if (!booking) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  res.json({
    id: String(booking._id),
    createdAt: String(booking.createdAt ?? ''),
    name: String(booking.name ?? ''),
    email: String(booking.email ?? ''),
    company: String(booking.company ?? ''),
    preferredDate: String(booking.preferredDate ?? ''),
    preferredTime: normalizePreferredTime(String(booking.preferredTime ?? '09:00')) ?? '09:00',
    timezone: String(booking.timezone ?? 'UTC'),
    status: booking.status === 'pending' ? 'pending' : 'confirmed',
  })
  return
})

router.post('/', async (req, res) => {
  const body = req.body as {
    name?: string
    email?: string
    company?: string
    preferredDate?: string
    preferredTime?: string
    timezone?: string
    status?: 'pending' | 'confirmed'
  }

  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim()
  const company = String(body.company ?? '').trim()
  const preferredDate = String(body.preferredDate ?? '').trim()
  const preferredTime = normalizePreferredTime(String(body.preferredTime ?? ''))
  const timezone = String(body.timezone ?? 'UTC').trim() || 'UTC'
  const status = body.status === 'pending' ? 'pending' : 'confirmed'

  if (!name || !email || !company || !preferredDate || !preferredTime) {
    res.status(400).json({ error: 'Please fill in all scheduling fields.' })
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Please enter a valid email address.' })
    return
  }

  const payload = {
    createdAt: new Date().toISOString(),
    name,
    email,
    company,
    preferredDate,
    preferredTime,
    timezone,
    status,
  }

  const id = await db.collection('demoBookings').insertOne(payload)
  const created = await db.collection('demoBookings').findById(id)

  if (!created) {
    res.status(500).json({ error: 'Failed to create booking' })
    return
  }

  res.status(201).json({
    id: String(created._id),
    createdAt: String(created.createdAt ?? ''),
    name: String(created.name ?? ''),
    email: String(created.email ?? ''),
    company: String(created.company ?? ''),
    preferredDate: String(created.preferredDate ?? ''),
    preferredTime: normalizePreferredTime(String(created.preferredTime ?? '09:00')) ?? '09:00',
    timezone: String(created.timezone ?? 'UTC'),
    status: created.status === 'pending' ? 'pending' : 'confirmed',
  })
  return
})

router.put('/:id', async (req, res) => {
  const body = req.body as {
    name?: string
    email?: string
    company?: string
    preferredDate?: string
    preferredTime?: string
    timezone?: string
    status?: 'pending' | 'confirmed'
  }

  const maybePreferredTime = body.preferredTime !== undefined ? normalizePreferredTime(String(body.preferredTime)) : undefined
  if (body.preferredTime !== undefined && !maybePreferredTime) {
    res.status(400).json({ error: 'Invalid preferred time.' })
    return
  }

  const update = {
    ...(body.name !== undefined ? { name: String(body.name).trim() } : {}),
    ...(body.email !== undefined ? { email: String(body.email).trim() } : {}),
    ...(body.company !== undefined ? { company: String(body.company).trim() } : {}),
    ...(body.preferredDate !== undefined ? { preferredDate: String(body.preferredDate).trim() } : {}),
    ...(maybePreferredTime !== undefined ? { preferredTime: maybePreferredTime } : {}),
    ...(body.timezone !== undefined ? { timezone: String(body.timezone).trim() || 'UTC' } : {}),
    ...(body.status !== undefined ? { status: body.status === 'pending' ? 'pending' : 'confirmed' } : {}),
  }

  const ok = await db.collection('demoBookings').updateOne(String(req.params.id), update)
  if (!ok) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const updated = await db.collection('demoBookings').findById(String(req.params.id))
  if (!updated) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  res.json({
    id: String(updated._id),
    createdAt: String(updated.createdAt ?? ''),
    name: String(updated.name ?? ''),
    email: String(updated.email ?? ''),
    company: String(updated.company ?? ''),
    preferredDate: String(updated.preferredDate ?? ''),
    preferredTime: normalizePreferredTime(String(updated.preferredTime ?? '09:00')) ?? '09:00',
    timezone: String(updated.timezone ?? 'UTC'),
    status: updated.status === 'pending' ? 'pending' : 'confirmed',
  })
  return
})

router.delete('/:id', async (req, res) => {
  const ok = await db.collection('demoBookings').deleteOne(String(req.params.id))
  if (!ok) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  res.json({ success: true })
  return
})

export default router