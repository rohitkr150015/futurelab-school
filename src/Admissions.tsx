import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  FileText,
  Save,
  Upload,
  CalendarDays,
  Sparkles,
  Plus,
  IndianRupee,
  Clock,
} from 'lucide-react'
import { stages } from './data'
import { ageAt, feeEstimate, fileError, money, useStored, download } from './lib'
import { ButtonLink, DemoNote, Label, Modal, PageIntro, Photo, Success } from './ui'
import { NotFound } from './Public'
type Draft = {
  guardian: string
  email: string
  phone: string
  child: string
  dob: string
  stage: string
  interest: string
  birth: string
  report: string
  consent: boolean
}
const blank: Draft = {
  guardian: '',
  email: '',
  phone: '',
  child: '',
  dob: '',
  stage: 'Primary',
  interest: 'Science & robotics',
  birth: '',
  report: '',
  consent: false,
}
type Application = { ref: string; name: string; stage: string; date: string; status: string }
function Guide() {
  return (
    <>
      <section className="admissions-hero wrap">
        <div>
          <Label>A NEW CHAPTER, TOGETHER</Label>
          <h1>
            A little curiosity.
            <br />A big <em>beginning.</em>
          </h1>
          <p>
            Choosing a school is choosing a world for your child. Let’s discover whether FutureLab
            feels like their kind of place.
          </p>
          <div className="form-actions">
            <ButtonLink to="/admissions/apply">Start an application</ButtonLink>
            <ButtonLink to="/visit" secondary>
              Come say hello
            </ButtonLink>
          </div>
          <DemoNote>Explore the fictional 2026–27 admissions journey.</DemoNote>
        </div>
        <div className="admissions-hero-photo">
          <Photo name="classroom" alt="Children sharing a learning moment" eager />
          <span className="admission-sticker">
            <Sparkles />A place to
            <br />
            <strong>become yourself.</strong>
          </span>
        </div>
      </section>
      <section className="wrap section">
        <div className="section-heading">
          <div>
            <Label>YOUR NEXT CHAPTER, IN FOUR STEPS</Label>
            <h2>
              Simple steps.
              <br />
              Extraordinary possibilities.
            </h2>
          </div>
          <p>
            From the first question to the first school day, we’re here to make the journey feel a
            little easier.
          </p>
        </div>
        <div className="admission-steps">
          {[
            ['01', 'Find your pathway', 'Explore stages, subjects and interests.', '/academics'],
            ['02', 'Come meet us', 'Walk through the spaces and ask your questions.', '/visit'],
            [
              '03',
              'Tell us your story',
              'Complete the application and document checklist.',
              '/admissions/apply',
            ],
            [
              '04',
              'Follow your journey',
              'Track your application and any next steps.',
              '/admissions/track',
            ],
          ].map(([n, t, d, p]) => (
            <Link key={n} to={p}>
              <span>
                {n}
                <ArrowUpRight size={19} />
              </span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Link>
          ))}
        </div>
        <div className="two-cards">
          <Link className="paper tool-card" to="/admissions/eligibility">
            <CalendarDays />
            <h3>The right stage to start.</h3>
            <p>Check a sample age guideline against the admission cutoff date.</p>
            <span className="text-link">
              Check eligibility
              <ArrowUpRight size={16} />
            </span>
          </Link>
          <Link className="paper tool-card" to="/admissions/fees">
            <IndianRupee />
            <h3>A clearer picture of fees.</h3>
            <p>Explore an itemized sample estimate, with optional services.</p>
            <span className="text-link">
              Build your estimate
              <ArrowUpRight size={16} />
            </span>
          </Link>
        </div>
        <div className="feature-split">
          <Photo name="early" alt="Early years classroom" />
          <div>
            <Label>GOOD TO KNOW</Label>
            <h2>
              Questions are
              <br />
              always welcome.
            </h2>
            {[
              [
                'Which programmes can we explore?',
                'Early years, Primary, Middle school and Secondary through Class X. All programmes are illustrative ICSE-oriented pathways.',
              ],
              [
                'What documents are needed?',
                'For the demo, preview a birth certificate and a previous report card. Early-years applicants may skip the report card. No files are uploaded.',
              ],
              [
                'Can I save and come back?',
                'Yes. Save your fictional application draft in this browser, then return to the application page. Reset demo clears saved drafts.',
              ],
              [
                'Are these actual admissions dates?',
                'No. Dates, fee schedules and availability are fictional preview content. Real admission policies must be approved by the school.',
              ],
            ].map(([q, a]) => (
              <details className="faq" key={q}>
                <summary>
                  {q}
                  <Plus size={17} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
function Fees() {
  const [stage, setStage] = useState('Primary')
  const [transport, setTransport] = useState(false)
  const [meals, setMeals] = useState(false)
  const estimate = feeEstimate(stage, transport, meals)!
  return (
    <>
      <PageIntro
        label="Fee estimator"
        title="A clearer picture of the journey."
        description="Choose a pathway and optional services to explore a transparent, itemized sample estimate."
      />
      <section className="wrap section compact-top calculator-layout">
        <div className="form-card">
          <Label>BUILD YOUR ESTIMATE</Label>
          <h2>What does your day look like?</h2>
          <label>
            Learning pathway
            <select value={stage} onChange={(e) => setStage(e.target.value)}>
              {stages.map((s) => (
                <option key={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
          <label>
            Academic year
            <input value="2026–27 · sample schedule v1" readOnly />
          </label>
          <div className="option-cards">
            <label>
              <input
                type="checkbox"
                checked={transport}
                onChange={(e) => setTransport(e.target.checked)}
              />
              <span>
                <strong>School transport</strong>
                <small>Sample annual service · ₹18,000</small>
              </span>
            </label>
            <label>
              <input type="checkbox" checked={meals} onChange={(e) => setMeals(e.target.checked)} />
              <span>
                <strong>School meals</strong>
                <small>Sample annual service · ₹12,000</small>
              </span>
            </label>
          </div>
          <DemoNote>
            Indicative demo estimate, not an invoice or admission offer. Uniforms, trips, deposits
            and unknown charges require office confirmation.
          </DemoNote>
        </div>
        <div className="fee-summary">
          <span className="mono">YOUR SAMPLE FIRST-YEAR ESTIMATE</span>
          <h2>{money(estimate.total)}</h2>
          <span className="fee-year">{stage} · Academic year 2026–27</span>
          <div className="fee-lines">
            {estimate.lines.map((l) => (
              <div key={l.label}>
                <span>{l.label}</span>
                <strong>{money(l.amount)}</strong>
              </div>
            ))}
          </div>
          <div className="fee-total">
            <span>First-year total</span>
            <strong>{money(estimate.total)}</strong>
          </div>
          <p>
            Recurring annual charges: {money(estimate.recurring)}
            <br />
            One-time admission: ₹12,000
          </p>
          <button
            className="button"
            onClick={() =>
              download(
                'futurelab-fee-estimate.txt',
                `FUTURELAB DEMO ESTIMATE — NOT AN INVOICE\n2026–27 | v1 | ${stage}\n${estimate.lines.map((l) => l.label + ': ' + money(l.amount)).join('\n')}\nFirst year: ${money(estimate.total)}\nRecurring annual: ${money(estimate.recurring)}\nUnlisted charges require office confirmation.`,
              )
            }
          >
            Save estimate
            <FileText size={17} />
          </button>
        </div>
      </section>
    </>
  )
}
function Eligibility() {
  const [dob, setDob] = useState('')
  const [stage, setStage] = useState('Class I')
  const [result, setResult] = useState('')
  const rules: Record<string, [number, number]> = {
    Nursery: [3, 4],
    KG: [4, 6],
    'Class I': [6, 7],
    'Class VI': [11, 12],
    'Class IX': [14, 15],
  }
  return (
    <>
      <PageIntro
        label="Eligibility guide"
        title="The right time for a new beginning."
        description="A simple age check against fictional admission guidelines. Your school makes the final eligibility decision."
      />
      <section className="wrap section compact-top reading-section">
        <form
          className="form-card"
          onSubmit={(e) => {
            e.preventDefault()
            const age = ageAt(dob)
            if (age === null) {
              setResult('Enter a valid birth date on or before the cutoff.')
              return
            }
            const [min, max] = rules[stage]
            setResult(
              `Age on 31 March 2027: ${age} years. ${age >= min && age <= max ? 'Within the sample age range. You can explore the application preview.' : 'Manual review needed. This date is outside the sample range; contact the school for guidance.'}`,
            )
          }}
        >
          <div className="form-grid">
            <label>
              Child’s date of birth
              <input
                required
                type="date"
                max="2027-03-31"
                min="2005-01-01"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </label>
            <label>
              Target class
              <select value={stage} onChange={(e) => setStage(e.target.value)}>
                {Object.keys(rules).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="inline-note">
            Demo cutoff: 31 March 2027 · {stage} sample range: {rules[stage][0]}–{rules[stage][1]}{' '}
            completed years. Policy: illustrative admissions rules v1.
          </p>
          <button className="button">
            Check sample eligibility
            <ArrowRight size={17} />
          </button>
          {result && (
            <div className="eligibility-result" role="status">
              <CheckCircle2 />
              <p>{result}</p>
              <Link to="/admissions/apply">
                Explore application
                <ArrowUpRight size={16} />
              </Link>
            </div>
          )}
          <DemoNote>
            This is not an official age rule or guarantee of admission. Exact calendar dates are
            used; no days/365 approximation.
          </DemoNote>
        </form>
      </section>
    </>
  )
}
function Apply() {
  const [saved, setSaved] = useStored<Draft>('application-draft', blank)
  const [draft, setDraft] = useState(saved)
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [applications, setApplications] = useStored<Application[]>('applications', [])
  const [done, setDone] = useState('')
  const [ocr, setOcr] = useState(false)
  const [busy, setBusy] = useState(false)
  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((old) => ({ ...old, [key]: value }))
    setNotice('Unsaved changes')
  }
  function save() {
    setSaved(draft)
    setNotice('Demo draft saved in this browser.')
  }
  function next() {
    setError('')
    if (step === 1 && ageAt(draft.dob) === null) {
      setError('Please enter a valid birth date on or before 31 March 2027.')
      return
    }
    if (step === 2 && (!draft.birth || (draft.stage !== 'Early years' && !draft.report))) {
      setError('Preview the required documents before continuing.')
      return
    }
    setStep((s) => s + 1)
    window.scrollTo({ top: 170, behavior: 'smooth' })
  }
  async function submit() {
    if (busy) return
    setBusy(true)
    setError('')
    if (!navigator.onLine) {
      setError('You are offline. Reconnect before saving a demo submission.')
      setBusy(false)
      return
    }
    const ref = 'FL-' + crypto.randomUUID().slice(0, 8).toUpperCase()
    setApplications([
      ...applications,
      {
        ref,
        name: draft.child,
        stage: draft.stage,
        date: new Date().toISOString(),
        status: 'Submitted · demo',
      },
    ])
    setSaved(blank)
    setDone(ref)
    setBusy(false)
  }
  const steps = ['Your family', 'Your child', 'Documents', 'Review']
  return (
    <>
      <PageIntro
        label="Application"
        title={done ? 'A new chapter is taking shape.' : 'Let’s begin their next chapter.'}
        description="A few thoughtful details to start your journey. Use fictional information for this frontend preview."
      />
      <section className="wrap section compact-top application-layout">
        <aside className="application-sidebar">
          <span className="mono">YOUR JOURNEY TO FUTURELAB</span>
          {steps.map((s, i) => (
            <div className={step === i ? 'active' : step > i ? 'complete' : ''} key={s}>
              <span>{step > i ? <Check size={16} /> : i + 1}</span>
              <strong>{s}</strong>
            </div>
          ))}
          <div className="application-help">
            <Sparkles />
            <h3>A question along the way?</h3>
            <p>Take your time. You can save this demo and return in the same browser.</p>
            <Link to="/help">
              Visit the help centre
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </aside>
        <div>
          {done ? (
            <Success title="Demo application saved.">
              <p>
                Your reference is <strong>{done}</strong>.
              </p>
              <p>
                No application was sent to a school. Track this sample record in the same browser.
              </p>
              <ButtonLink to="/admissions/track">Follow your demo journey</ButtonLink>
            </Success>
          ) : (
            <form
              className="form-card"
              onSubmit={(e) => {
                e.preventDefault()
                if (step < 3) next()
                else submit()
              }}
            >
              <div className="form-card-heading">
                <div>
                  <span className="mono">STEP {step + 1} OF 4</span>
                  <h2>{steps[step]}</h2>
                </div>
                <button type="button" className="text-link" onClick={save}>
                  <Save size={16} />
                  Save draft
                </button>
              </div>
              <DemoNote>
                Fictional details only. Document contents never leave this device.
              </DemoNote>
              {step === 0 && (
                <>
                  <div className="form-grid">
                    <label>
                      Guardian name
                      <input
                        required
                        minLength={2}
                        autoComplete="off"
                        value={draft.guardian}
                        onChange={(e) => update('guardian', e.target.value)}
                        placeholder="Demo Guardian"
                      />
                    </label>
                    <label>
                      Email
                      <input
                        required
                        type="email"
                        autoComplete="off"
                        value={draft.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="guardian@example.com"
                      />
                    </label>
                  </div>
                  <label>
                    Demo phone number
                    <input
                      required
                      type="tel"
                      pattern="[0-9]{10}"
                      title="Enter 10 digits for the fictional phone number"
                      value={draft.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="0000000000"
                    />
                  </label>
                  <div className="inline-note">
                    We use this step to preview the admissions experience. No calls, emails or
                    messages will be sent.
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  <div className="form-grid">
                    <label>
                      Child’s name
                      <input
                        required
                        minLength={2}
                        value={draft.child}
                        onChange={(e) => update('child', e.target.value)}
                        placeholder="Demo Student"
                      />
                    </label>
                    <label>
                      Date of birth
                      <input
                        required
                        type="date"
                        min="2005-01-01"
                        max="2027-03-31"
                        value={draft.dob}
                        onChange={(e) => update('dob', e.target.value)}
                      />
                    </label>
                    <label>
                      Learning pathway
                      <select value={draft.stage} onChange={(e) => update('stage', e.target.value)}>
                        {stages.map((s) => (
                          <option key={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      A favourite interest
                      <select
                        value={draft.interest}
                        onChange={(e) => update('interest', e.target.value)}
                      >
                        {[
                          'Science & robotics',
                          'Arts & expression',
                          'Sport & wellbeing',
                          'Language & literature',
                        ].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <Link className="text-link" to="/admissions/eligibility">
                    Check indicative age eligibility
                    <ArrowUpRight size={15} />
                  </Link>
                </>
              )}
              {step === 2 && (
                <>
                  <p>
                    Preview file names for the document checklist. PDF, JPG or PNG, up to 10 MB
                    each. No file is uploaded or stored.
                  </p>
                  {(['birth', 'report'] as const).map((key) => (
                    <label className="upload-zone" key={key}>
                      <Upload size={24} />
                      <strong>
                        {key === 'birth' ? 'Birth certificate' : 'Previous report card'}{' '}
                        {key === 'report' && draft.stage === 'Early years'
                          ? '(optional)'
                          : '(required)'}
                      </strong>
                      <span>{draft[key] || 'Choose a sample file to preview'}</span>
                      <input
                        type="file"
                        aria-label={key === 'birth' ? 'Birth certificate' : 'Previous report card'}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) {
                            const err = fileError(f)
                            setError(err)
                            update(key, err ? '' : f.name)
                          }
                        }}
                      />
                      {draft[key] && (
                        <small>
                          <Check size={14} />
                          Filename preview only · not uploaded
                        </small>
                      )}
                    </label>
                  ))}
                  <button className="text-link" type="button" onClick={() => setOcr(!ocr)}>
                    <Sparkles size={16} />
                    Explore OCR prefill preview
                  </button>
                  {ocr && (
                    <div className="inline-note">
                      <strong>Sample extracted fields · not read from your file</strong>
                      <p>Suggested child: Demo Student · DOB: 2019-04-12</p>
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => {
                          update('child', 'Demo Student')
                          update('dob', '2019-04-12')
                          setNotice(
                            'Sample OCR values applied. Verify them in Your child before submitting.',
                          )
                          setOcr(false)
                          setStep(1)
                        }}
                      >
                        Review these sample values
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  )}
                </>
              )}
              {step === 3 && (
                <>
                  <dl className="review-list">
                    {[
                      ['Guardian', draft.guardian],
                      ['Email', draft.email],
                      ['Phone', draft.phone],
                      ['Child', draft.child],
                      ['Birth date', draft.dob],
                      ['Pathway', draft.stage],
                      ['Interest', draft.interest],
                      ['Birth certificate', draft.birth],
                      ['Report card', draft.report || 'Not applicable'],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      required
                      checked={draft.consent}
                      onChange={(e) => update('consent', e.target.checked)}
                    />
                    I reviewed these fictional details and understand that this only creates a local
                    demo record.
                  </label>
                </>
              )}
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              {notice && (
                <p role="status" className="save-status">
                  {notice}
                </p>
              )}
              <div className="form-actions">
                {step > 0 && (
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => {
                      setStep((s) => s - 1)
                      setError('')
                    }}
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                )}
                <button className="button" disabled={busy || !navigator.onLine}>
                  {step === 3 ? (busy ? 'Saving…' : 'Save demo application') : 'Continue'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
type VisitRecord = {
  ref: string
  date: string
  slot: string
  name: string
  campus: string
  status: string
}
function Visit() {
  const [records, setRecords] = useStored<VisitRecord[]>('visits', [])
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [review, setReview] = useState(false)
  const [done, setDone] = useState<VisitRecord | null>(null)
  const [error, setError] = useState('')
  const today = new Date().toISOString().slice(0, 10)
  const slots = ['09:30–10:30 IST', '11:00–12:00 IST', '14:00–15:00 IST']
  const taken = (s: string) =>
    records.some((r) => r.date === date && r.slot === s && r.status === 'Reserved · demo')
  function book() {
    if (records.some((r) => r.date === date && r.slot === slot && r.status === 'Reserved · demo')) {
      setError('This demo slot has already been reserved. Choose another slot.')
      setReview(false)
      return
    }
    const r = {
      ref: 'VIS-' + crypto.randomUUID().slice(0, 8).toUpperCase(),
      date,
      slot,
      name,
      campus: 'Discovery campus',
      status: 'Reserved · demo',
    }
    setRecords([...records, r])
    setDone(r)
    setReview(false)
  }
  return (
    <>
      <PageIntro
        label="Plan a visit"
        title="Come with questions. Leave inspired."
        description="Imagine a morning of discoveries. Explore the demo visit planner, choose a slot and review your visit."
      />
      <section className="wrap section compact-top visit-layout">
        <div className="visit-photo">
          <Photo name="campus" alt="Illustrative campus building" />
          <div>
            <CompassIcon />
            <h2>
              Get a feel for
              <br />
              what’s possible.
            </h2>
            <p>
              Meet the spaces.
              <br />
              Explore the learning.
              <br />
              Bring your curiosity.
            </p>
          </div>
        </div>
        <div>
          {done ? (
            <Success title="Your demo visit is saved.">
              <p>
                <strong>
                  {done.date} · {done.slot}
                </strong>
              </p>
              <p>
                {done.campus} · Reference {done.ref}
              </p>
              <DemoNote>
                This is a local reservation preview, not a confirmed real visit. No email has been
                sent.
              </DemoNote>
              <button
                className="button secondary"
                onClick={() => {
                  setDone(null)
                  setSlot('')
                }}
              >
                Plan another demo visit
              </button>
            </Success>
          ) : (
            <form
              className="form-card"
              onSubmit={(e) => {
                e.preventDefault()
                if (!slot) {
                  setError('Choose a visit slot.')
                  return
                }
                setError('')
                setReview(true)
              }}
            >
              <h2>Let’s make a little time.</h2>
              <DemoNote>Use fictional contact details. Times shown in Asia/Kolkata.</DemoNote>
              <label>
                Campus
                <select>
                  <option>Discovery campus · demo</option>
                </select>
              </label>
              <label>
                Preferred date
                <input
                  required
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value)
                    setSlot('')
                  }}
                />
              </label>
              <fieldset>
                <legend>Available demo slots</legend>
                <div className="slot-grid">
                  {slots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={!date || taken(s)}
                      className={slot === s ? 'active' : ''}
                      onClick={() => setSlot(s)}
                    >
                      {s}
                      {taken(s) && <small>Reserved</small>}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="form-grid">
                <label>
                  Your name
                  <input
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Demo Visitor"
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="visitor@example.com"
                  />
                </label>
              </div>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button className="button" disabled={!navigator.onLine}>
                Review visit
                <ArrowRight size={16} />
              </button>
            </form>
          )}
          {records.length > 0 && (
            <div className="paper saved-visits">
              <h3>Your saved demo visits</h3>
              {records.map((r) => (
                <div key={r.ref}>
                  <p>
                    <strong>
                      {r.date} · {r.slot}
                    </strong>
                    <br />
                    {r.ref} · {r.status}
                  </p>
                  {r.status !== 'Cancelled' && (
                    <button
                      onClick={() => {
                        setRecords((old) =>
                          old.map((x) => (x.ref === r.ref ? { ...x, status: 'Cancelled' } : x)),
                        )
                        if (done?.ref === r.ref) setDone(null)
                      }}
                    >
                      Cancel demo visit
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {review && (
        <Modal title="Your visit, at a glance." onClose={() => setReview(false)}>
          <dl className="review-list">
            {[
              ['Campus', 'Discovery campus · fictional'],
              ['Date', date],
              ['Time', slot],
              ['Visitor', name],
              ['Email', email],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <DemoNote>No real booking or message will be sent.</DemoNote>
          <button className="button" disabled={!navigator.onLine} onClick={book}>
            Save demo visit
            <Check size={17} />
          </button>
        </Modal>
      )}
    </>
  )
}
function CompassIcon() {
  return <CalendarDays size={31} />
}
function Track() {
  const [records] = useStored<Application[]>('applications', [])
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)
  const found = records.filter((r) => !query || r.ref.toLowerCase() === query.trim().toLowerCase())
  return (
    <>
      <PageIntro
        label="Application tracker"
        title="Every next step, a little clearer."
        description="Track a fictional application created in this browser. A real application tracker would require secure sign-in."
      />
      <section className="wrap section compact-top reading-section">
        <form
          className="form-card"
          onSubmit={(e) => {
            e.preventDefault()
            setSearched(true)
          }}
        >
          <label>
            Application reference
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSearched(false)
              }}
              placeholder="FL-XXXXXXXX"
            />
          </label>
          <button className="button">
            Find demo application
            <ArrowRight size={16} />
          </button>
        </form>
        {(searched || !query) &&
          found.map((r) => (
            <article className="paper tracking-card" key={r.ref}>
              <span className="mono">
                {r.ref} · {new Date(r.date).toLocaleDateString('en-IN')}
              </span>
              <h2>{r.name}</h2>
              <p>
                {r.stage} · {r.status}
              </p>
              <ol className="tracking-timeline">
                <li className="complete">
                  <CheckCircle2 />
                  <div>
                    <strong>Demo application saved</strong>
                    <p>Local record created in your browser.</p>
                  </div>
                </li>
                <li>
                  <Clock />
                  <div>
                    <strong>School review</strong>
                    <p>Not started. A real admissions team and backend are required.</p>
                  </div>
                </li>
                <li>
                  <Clock />
                  <div>
                    <strong>Next steps</strong>
                    <p>Any decision would appear after a verified school review.</p>
                  </div>
                </li>
              </ol>
            </article>
          ))}
        {(searched || !query) && !found.length && (
          <div className="empty">
            <FileText size={32} />
            <h3>{query ? 'No matching demo reference.' : 'Your next chapter is waiting.'}</h3>
            <p>
              {query
                ? 'Check the reference or use the browser where you saved the application.'
                : 'Create a demo application to see its status here.'}
            </p>
            <ButtonLink to="/admissions/apply">Start an application</ButtonLink>
          </div>
        )}
      </section>
    </>
  )
}
export default function Admissions() {
  const path = useLocation().pathname
  if (path === '/visit') return <Visit />
  if (path === '/admissions/fees') return <Fees />
  if (path === '/admissions/eligibility') return <Eligibility />
  if (path === '/admissions/apply') return <Apply />
  if (path === '/admissions/track') return <Track />
  if (path === '/admissions' || path === '/admissions/') return <Guide />
  return <NotFound />
}
