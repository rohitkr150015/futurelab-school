import { useCallback, useState } from 'react'
export const PREFIX = 'futurelab-demo:'
export function useStored<T>(key: string, initial: T) {
  const [value, set] = useState<T>(() => {
    try {
      return JSON.parse(localStorage.getItem(PREFIX + key) || 'null') ?? initial
    } catch {
      return initial
    }
  })
  const update = useCallback(
    (next: T | ((old: T) => T)) =>
      set((old) => {
        const result = typeof next === 'function' ? (next as (old: T) => T)(old) : next
        try {
          localStorage.setItem(PREFIX + key, JSON.stringify(result))
        } catch {
          /* Storage may be disabled. Current session remains usable. */
        }
        return result
      }),
    [key],
  )
  return [value, update] as const
}
export function resetDemo() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k))
  window.location.assign('/')
}
export function download(name: string, content: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export const money = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
export function ageAt(dob: string, cutoff = '2027-03-31') {
  const valid = (s: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(s) &&
    !Number.isNaN(Date.parse(s)) &&
    new Date(s).toISOString().slice(0, 10) === s
  if (!valid(dob) || !valid(cutoff) || dob > cutoff) return null
  const [y, m, d] = dob.split('-').map(Number),
    [cy, cm, cd] = cutoff.split('-').map(Number)
  return cy - y - (cm < m || (cm === m && cd < d) ? 1 : 0)
}
export function feeEstimate(stage: string, transport: boolean, meals: boolean) {
  const tuition = (
    { 'Early years': 36000, Primary: 48000, 'Middle school': 60000, Secondary: 72000 } as Record<
      string,
      number
    >
  )[stage]
  if (!tuition) return null
  const lines = [
    { label: 'Tuition · annual', amount: tuition },
    { label: 'Learning resources · annual', amount: 6000 },
    { label: 'Admission · one time', amount: 12000 },
    ...(transport ? [{ label: 'Transport · annual', amount: 18000 }] : []),
    ...(meals ? [{ label: 'Meals · annual', amount: 12000 }] : []),
  ]
  return {
    lines,
    total: lines.reduce((s, l) => s + l.amount, 0),
    recurring: lines.filter((l) => !l.label.includes('one time')).reduce((s, l) => s + l.amount, 0),
  }
}
export function fileError(file: File, max = 10) {
  if (!/\.(pdf|png|jpe?g)$/i.test(file.name)) return 'Please choose a PDF, JPG or PNG file.'
  if (file.size > max * 1024 * 1024) return `File must be smaller than ${max} MB.`
  return ''
}
export function calendarFile(
  title: string,
  date: string,
  startTime = '10:00',
  durationMinutes = 120,
) {
  const start = new Date(`${date}T${startTime}:00+05:30`)
  const end = new Date(start.getTime() + durationMinutes * 60000)
  const format = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace('.000', '')
  const day = date.replaceAll('-', '')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FutureLab//Demo Calendar//EN',
    'BEGIN:VEVENT',
    `UID:${day}-${title.toLowerCase().replace(/[^a-z0-9]/g, '')}@futurelab.example`,
    'DTSTAMP:20260924T000000Z',
    `DTSTART:${format(start)}`,
    `DTEND:${format(end)}`,
    `SUMMARY:${title.replace(/[,;]/g, ' ')}`,
    'DESCRIPTION:Fictional FutureLab demo event. Verify timing with the school.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}
export function demoAnswer(question: string, mode: string) {
  const q = question.toLowerCase()
  if (/password|ignore|private|other child|secret|marks change/.test(q))
    return {
      text: 'I can only use the public demo school information. Private records and changes to school decisions are not available in this assistant.',
      path: '/help',
      source: 'Help & access boundaries',
    }
  if (/outdated|superseded|conflicting|expired|old policy|2023|2024/.test(q))
    return {
      text: 'I cannot resolve an outdated or conflicting policy from these demo sources. Please verify the current approved version with the school office.',
      path: '/contact',
      source: 'Policy verification required',
    }
  if (mode === 'study') {
    if (/circuit|electric|science/.test(q))
      return {
        text: 'A circuit needs a closed path for electric current. Start with a cell, wires and a bulb. What do you predict will happen if one wire is disconnected? Try drawing the path first.',
        path: '/school-life/projects/little-ideas-big-impact',
        source: 'Sample science project · circuits',
      }
    return {
      text: 'Try asking “How does an electric circuit work?” for the guided study example. Other topics need an approved learning-resource provider.',
      path: '/academics',
      source: 'Study resources preview',
    }
  }
  if (/fee|cost|price/.test(q))
    return {
      text: 'Our fictional annual tuition ranges from ₹36,000 to ₹72,000 by stage. Resources, one-time admission and optional services are separate. Use the fee estimator for an itemized sample.',
      path: '/admissions/fees',
      source: 'Demo fee schedule · 2026–27',
    }
  if (/admission|apply|document|class 5/.test(q))
    return {
      text: 'Start with your programme choice, then complete guardian and child details. The demo checklist includes a birth certificate and previous report card. Applications here stay in this browser and are not sent to a school.',
      path: '/admissions/apply',
      source: 'Demo admissions guide · documents',
    }
  if (/robot|tinker|club/.test(q))
    return {
      text: 'The Tinker Club explores circuits, coding and prototypes for Classes IV–VIII, Tuesdays at 15:00. Visit the club page to preview joining.',
      path: '/clubs/robotics',
      source: 'Demo club directory',
    }
  if (/visit|tour|campus/.test(q))
    return {
      text: 'Explore the campus map or book a demo visit. The visit planner lets you choose a date and a morning or afternoon slot, review it, then save a local reference.',
      path: '/visit',
      source: 'Demo campus visit guide',
    }
  if (/bus|transport/.test(q))
    return {
      text: 'The public transport page offers sample coverage checks. Live routes and GPS require a verified school provider. No real bus location is available in this demo.',
      path: '/transport',
      source: 'Demo transport guide',
    }
  return {
    text: 'I do not have an approved demo answer for that question. Try admissions, fees, robotics or a campus visit, or use the school enquiry preview.',
    path: '/contact',
    source: 'Contact & support',
  }
}
