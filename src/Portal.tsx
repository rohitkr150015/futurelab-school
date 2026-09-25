import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CreditCard,
  Download,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  Mail,
  MessageCircle,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle2,
  Send,
  Bus,
  ClipboardList,
  LogOut,
} from 'lucide-react'
import { clubs } from './data'
import { calendarFile, download, money, useStored } from './lib'
import { ButtonLink, DemoNote, Empty, Modal } from './ui'
import { NotFound } from './Public'
const navigation = [
  ['Overview', 'overview', LayoutDashboard],
  ['Attendance', 'attendance', CheckCircle2],
  ['Learning & progress', 'progress', Activity],
  ['Timetable', 'timetable', CalendarDays],
  ['Assignments', 'assignments', BookOpen],
  ['Fees & receipts', 'fees', CreditCard],
  ['Messages', 'messages', MessageCircle],
  ['Parent meetings', 'ptm', Users],
  ['Leave requests', 'leave', ClipboardList],
  ['Transport', 'transport', Bus],
  ['Library', 'library', Library],
  ['Clubs', 'clubs', Sparkles],
  ['Documents', 'documents', FileText],
  ['Support cases', 'complaints', ShieldCheck],
  ['Notifications', 'notifications', Bell],
] as const
const roles = ['parent', 'student', 'teacher', 'admin']
const rawProgress = [
  { month: 'Apr', Mathematics: 64, Science: 72, English: 76 },
  { month: 'May', Mathematics: 70, Science: 75, English: 78 },
  { month: 'Jun', Mathematics: 68, Science: 79, English: 77 },
  { month: 'Jul', Mathematics: 76, Science: 81, English: 82 },
  { month: 'Aug', Mathematics: 82, Science: 85, English: 85 },
  { month: 'Sep', Mathematics: 88, Science: 91, English: 87 },
]
const timetable = [
  ['08:30', 'Morning circle', 'Homeroom'],
  ['09:00', 'Mathematics', 'Room 204'],
  ['10:00', 'Science lab', 'Discovery lab'],
  ['11:00', 'Break & movement', 'Courtyard'],
  ['11:30', 'English literature', 'Room 204'],
  ['12:30', 'Lunch', 'Commons'],
  ['13:15', 'Creative projects', 'Maker space'],
]
const assignments = [
  {
    id: 'circuit',
    title: 'Build a simple circuit',
    subject: 'Science',
    date: '2026-10-05',
    detail:
      'Draw a circuit with a cell, bulb and switch. Explain what happens when the switch is open. Add a photo or diagram and write a short reflection.',
  },
  {
    id: 'fractions',
    title: 'Fractions in everyday life',
    subject: 'Mathematics',
    date: '2026-10-07',
    detail:
      'Find three everyday examples of fractions. Illustrate equivalent fractions and explain your reasoning with one worked example.',
  },
  {
    id: 'story',
    title: 'A story that begins with “what if”',
    subject: 'English',
    date: '2026-10-09',
    detail:
      'Write a 300-word story beginning with a question. Include a clear setting, a curious character and an unexpected discovery.',
  },
]
function Chart({ child = 'aarav', metric = 'Science' }: { child?: string; metric?: string }) {
  const [table, setTable] = useState(false)
  const data = rawProgress.map((p) => ({
    ...p,
    Science: p.Science - (child === 'tara' ? 7 : 0),
    Mathematics: p.Mathematics - (child === 'tara' ? 4 : 0),
  }))
  return (
    <>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={245}>
          <AreaChart data={data} margin={{ left: -25, right: 12, top: 16, bottom: 0 }}>
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#20d9ec" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#20d9ec" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#e5e9ed" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey={metric}
              stroke="#087d91"
              fill="url(#chartFill)"
              strokeWidth={3}
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <button className="text-link" onClick={() => setTable(!table)}>
        {table ? 'Hide' : 'View'} data table
        <ChevronRight size={14} />
      </button>
      {table && (
        <div className="table-scroll">
          <table>
            <caption>
              Sample {metric} monthly assessment scores · 2026 · normalized percentages
            </caption>
            <thead>
              <tr>
                <th>Month</th>
                <th>Score / 100</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.month}>
                  <td>{p.month}</td>
                  <td>{p[metric as keyof typeof p]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <DemoNote>
        Sample monthly assessments · Apr–Sep 2026 · normalized scores, not exam-board outcomes.
      </DemoNote>
    </>
  )
}
function Overview({ role, child }: { role: string; child: string }) {
  const isStaff = role === 'teacher' || role === 'admin'
  const [metric, setMetric] = useState('Science')
  return (
    <>
      <div className="portal-welcome">
        <div>
          <span className="mono">THURSDAY, 24 SEPTEMBER 2026 · SAMPLE DAY</span>
          <h1>
            {isStaff ? 'Good morning, educator.' : 'A little progress, every day.'}
            <span>✳</span>
          </h1>
          <p>
            {isStaff
              ? 'Here’s what needs your attention in the demo school today.'
              : `Here’s what’s happening in ${child === 'aarav' ? 'Aarav’s' : 'Tara’s'} world today.`}
          </p>
        </div>
        <div className="welcome-icon">
          <GraduationCap size={50} />
        </div>
      </div>
      <div className="portal-stats">
        {(role === 'admin'
          ? [
              ['24', 'Demo enquiries', 'admissions'],
              ['18', 'Sample applications', 'admissions'],
              ['12', 'Confirmed sample admissions', 'admissions'],
            ]
          : role === 'teacher'
            ? [
                ['3', 'Assigned demo classes', 'attendance'],
                ['12', 'Submissions to review', 'assignments'],
                ['2', 'Meetings this week', 'ptm'],
              ]
            : [
                [child === 'aarav' ? '95%' : '90%', 'Attendance · 20 marked days', 'attendance'],
                ['3', 'Assignments to explore', 'assignments'],
                ['₹18,000', 'Sample outstanding fees', 'fees'],
              ]
        ).map(([n, t, p]) => (
          <Link key={t} to={'/portal/' + (p === 'admissions' ? 'admin/admissions' : p)}>
            <span>
              {t}
              <ArrowUpRight size={17} />
            </span>
            <strong>{n}</strong>
            <small>Fictional 2026–27 records</small>
          </Link>
        ))}
      </div>
      <div className="portal-columns">
        <section className="portal-card">
          <div className="card-title">
            <h2>{isStaff ? 'Your work, at a glance' : 'Today’s little priorities'}</h2>
            <span className="tag">3 TO EXPLORE</span>
          </div>
          {assignments.map((a, i) => (
            <Link key={a.id} className="task-row" to={'/portal/assignments/' + a.id}>
              <div className={'task-icon color-' + i}>
                {i === 0 ? (
                  <BookOpen size={20} />
                ) : i === 1 ? (
                  <Activity size={20} />
                ) : (
                  <FileText size={20} />
                )}
              </div>
              <div>
                <strong>{a.title}</strong>
                <span>
                  {a.subject} · due {a.date}
                </span>
              </div>
              <ArrowUpRight size={17} />
            </Link>
          ))}
          <Link className="text-link" to="/portal/assignments">
            See all assignments
            <ArrowRight size={16} />
          </Link>
        </section>
        <section className="portal-card today-card">
          <div className="card-title">
            <h2>Your school day</h2>
            <CalendarDays size={19} />
          </div>
          {timetable.slice(0, 4).map(([t, s, r]) => (
            <div className="schedule-row" key={t}>
              <time>{t}</time>
              <div>
                <strong>{s}</strong>
                <span>{r}</span>
              </div>
            </div>
          ))}
          <Link className="text-link" to="/portal/timetable">
            Full timetable
            <ArrowUpRight size={16} />
          </Link>
        </section>
        <section className="portal-card">
          <div className="card-title">
            <div>
              <span className="mono">SMALL STEPS, BIG GROWTH</span>
              <h2>Learning over time</h2>
            </div>
            <select
              aria-label="Progress subject"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
            >
              {['Science', 'Mathematics', 'English'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <Chart child={child} metric={metric} />
        </section>
        <section className="portal-card notice-highlight">
          <Bell />
          <span className="mono">A NOTE FROM SCHOOL</span>
          <h2>
            A little time
            <br />
            to connect.
          </h2>
          <p>Meet your child’s educator, celebrate progress and plan the next steps together.</p>
          <ButtonLink to="/portal/ptm">Choose a meeting slot</ButtonLink>
        </section>
      </div>
    </>
  )
}
function Attendance({ role, child }: { role: string; child: string }) {
  const [month, setMonth] = useState('September 2026')
  const [marks, setMarks] = useStored<Record<string, string>>('attendance-' + child, {})
  const [selected, setSelected] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)
  const [correction, setCorrection] = useState('')
  const staff = role === 'teacher' || role === 'admin'
  const days = Array.from({ length: 20 }, (_, i) => i + 1)
  const mark = (i: number) =>
    marks[month + '-' + i] ||
    (i === (child === 'aarav' ? 8 : 5) || (child === 'tara' && i === 12) ? 'Absent' : 'Present')
  const present = days.filter((d) => mark(d) === 'Present').length
  return (
    <section className="portal-card">
      <div className="card-title">
        <div>
          <h2>Every school day matters.</h2>
          <p>{present} present / 20 marked sessions · holidays excluded</p>
        </div>
        <select
          aria-label="Attendance month"
          value={month}
          onChange={(e) => {
            setMonth(e.target.value)
            setSaved(false)
          }}
        >
          <option>September 2026</option>
          <option>August 2026</option>
        </select>
      </div>
      <div className="attendance-summary">
        <strong>
          {Math.round((present / 20) * 100)}
          <span>%</span>
        </strong>
        <p>
          Sample attendance rate
          <br />
          <span>20 eligible marked sessions</span>
        </p>
        <span className="tag">{20 - present} ABSENT</span>
      </div>
      <div className="attendance-calendar">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
          <button
            key={d}
            className={d <= 20 ? mark(d).toLowerCase() : 'unmarked'}
            onClick={() => setSelected(d)}
            aria-label={`${month}, session ${d}: ${d <= 20 ? mark(d) : 'Unmarked'}`}
          >
            {d}
            <span>{d <= 20 ? mark(d).slice(0, 1) : '–'}</span>
          </button>
        ))}
      </div>
      <p className="demo-note">
        Session-index view · green = present, rose = absent, grey = unmarked. Demo sessions are not
        a literal calendar of teaching days.
      </p>
      {staff && (
        <p className="inline-note">
          Select a marked session to record a correction. Live entry requires assigned-class
          permissions and a server audit trail.
        </p>
      )}
      {saved && (
        <p role="status" className="inline-note">
          Demo register saved in this browser.
        </p>
      )}
      {selected !== null && (
        <Modal title={`Session ${selected} · ${month}`} onClose={() => setSelected(null)}>
          <p>
            Status: <strong>{selected <= 20 ? mark(selected) : 'Unmarked'}</strong>
          </p>
          {staff && selected <= 20 ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = new FormData(e.currentTarget)
                setMarks((old) => ({ ...old, [month + '-' + selected]: String(form.get('mark')) }))
                setSaved(true)
                setSelected(null)
                setCorrection('')
              }}
            >
              <label>
                Attendance mark
                <select name="mark" defaultValue={mark(selected)}>
                  <option>Present</option>
                  <option>Absent</option>
                </select>
              </label>
              <label>
                Correction reason
                <textarea
                  required
                  minLength={5}
                  value={correction}
                  onChange={(e) => setCorrection(e.target.value)}
                />
              </label>
              <button className="button">
                Save demo correction
                <Check size={16} />
              </button>
            </form>
          ) : (
            <p>
              {selected <= 20
                ? 'Fictional attendance record for the selected child.'
                : 'This session has not been marked and is excluded from the rate.'}
            </p>
          )}
        </Modal>
      )}
    </section>
  )
}
function Progress({ child, role }: { child: string; role: string }) {
  const [subject, setSubject] = useState('Science')
  const [topic, setTopic] = useState('')
  const [marks, setMarks] = useStored('draft-marks', { score: '', state: 'Draft' })
  return (
    <>
      <section className="portal-card">
        <div className="card-title">
          <h2>Understanding, one step at a time.</h2>
          <select
            aria-label="Learning subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {['Science', 'Mathematics', 'English'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <Chart child={child} metric={subject} />
      </section>
      <section className="portal-card">
        <div className="card-title">
          <h2>What to explore next</h2>
          <span className="tag">SAMPLE TOPIC MASTERY</span>
        </div>
        {(subject === 'Science'
          ? [
              ['Electric circuits', 72],
              ['Living systems', 88],
              ['Materials', 64],
            ]
          : subject === 'Mathematics'
            ? [
                ['Fractions', 68],
                ['Geometry', 85],
                ['Data handling', 76],
              ]
            : [
                ['Comprehension', 84],
                ['Creative writing', 73],
                ['Grammar', 89],
              ]
        ).map(([t, n]) => (
          <button className="mastery-row" key={t} onClick={() => setTopic(String(t))}>
            <span>{t}</span>
            <span className="bar-track">
              <span style={{ width: n + '%' }} />
            </span>
            <strong>{n}%</strong>
            <ArrowUpRight size={15} />
          </button>
        ))}
        <DemoNote>
          Illustrative topic scores · 10 mapped questions per topic · small sample, not a
          high-stakes judgement.
        </DemoNote>
        {topic && (
          <div className="inline-note">
            <h3>{topic}: a little practice goes a long way.</h3>
            <p>
              Review the concept, explain it in your own words, then try a worked example.
              Recommendation is based on this sample topic score.
            </p>
            <Link className="text-link" to="/academics">
              Explore approved-resource preview
              <ArrowUpRight size={15} />
            </Link>
          </div>
        )}
      </section>
      {['teacher', 'admin'].includes(role) && (
        <section className="portal-card">
          <h2>Assessment draft</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setMarks({ ...marks, state: 'Submitted for review · demo' })
            }}
          >
            <label>
              Science assessment score / 100
              <input
                required
                type="number"
                min="0"
                max="100"
                value={marks.score}
                onChange={(e) => setMarks({ score: e.target.value, state: 'Draft' })}
              />
            </label>
            <p>State: {marks.state}. Draft marks are not shown in the student sample chart.</p>
            <button className="button">
              Submit demo marks for review
              <Check size={16} />
            </button>
          </form>
        </section>
      )}
    </>
  )
}
function Timetable() {
  const [day, setDay] = useState('Thursday')
  return (
    <section className="portal-card">
      <div className="card-title">
        <h2>A little structure. A lot to discover.</h2>
        <select aria-label="Timetable day" value={day} onChange={(e) => setDay(e.target.value)}>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>
      <div className="table-scroll">
        <table>
          <caption>{day} · Class VII A · demo weekly schedule</caption>
          <thead>
            <tr>
              <th>Time (IST)</th>
              <th>Session</th>
              <th>Space</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map(([t, s, r], i) => (
              <tr key={t}>
                <td>{t}</td>
                <td>{day === 'Friday' && i === 4 ? 'Clubs & exploration' : s}</td>
                <td>{r}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DemoNote>
        Sample recurring school day. Live timetable changes require the school’s ERP/LMS adapter.
      </DemoNote>
    </section>
  )
}
type Submission = { text: string; file: string; status: string; feedback?: string }
function Assignments({ id, role, child }: { id?: string; role: string; child: string }) {
  const [submissions, setSubmissions] = useStored<Record<string, Submission>>(
    'assignments-' + child,
    {},
  )
  const [text, setText] = useState('')
  const [file, setFile] = useState('')
  const [error, setError] = useState('')
  const [review, setReview] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [draft, setDraft] = useStored('teacher-assignment', { title: '', body: '', state: 'Draft' })
  const selected = assignments.find((a) => a.id === id)
  const staff = role === 'teacher' || role === 'admin'
  if (id && !selected) return <Empty title="Assignment not found." />
  return (
    <section className="portal-card">
      <div className="card-title">
        <h2>{selected ? selected.title : 'A question. A little practice. A new idea.'}</h2>
        <BookOpen />
      </div>
      {selected ? (
        <>
          <span className="tag">
            {selected.subject} · DUE {selected.date}
          </span>
          <p>{selected.detail}</p>
          {submissions[selected.id] && (
            <div className="inline-note" role="status">
              <strong>{submissions[selected.id].status}</strong>
              <p>{submissions[selected.id].text}</p>
              <small>File: {submissions[selected.id].file || 'Text-only submission'}</small>
              {submissions[selected.id].feedback && (
                <p>Educator feedback: {submissions[selected.id].feedback}</p>
              )}
            </div>
          )}
          {staff ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSubmissions((old) => ({
                  ...old,
                  [selected.id]: {
                    ...(old[selected.id] || { text: 'Sample learner response', file: '' }),
                    status: 'Feedback released · demo',
                    feedback,
                  },
                }))
              }}
            >
              <label>
                Your feedback
                <textarea
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="A helpful next step for the learner…"
                />
              </label>
              <button className="button">
                Release demo feedback
                <Check size={16} />
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!error) setReview(true)
              }}
            >
              <label>
                Your response
                <textarea
                  required
                  minLength={10}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Explain your thinking…"
                />
              </label>
              <label>
                Optional attachment · PDF, JPG, PNG, DOCX up to 20 MB
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.docx"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (
                      f &&
                      (!/\.(pdf|jpe?g|png|docx)$/i.test(f.name) || f.size > 20 * 1024 * 1024)
                    ) {
                      setError('Choose a supported file under 20 MB.')
                      setFile('')
                    } else {
                      setError('')
                      setFile(f?.name || '')
                    }
                  }}
                />
              </label>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <DemoNote>Filename preview only. No assignment file is uploaded.</DemoNote>
              <button className="button" disabled={!navigator.onLine || !!error}>
                Review demo submission
                <ArrowUpRight size={16} />
              </button>
            </form>
          )}
        </>
      ) : (
        <>
          {assignments.map((a) => (
            <Link className="assignment-row" to={'/portal/assignments/' + a.id} key={a.id}>
              <span className="task-icon">
                <BookOpen size={20} />
              </span>
              <div>
                <span className="mono">
                  {a.subject} · {a.date}
                </span>
                <h3>{a.title}</h3>
                <p>{submissions[a.id]?.status || 'Ready to explore'}</p>
              </div>
              <ArrowUpRight />
            </Link>
          ))}
          {staff && (
            <form
              className="paper"
              onSubmit={(e) => {
                e.preventDefault()
                setDraft({ ...draft, state: 'Published · demo' })
              }}
            >
              <h3>Create an assignment preview</h3>
              <label>
                Title
                <input
                  required
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value, state: 'Draft' })}
                />
              </label>
              <label>
                Instructions
                <textarea
                  required
                  value={draft.body}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value, state: 'Draft' })}
                />
              </label>
              <p>Status: {draft.state}</p>
              <button className="button">
                Publish demo assignment
                <Plus size={16} />
              </button>
            </form>
          )}
        </>
      )}
      {review && selected && (
        <Modal title="Review your assignment response" onClose={() => setReview(false)}>
          <h3>{selected.title}</h3>
          <p>{text}</p>
          <p>Attachment: {file || 'None'} · filename only</p>
          <button
            className="button"
            disabled={!navigator.onLine}
            onClick={() => {
              setSubmissions((old) => ({
                ...old,
                [selected.id]: { text, file, status: 'Submitted locally · demo' },
              }))
              setReview(false)
              setText('')
              setFile('')
            }}
          >
            Save demo submission
            <Check size={16} />
          </button>
        </Modal>
      )}
    </section>
  )
}
function Fees({ receipts = false }: { receipts?: boolean }) {
  const [state, setState] = useStored('payment-state', 'Unpaid')
  const [checkout, setCheckout] = useState(false)
  const [scenario, setScenario] = useState('verified')
  return (
    <section className="portal-card">
      <div className="card-title">
        <div>
          <span className="mono">INVOICE FL-INV-001 · DEMO</span>
          <h2>{receipts ? 'Your demo receipts' : 'One clear view of school fees.'}</h2>
        </div>
        <span className="tag">{state}</span>
      </div>
      <div className="invoice-amount">
        {money(18000)}
        <small>Term II · 2026–27</small>
      </div>
      <table>
        <caption>Sample invoice in INR</caption>
        <tbody>
          <tr>
            <th>Tuition</th>
            <td>₹15,000</td>
          </tr>
          <tr>
            <th>Learning resources</th>
            <td>₹3,000</td>
          </tr>
          <tr>
            <th>Total</th>
            <td>₹18,000</td>
          </tr>
          <tr>
            <th>Sample outstanding</th>
            <td>{state === 'Verified · demo' ? '₹0' : '₹18,000'}</td>
          </tr>
        </tbody>
      </table>
      {state === 'Verified · demo' ? (
        <>
          <p className="inline-note" role="status">
            Verified sample payment. No money was moved.
          </p>
          <button
            className="button"
            onClick={() =>
              download(
                'FL-DEMO-RECEIPT-001.txt',
                'DEMO RECEIPT — NOT VALID FOR PAYMENT OR ACCOUNTING\nInvoice FL-INV-001\nAmount: INR 18,000\nState: simulated provider verification\nNo real transaction occurred.',
              )
            }
          >
            Download demo receipt
            <Download size={16} />
          </button>
        </>
      ) : (
        <>
          <p>
            Payment status: {state}. A real payment can be marked paid only after a verified
            provider webhook.
          </p>
          <button className="button" onClick={() => setCheckout(true)}>
            {state === 'Pending verification'
              ? 'Check simulated status'
              : 'Explore checkout preview'}
            <CreditCard size={17} />
          </button>
        </>
      )}
      <p>
        <Link className="text-link" to={receipts ? '/portal/fees' : '/portal/receipts'}>
          {receipts ? 'View invoice' : 'Open receipts'}
          <ArrowUpRight size={16} />
        </Link>
      </p>
      <DemoNote>
        Payment integration preview. No card details, payment gateway or real financial records are
        used.
      </DemoNote>
      {checkout && (
        <Modal title="Payment provider preview" onClose={() => setCheckout(false)}>
          <h3>Sample invoice · ₹18,000</h3>
          <p>Choose a provider outcome to explore the frontend state. No payment will be made.</p>
          <label>
            Demo scenario
            <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
              <option value="verified">Verified provider response</option>
              <option value="pending">Pending / unknown result</option>
              <option value="failed">Payment failed</option>
            </select>
          </label>
          <button
            className="button"
            onClick={() => {
              setState(
                scenario === 'verified'
                  ? 'Verified · demo'
                  : scenario === 'pending'
                    ? 'Pending verification'
                    : 'Failed · retry available',
              )
              setCheckout(false)
            }}
          >
            Run payment simulation
            <ArrowRightIcon />
          </button>
        </Modal>
      )}
    </section>
  )
}
function ArrowRightIcon() {
  return <ArrowUpRight size={16} />
}
function Messages() {
  const [messages, setMessages] = useStored<{ to: string; text: string; date: string }[]>(
    'messages',
    [],
  )
  const [recipient, setRecipient] = useState('Class educator')
  const [message, setMessage] = useState('')
  const [review, setReview] = useState(false)
  return (
    <section className="portal-card">
      <div className="card-title">
        <h2>A conversation makes a difference.</h2>
        <Mail />
      </div>
      <DemoNote>Sample recipient allowlist. Messages remain local and are never sent.</DemoNote>
      <div className="message-thread">
        <div className="received-message">
          <strong>Class educator · sample message</strong>
          <p>
            We’re looking forward to seeing the class science projects. Encourage your child to
            explain what they tried and what they learned.
          </p>
          <small>24 Sep 2026 · 09:00 IST</small>
        </div>
        {messages.map((m, i) => (
          <div className="sent-message" key={i}>
            <strong>To {m.to}</strong>
            <p>{m.text}</p>
            <small>{new Date(m.date).toLocaleString('en-IN')} · Saved locally, not delivered</small>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setReview(true)
        }}
      >
        <label>
          School contact
          <select value={recipient} onChange={(e) => setRecipient(e.target.value)}>
            {['Class educator', 'School office', 'Transport coordinator'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Message
          <textarea
            required
            minLength={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <button className="button" disabled={!navigator.onLine}>
          Review message
          <Send size={16} />
        </button>
      </form>
      {review && (
        <Modal title="Review your demo message" onClose={() => setReview(false)}>
          <p>
            To: <strong>{recipient}</strong>
          </p>
          <p>{message}</p>
          <DemoNote>No external message will be sent.</DemoNote>
          <button
            className="button"
            disabled={!navigator.onLine}
            onClick={() => {
              setMessages((old) => [
                ...old,
                { to: recipient, text: message, date: new Date().toISOString() },
              ])
              setMessage('')
              setReview(false)
            }}
          >
            Save local message
            <Check size={16} />
          </button>
        </Modal>
      )}
    </section>
  )
}
function Meetings() {
  const [booked, setBooked] = useStored('ptm', '')
  const [selected, setSelected] = useState('')
  const [review, setReview] = useState(false)
  return (
    <section className="portal-card">
      <div className="card-title">
        <h2>A little time, together.</h2>
        <Users />
      </div>
      <p>Parent–educator meeting · Ananya Rao · 10 October 2026 · Asia/Kolkata</p>
      <div className="slot-grid">
        {['09:00', '09:20', '09:40', '10:00', '10:20', '10:40'].map((t) => (
          <button
            key={t}
            disabled={t === '09:40'}
            className={selected === t ? 'active' : ''}
            onClick={() => setSelected(t)}
          >
            {t}
            <small>{t === '09:40' ? 'Unavailable' : '20 minutes'}</small>
          </button>
        ))}
      </div>
      {booked ? (
        <div className="inline-note" role="status">
          <strong>Demo meeting saved: 10 October 2026, {booked} IST</strong>
          <p>No actual calendar reservation has been made.</p>
          <button className="text-link" onClick={() => setBooked('')}>
            Cancel demo meeting
          </button>
          <button
            className="text-link"
            onClick={() =>
              download(
                'demo-ptm.ics',
                calendarFile('Demo parent–educator meeting', '2026-10-10', booked, 20),
                'text/calendar',
              )
            }
          >
            Calendar preview
            <Download size={14} />
          </button>
        </div>
      ) : (
        <button
          className="button"
          disabled={!selected || !navigator.onLine}
          onClick={() => setReview(true)}
        >
          Review meeting
          <ArrowUpRight size={16} />
        </button>
      )}
      {review && (
        <Modal title="Review your meeting" onClose={() => setReview(false)}>
          <p>Ananya Rao · 10 October 2026 · {selected} IST · 20 minutes.</p>
          <DemoNote>This creates a local demo reservation only.</DemoNote>
          <button
            className="button"
            onClick={() => {
              setBooked(selected)
              setReview(false)
            }}
          >
            Save demo meeting
            <Check size={16} />
          </button>
        </Modal>
      )}
    </section>
  )
}
type RequestRecord = { ref: string; kind: string; detail: string; status: string; date: string }
function Requests({ kind, role }: { kind: string; role: string }) {
  const [records, setRecords] = useStored<RequestRecord[]>('requests', [])
  const [detail, setDetail] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [category, setCategory] = useState(
    kind === 'documents' ? 'Bonafide certificate' : 'General',
  )
  const [review, setReview] = useState(false)
  const title =
    kind === 'leave'
      ? 'Make a little space when it’s needed.'
      : kind === 'documents'
        ? 'The documents for your next step.'
        : 'We’re here to listen.'
  const relevant = records.filter((r) => r.kind === kind)
  return (
    <section className="portal-card">
      <h2>{title}</h2>
      <DemoNote>Use fictional details. Requests are stored only in this browser.</DemoNote>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setReview(true)
        }}
      >
        {kind === 'leave' ? (
          <div className="form-grid">
            <label>
              From date
              <input type="date" required value={from} onChange={(e) => setFrom(e.target.value)} />
            </label>
            <label>
              To date
              <input
                type="date"
                required
                min={from}
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </label>
          </div>
        ) : (
          <label>
            {kind === 'documents' ? 'Document type' : 'Support category'}
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {(kind === 'documents'
                ? ['Bonafide certificate', 'Transfer certificate', 'Report card copy']
                : ['General', 'Academics', 'Transport', 'Facilities']
              ).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        )}
        <label>
          {kind === 'leave' ? 'Reason' : 'Details'}
          <textarea
            required
            minLength={8}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
        </label>
        <button className="button" disabled={!navigator.onLine}>
          Review request
          <ArrowUpRight size={16} />
        </button>
      </form>
      <h3>Your demo request history</h3>
      {!relevant.length ? (
        <Empty
          title="No requests yet."
          description="Your local request history will appear here."
        />
      ) : (
        relevant.map((r) => (
          <div className="request-row" key={r.ref}>
            <div>
              <span className="mono">
                {r.ref} · {r.date}
              </span>
              <p>{r.detail}</p>
              <span className="tag">{r.status}</span>
            </div>
            {['teacher', 'admin'].includes(role) && r.status === 'Pending · demo' && (
              <div className="form-actions">
                <button
                  className="button secondary"
                  onClick={() =>
                    setRecords((old) =>
                      old.map((x) => (x.ref === r.ref ? { ...x, status: 'Approved · demo' } : x)),
                    )
                  }
                >
                  Approve
                </button>
                <button
                  className="text-link"
                  onClick={() =>
                    setRecords((old) =>
                      old.map((x) => (x.ref === r.ref ? { ...x, status: 'Declined · demo' } : x)),
                    )
                  }
                >
                  Decline
                </button>
              </div>
            )}
            {r.status === 'Approved · demo' && kind === 'documents' && (
              <Link to="/verify/demo-valid" className="text-link">
                Sample verification
                <ArrowUpRight size={14} />
              </Link>
            )}
          </div>
        ))
      )}
      {review && (
        <Modal title="Review your demo request" onClose={() => setReview(false)}>
          <p>{kind === 'leave' ? `${from} to ${to}` : category}</p>
          <p>{detail}</p>
          <DemoNote>
            Destination:{' '}
            {kind === 'leave'
              ? 'class educator'
              : kind === 'documents'
                ? 'school office'
                : 'support team'}{' '}
            demo queue. No real submission.
          </DemoNote>
          <button
            className="button"
            disabled={!navigator.onLine}
            onClick={() => {
              setRecords((old) => [
                ...old,
                {
                  ref: 'REQ-' + crypto.randomUUID().slice(0, 6).toUpperCase(),
                  kind,
                  detail: (kind === 'leave' ? `${from}–${to}` : category) + ': ' + detail,
                  status: 'Pending · demo',
                  date: new Date().toISOString().slice(0, 10),
                },
              ])
              setDetail('')
              setReview(false)
            }}
          >
            Save demo request
            <Check size={16} />
          </button>
        </Modal>
      )}
    </section>
  )
}
function LibraryView() {
  const [query, setQuery] = useState('')
  const [reserved, setReserved] = useStored<string[]>('library', [])
  const books = [
    { title: 'The Boy Who Harnessed the Wind', category: 'Science & inspiration', available: true },
    { title: 'The Blue Umbrella', category: 'Fiction', available: true },
    { title: 'A Short History of Nearly Everything', category: 'Science', available: false },
    { title: 'The Magic of Math', category: 'Mathematics', available: true },
  ]
  return (
    <section className="portal-card">
      <div className="card-title">
        <h2>A thousand worlds on a shelf.</h2>
        <Library />
      </div>
      <label>
        Find your next read
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or category…"
        />
      </label>
      {books
        .filter((b) => (b.title + ' ' + b.category).toLowerCase().includes(query.toLowerCase()))
        .map((b) => (
          <div className="library-row" key={b.title}>
            <BookOpen />
            <div>
              <h3>{b.title}</h3>
              <p>
                {b.category} · {b.available ? 'Sample copy available' : 'All sample copies on loan'}
              </p>
            </div>
            <button
              className="button secondary"
              onClick={() =>
                setReserved((old) =>
                  old.includes(b.title) ? old.filter((t) => t !== b.title) : [...old, b.title],
                )
              }
            >
              {reserved.includes(b.title)
                ? 'Cancel request'
                : b.available
                  ? 'Reserve demo copy'
                  : 'Join waitlist'}
            </button>
          </div>
        ))}
      <div className="inline-note" role="status">
        {reserved.length
          ? `${reserved.length} local reservation / waitlist request(s). Library staff must confirm actual availability.`
          : 'No demo reservations yet.'}
      </div>
      <DemoNote>
        Sample loan: “The Blue Umbrella” · due 1 October 2026. Live catalogue, issue/return and
        overdue status require a library adapter.
      </DemoNote>
    </section>
  )
}
function Transport() {
  const [scenario, setScenario] = useState('Unavailable')
  return (
    <section className="portal-card">
      <div className="card-title">
        <h2>A clearer view of the journey.</h2>
        <Bus />
      </div>
      <div className="transport-preview">
        <div className="route-line">
          <span>Discovery Park</span>
          <i />
          <i />
          <i />
          <span>Discovery campus</span>
        </div>
        <div className="bus-marker">
          <Bus size={28} />
          <span>DEMO ROUTE D1</span>
        </div>
      </div>
      <div className="form-grid">
        <div>
          <h3>Assigned route preview</h3>
          <p>Vehicle FL-DEMO-01 · no real registration number</p>
          <p>Sample pickup: Discovery Park · 07:45 IST</p>
        </div>
        <label>
          GPS state preview
          <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
            <option>Unavailable</option>
            <option>Stale sample</option>
            <option>Simulation</option>
          </select>
        </label>
      </div>
      <div className="inline-note" role="status">
        {scenario === 'Unavailable'
          ? 'GPS provider is not connected. No live location or ETA is available.'
          : scenario === 'Stale sample'
            ? 'Stale sample: last known observation 24 September 2026, 07:40 IST. Current location is unavailable.'
            : 'Simulation only: the diagram represents a fictional assigned route. It is not live tracking.'}
      </div>
      <DemoNote>
        Production requires authenticated GPS data, student-route authorization and verified
        timestamps.
      </DemoNote>
    </section>
  )
}
function Notifications() {
  const [read, setRead] = useStored<string[]>('read-notices', [])
  const [prefs, setPrefs] = useStored('notification-prefs', {
    email: true,
    sms: false,
    push: false,
  })
  return (
    <section className="portal-card">
      <h2>The right update, at the right time.</h2>
      {[
        ['meeting', 'Parent meeting slots are ready', '/portal/ptm'],
        ['assignment', 'A new science assignment awaits', '/portal/assignments/circuit'],
        ['calendar', 'Term II calendar is available', '/notices/term-two-calendar'],
      ].map(([id, title, path]) => (
        <div className="notification-row" key={id}>
          <Bell size={19} />
          <Link to={path}>
            {title}
            <ArrowUpRight size={15} />
          </Link>
          <button
            onClick={() =>
              setRead((old) => (old.includes(id) ? old.filter((x) => x !== id) : [...old, id]))
            }
          >
            {read.includes(id) ? 'Read ✓' : 'Mark as read'}
          </button>
        </div>
      ))}
      <h3>Your preferences</h3>
      {(['email', 'sms', 'push'] as const).map((k) => (
        <label className="checkbox" key={k}>
          <input
            type="checkbox"
            checked={prefs[k]}
            onChange={(e) => setPrefs({ ...prefs, [k]: e.target.checked })}
          />
          {k.toUpperCase()} demo notifications
        </label>
      ))}
      <DemoNote>
        Preferences are saved locally. No notification permission is requested and no messages are
        sent.
      </DemoNote>
    </section>
  )
}
const integrations = [
  ['Identity & roles', 'OIDC issuer, server session and school role mappings'],
  ['CMS & media', 'Reviewed content, storage signing, upload scanning and consent'],
  ['ERP / LMS', 'School records, class assignments and sync ownership'],
  ['Payments', 'Merchant configuration, signed webhooks and reconciliation'],
  ['AI & search', 'Approved knowledge corpus, provider and server tools'],
  ['OCR', 'Private processing provider with field review'],
  ['Maps & 360 tours', 'Verified coordinates and licensed panorama assets'],
  ['GPS & realtime', 'Authenticated route feed, authorized SSE and stale-state rules'],
  ['Email / SMS / push', 'Approved sender, outbox, retries and preferences'],
  ['Calendar sync', 'Provider calendar access and transactional booking'],
  ['QR verification', 'Opaque server-issued, revocable tokens'],
  ['Monitoring & analytics', 'Redacted events, alerts and school owners'],
]
function Admin({ page }: { page: string }) {
  const [status, setStatus] = useStored('content-status', 'Draft')
  const [body, setBody] = useStored(
    'content-body',
    'Join us for Discovery Day on 17 October 2026. Bring your questions and explore a world of possibilities.',
  )
  const [tool, setTool] = useState('Writing')
  const [generated, setGenerated] = useState('')
  const [filter, setFilter] = useState('All stages')
  const [leads, setLeads] = useStored('admission-leads', [
    { name: 'Demo family A', stage: 'Enquiry', owner: 'Unassigned' },
    { name: 'Demo family B', stage: 'Application', owner: 'Admissions team' },
    { name: 'Demo family C', stage: 'Visit', owner: 'Admissions team' },
  ])
  const [metric, setMetric] = useState('Admission funnel')
  const data =
    metric === 'Admission funnel'
      ? [
          { name: 'Enquiries', value: 24 },
          { name: 'Visits', value: 20 },
          { name: 'Applications', value: 18 },
          { name: 'Admissions', value: 12 },
        ]
      : metric === 'Class capacity'
        ? [
            { name: 'Primary', value: 24 },
            { name: 'Middle', value: 27 },
            { name: 'Secondary', value: 21 },
          ]
        : metric === 'Collections'
          ? [
              { name: 'Due', value: 360000 },
              { name: 'Collected', value: 270000 },
              { name: 'Outstanding', value: 90000 },
            ]
          : metric === 'Transport occupancy'
            ? [
                { name: 'D1 / 30 seats', value: 24 },
                { name: 'D2 / 30 seats', value: 18 },
              ]
            : metric === 'Library usage'
              ? [
                  { name: 'Fiction', value: 42 },
                  { name: 'Science', value: 28 },
                  { name: 'Reference', value: 16 },
                ]
              : [
                  { name: 'Home views', value: 240 },
                  { name: 'Admissions views', value: 90 },
                  { name: 'Application starts', value: 24 },
                ]
  return (
    <>
      {page === 'content' ? (
        <section className="portal-card">
          <div className="card-title">
            <h2>Give the school a thoughtful voice.</h2>
            <span className="tag">{status}</span>
          </div>
          <label>
            Notice draft
            <textarea
              rows={6}
              value={body}
              onChange={(e) => {
                setBody(e.target.value)
                setStatus('Draft')
              }}
            />
          </label>
          <div className="form-actions">
            <button
              className="button"
              onClick={() =>
                setStatus(
                  status === 'Draft'
                    ? 'In review'
                    : status === 'In review'
                      ? 'Published · demo'
                      : 'Archived · demo',
                )
              }
            >
              {status === 'Draft'
                ? 'Send to demo review'
                : status === 'In review'
                  ? 'Publish demo content'
                  : 'Archive demo content'}
            </button>
            <button className="button secondary" onClick={() => setStatus('Draft')}>
              Create new draft
            </button>
          </div>
          <DemoNote>
            Demo state machine only. Live publication needs separate author/reviewer capabilities
            and an audit trail.
          </DemoNote>
          <h3>AI editorial workbench</h3>
          <div className="filter-pills">
            {['Writing', 'Translation', 'Feedback themes', 'Enquiry routing'].map((t) => (
              <button
                className={tool === t ? 'active' : ''}
                key={t}
                onClick={() => {
                  setTool(t)
                  setGenerated('')
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            className="button secondary"
            onClick={() =>
              setGenerated(
                tool === 'Writing'
                  ? 'Draft suggestion: A morning of questions. A world of discoveries. Join our fictional Discovery Day on 17 October 2026.'
                  : tool === 'Translation'
                    ? 'हिंदी मसौदा: 17 अक्टूबर 2026 को डिस्कवरी डे में आपका स्वागत है। अपने सवाल साथ लाएँ। प्रकाशन से पहले मानवीय समीक्षा आवश्यक है।'
                    : tool === 'Feedback themes'
                      ? 'Sample themes from 3 fictional comments: clearer pickup instructions (2 mentions), more reading activities (1 mention). Suggested action: review transport guidance; no sentiment certainty is inferred.'
                      : 'Sample routing: “Does the bus cover my area?” → Transport coordinator. Staff can choose another queue.',
              )
            }
          >
            Generate curated demo example
            <Sparkles size={16} />
          </button>
          {generated && (
            <div className="inline-note">
              <p>{generated}</p>
              <strong>Review required · this is not live AI output.</strong>
              {tool === 'Writing' && (
                <button
                  className="text-link"
                  onClick={() => {
                    setBody(generated)
                    setStatus('Draft')
                  }}
                >
                  Use as editable draft
                  <ArrowUpRight size={15} />
                </button>
              )}
            </div>
          )}
        </section>
      ) : page === 'admissions' ? (
        <section className="portal-card">
          <div className="card-title">
            <h2>A thoughtful admissions journey.</h2>
            <select
              aria-label="Lead stage"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {['All stages', 'Enquiry', 'Visit', 'Application', 'Follow-up'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="table-scroll">
            <table>
              <caption>Fictional admissions work queue</caption>
              <thead>
                <tr>
                  <th>Family</th>
                  <th>Stage</th>
                  <th>Owner</th>
                  <th>Next action</th>
                </tr>
              </thead>
              <tbody>
                {leads
                  .filter((l) => filter === 'All stages' || l.stage === filter)
                  .map((l) => (
                    <tr key={l.name}>
                      <td>{l.name}</td>
                      <td>{l.stage}</td>
                      <td>{l.owner}</td>
                      <td>
                        <button
                          className="text-link"
                          onClick={() =>
                            setLeads((old) =>
                              old.map((x) =>
                                x.name === l.name
                                  ? { ...x, owner: 'Demo admissions lead', stage: 'Follow-up' }
                                  : x,
                              ),
                            )
                          }
                        >
                          Assign follow-up
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <DemoNote>
            These sample leads are independent of real applications. Decisions require authorized
            staff and an audit trail.
          </DemoNote>
        </section>
      ) : page === 'reports' ? (
        <section className="portal-card">
          <div className="card-title">
            <h2>The story behind the numbers.</h2>
            <select aria-label="Report" value={metric} onChange={(e) => setMetric(e.target.value)}>
              {[
                'Admission funnel',
                'Class capacity',
                'Collections',
                'Transport occupancy',
                'Library usage',
                'Website analytics',
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 5" vertical={false} />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#087d91" radius={[5, 5, 0, 0]} animationDuration={300} />
            </BarChart>
          </ResponsiveContainer>
          <table>
            <caption>{metric} · sample September 2026 dataset</caption>
            <thead>
              <tr>
                <th>Category</th>
                <th>{metric === 'Collections' ? 'Amount (INR)' : 'Count'}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.name}>
                  <td>{d.name}</td>
                  <td>{d.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="demo-note">
            {metric === 'Admission funnel'
              ? 'One fictional cohort of 24 enquiries; 20 visits, 18 applications, 12 admissions. No skipped-stage cases in this sample.'
              : metric === 'Class capacity'
                ? 'Active learners per sample class; capacity 30, no reserved places.'
                : metric === 'Collections'
                  ? 'Sample settled collection total, no refunds. Due = collected + outstanding.'
                  : metric === 'Transport occupancy'
                    ? 'Assigned seats / 30 configured seats per route.'
                    : metric === 'Library usage'
                      ? 'Sample loan counts by category; excludes private borrower information.'
                      : 'Sample page-view counts and application starts. No real tracking or attribution.'}
          </p>
          <button
            className="button secondary"
            onClick={() =>
              download(
                'futurelab-' + metric.toLowerCase().replaceAll(' ', '-') + '.csv',
                'Demo report: ' +
                  metric +
                  '\nCategory,Value\n' +
                  data.map((d) => d.name + ',' + d.value).join('\n'),
                'text/csv',
              )
            }
          >
            Export this sample
            <Download size={16} />
          </button>
        </section>
      ) : (
        <section className="portal-card">
          <h2>A clear path from preview to production.</h2>
          <p>Every provider below is disconnected. No secrets belong in the browser bundle.</p>
          {integrations.map(([n, d]) => (
            <details className="integration-row" key={n}>
              <summary>
                <span>{n}</span>
                <span className="tag">INTEGRATION PREVIEW</span>
                <Plus size={17} />
              </summary>
              <p>{d}</p>
              <p>
                State: not configured. Requires a server adapter, school authorization and
                integration tests before activation.
              </p>
            </details>
          ))}
          <div className="inline-note">
            <strong>Role boundaries</strong>
            <p>
              Parent: linked children. Student: self. Teacher: assigned classes. Admin: explicit
              capabilities. The demo switcher is not authentication.
            </p>
          </div>
          <Link className="text-link" to="/verify/demo-valid">
            Explore certificate verification
            <ArrowUpRight size={16} />
          </Link>
        </section>
      )}
    </>
  )
}
export default function Portal() {
  const location = useLocation()
  const navigate = useNavigate()
  const parts = location.pathname.split('/').filter(Boolean)
  const pathRole = roles.includes(parts[1]) ? parts[1] : null
  const [savedRole, setRole] = useStored('role', 'parent')
  const role = pathRole || savedRole
  useEffect(() => {
    if (pathRole && pathRole !== savedRole) setRole(pathRole)
  }, [pathRole, savedRole, setRole])
  const [child, setChild] = useStored('child', 'aarav')
  const adminPage = parts[1] === 'admin' && parts[2] ? parts[2] : null
  const page =
    adminPage ||
    (!parts[1] || pathRole || parts[0] === 'login' || parts[0] === 'auth' ? 'overview' : parts[1])
  const [schoolClass, setClass] = useStored('school-class', 'VII A · Science')
  const [search, setSearch] = useState('')
  const [errorDemo, setErrorDemo] = useState('Loaded')
  const [dismiss, setDismiss] = useState(false)
  const title =
    navigation.find((n) => n[1] === page)?.[0] ||
    (
      {
        content: 'Content studio',
        admissions: 'Admissions queue',
        reports: 'School insights',
        settings: 'Integrations & settings',
        receipts: 'Receipts',
      } as Record<string, string>
    )[page] ||
    'School workspace'
  if (
    ![
      'overview',
      ...navigation.map((n) => n[1]),
      'receipts',
      'content',
      'admissions',
      'reports',
      'settings',
    ].includes(page)
  )
    return <NotFound />
  return (
    <div className="portal-shell">
      <aside className="portal-sidebar">
        <div className="portal-brand">
          <GraduationCap />
          <div>
            My FutureLab<small>A LITTLE CLOSER TO SCHOOL</small>
          </div>
        </div>
        <span className="sidebar-label">YOUR SCHOOL DAY</span>
        <nav aria-label="Portal navigation">
          {navigation
            .filter((n) => n[0].toLowerCase().includes(search.toLowerCase()))
            .map(([name, path, Icon]) => (
              <Link
                className={page === path ? 'active' : ''}
                key={path}
                to={path === 'overview' ? '/portal/' + role : '/portal/' + path}
              >
                <Icon size={18} />
                {name}
                {page === path && <ChevronRight size={15} />}
              </Link>
            ))}
          {['teacher', 'admin'].includes(role) && (
            <>
              <span className="sidebar-label">SCHOOL WORKSPACE</span>
              {[
                ['Content studio', 'content'],
                ['Admissions queue', 'admissions'],
                ['School insights', 'reports'],
                ['Integrations', 'settings'],
              ].map(([n, p]) => (
                <Link key={p} className={page === p ? 'active' : ''} to={'/portal/admin/' + p}>
                  <Settings size={17} />
                  {n}
                </Link>
              ))}
            </>
          )}
        </nav>
        <div className="sidebar-bottom">
          <span className="status-dot" />
          FRONTEND DEMO
          <small>
            Fictional records.
            <br />
            Real possibilities.
          </small>
          <Link to="/">
            <LogOut size={15} />
            Back to school website
          </Link>
        </div>
      </aside>
      <div className="portal-main">
        <header className="portal-topbar">
          <div className="portal-breadcrumb">
            My FutureLab <ChevronRight size={14} /> {title}
          </div>
          <div>
            <Link className="icon-button" to="/portal/notifications" aria-label="Notifications">
              <Bell size={19} />
            </Link>
            <span className="avatar">
              {role === 'parent'
                ? 'DP'
                : role === 'student'
                  ? 'AS'
                  : role === 'teacher'
                    ? 'AR'
                    : 'DA'}
            </span>
          </div>
        </header>
        <div className="portal-controls">
          <label>
            Explore as
            <select
              aria-label="Demo role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value)
                navigate('/portal/' + e.target.value)
              }}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r[0].toUpperCase() + r.slice(1)} · demo
                </option>
              ))}
            </select>
          </label>
          {['parent', 'student'].includes(role) ? (
            <label>
              Demo learner
              <select
                aria-label="Demo child"
                value={child}
                onChange={(e) => setChild(e.target.value)}
              >
                <option value="aarav">Aarav Sharma · VII A</option>
                <option value="tara">Tara Sharma · IV B</option>
              </select>
            </label>
          ) : (
            <label>
              Assigned sample class
              <select value={schoolClass} onChange={(e) => setClass(e.target.value)}>
                <option>VII A · Science</option>
                <option>VI B · Science</option>
                <option>VIII A · Science</option>
              </select>
            </label>
          )}
          <label className="portal-nav-search">
            <Search size={15} />
            <input
              aria-label="Filter portal navigation"
              placeholder="Find a school task…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
        {!dismiss && (
          <div className="portal-demo-note">
            <ShieldCheck size={16} />
            <span>Demo workspace · fictional data, local actions, no secure authentication.</span>
            <button aria-label="Dismiss demo explanation" onClick={() => setDismiss(true)}>
              Got it
            </button>
          </div>
        )}
        <div className="portal-content">
          <div className="state-selector">
            <span className="mono">{title}</span>
            <label>
              Preview state
              <select
                aria-label="Data state"
                value={errorDemo}
                onChange={(e) => setErrorDemo(e.target.value)}
              >
                <option>Loaded</option>
                <option>Empty</option>
                <option>Provider error</option>
                <option>Access denied</option>
              </select>
            </label>
          </div>
          {errorDemo !== 'Loaded' ? (
            <section className="portal-card">
              <Empty
                title={
                  errorDemo === 'Empty'
                    ? 'Nothing to show for this selection.'
                    : errorDemo === 'Provider error'
                      ? 'The provider couldn’t be reached.'
                      : 'This record is outside your access.'
                }
                description={
                  errorDemo === 'Empty'
                    ? 'Try another date or class.'
                    : errorDemo === 'Provider error'
                      ? 'Your work is safe. Retry the sample request.'
                      : 'Production access is checked on the server. No private record details are shown.'
                }
              />
              <button className="button" onClick={() => setErrorDemo('Loaded')}>
                {errorDemo === 'Provider error' ? 'Retry demo request' : 'Return to sample data'}
              </button>
            </section>
          ) : adminPage ? (
            <Admin page={adminPage} />
          ) : page === 'overview' ? (
            <Overview role={role} child={child} />
          ) : page === 'attendance' ? (
            <Attendance
              key={role + child + schoolClass}
              role={role}
              child={role === 'teacher' || role === 'admin' ? schoolClass : child}
            />
          ) : page === 'progress' ? (
            <Progress key={child} child={child} role={role} />
          ) : page === 'timetable' ? (
            <Timetable />
          ) : page === 'assignments' ? (
            <Assignments
              key={child + (parts[2] || 'list')}
              id={parts[2]}
              child={child}
              role={role}
            />
          ) : page === 'fees' || page === 'receipts' ? (
            <Fees receipts={page === 'receipts'} />
          ) : page === 'messages' ? (
            <Messages />
          ) : page === 'ptm' ? (
            <Meetings />
          ) : ['leave', 'documents', 'complaints'].includes(page) ? (
            <Requests key={page} kind={page} role={role} />
          ) : page === 'library' ? (
            <LibraryView />
          ) : page === 'transport' ? (
            <Transport />
          ) : page === 'notifications' ? (
            <Notifications />
          ) : page === 'clubs' ? (
            <section className="portal-card">
              <h2>Find your people. Follow your spark.</h2>
              {clubs.map((c) => (
                <Link key={c.slug} className="assignment-row" to={'/clubs/' + c.slug}>
                  <Sparkles />
                  <div>
                    <h3>{c.title}</h3>
                    <p>
                      {c.schedule} · {c.eligibility}
                    </p>
                  </div>
                  <ArrowUpRight />
                </Link>
              ))}
            </section>
          ) : null}
        </div>
        <div className="portal-bottom">
          2026–27 · Asia/Kolkata · All records shown are fictional demo fixtures.
        </div>
      </div>
    </div>
  )
}
