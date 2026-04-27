import { Router } from 'express'
import { db } from '../lib/db.js'

const router = Router()

interface LeadRecord {
  _id: string
  createdAt: string
  name: string
  email: string
  company: string
  message: string
  gdprConsent: boolean
  source: 'contact-form' | 'demo-request'
}

router.get('/', async (_req, res) => {
  const docs = await db.collection('leads').find()
  const leads = docs.map((doc) => ({
    id: String(doc._id),
    createdAt: String(doc.createdAt ?? ''),
    name: String(doc.name ?? ''),
    email: String(doc.email ?? ''),
    company: String(doc.company ?? ''),
    message: String(doc.message ?? ''),
    gdprConsent: Boolean(doc.gdprConsent),
    source: (doc.source === 'demo-request' ? 'demo-request' : 'contact-form') as LeadRecord['source'],
  }))
  res.json(leads)
  return
})

router.get('/:id', async (req, res) => {
  const lead = await db.collection('leads').findById(String(req.params.id))
  if (!lead) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  res.json({
    id: String(lead._id),
    createdAt: String(lead.createdAt ?? ''),
    name: String(lead.name ?? ''),
    email: String(lead.email ?? ''),
    company: String(lead.company ?? ''),
    message: String(lead.message ?? ''),
    gdprConsent: Boolean(lead.gdprConsent),
    source: (lead.source === 'demo-request' ? 'demo-request' : 'contact-form') as LeadRecord['source'],
  })
  return
})

router.post('/', async (req, res) => {
  const body = req.body as {
    name?: string
    email?: string
    company?: string
    message?: string
    gdprConsent?: boolean
    source?: 'contact-form' | 'demo-request'
  }

  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim()
  const company = String(body.company ?? '').trim()
  const message = String(body.message ?? '').trim()
  const gdprConsent = Boolean(body.gdprConsent)
  const source = body.source === 'demo-request' ? 'demo-request' : 'contact-form'

  if (!name || !email || !company || !gdprConsent) {
    res.status(400).json({ error: 'Please complete all required fields and accept the privacy policy.' })
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
    message,
    gdprConsent,
    source,
  }

  const id = await db.collection('leads').insertOne(payload)
  const created = await db.collection('leads').findById(id)

  if (!created) {
    res.status(500).json({ error: 'Failed to create lead' })
    return
  }

  res.status(201).json({
    id: String(created._id),
    createdAt: String(created.createdAt ?? ''),
    name: String(created.name ?? ''),
    email: String(created.email ?? ''),
    company: String(created.company ?? ''),
    message: String(created.message ?? ''),
    gdprConsent: Boolean(created.gdprConsent),
    source: (created.source === 'demo-request' ? 'demo-request' : 'contact-form') as LeadRecord['source'],
  })
  return
})

router.put('/:id', async (req, res) => {
  const body = req.body as {
    name?: string
    email?: string
    company?: string
    message?: string
    gdprConsent?: boolean
    source?: 'contact-form' | 'demo-request'
  }

  const update = {
    ...(body.name !== undefined ? { name: String(body.name).trim() } : {}),
    ...(body.email !== undefined ? { email: String(body.email).trim() } : {}),
    ...(body.company !== undefined ? { company: String(body.company).trim() } : {}),
    ...(body.message !== undefined ? { message: String(body.message).trim() } : {}),
    ...(body.gdprConsent !== undefined ? { gdprConsent: Boolean(body.gdprConsent) } : {}),
    ...(body.source !== undefined ? { source: body.source === 'demo-request' ? 'demo-request' : 'contact-form' } : {}),
  }

  const ok = await db.collection('leads').updateOne(String(req.params.id), update)
  if (!ok) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const updated = await db.collection('leads').findById(String(req.params.id))
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
    message: String(updated.message ?? ''),
    gdprConsent: Boolean(updated.gdprConsent),
    source: (updated.source === 'demo-request' ? 'demo-request' : 'contact-form') as LeadRecord['source'],
  })
  return
})

router.delete('/:id', async (req, res) => {
  const ok = await db.collection('leads').deleteOne(String(req.params.id))
  if (!ok) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  res.json({ success: true })
  return
})

export default router