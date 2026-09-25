import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Search,
  Download,
  Plus,
  CalendarDays,
  MapPin,
  Box,
  Grid2X2,
  Check,
  BookOpen,
  Sparkles,
  Expand,
  Compass,
  Clock,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react'
import {
  stages,
  interests,
  projects,
  gallery,
  facilities,
  events,
  clubs,
  notices,
  faculty,
  publicIndex,
} from './data'
import {
  ArrowLink,
  ButtonLink,
  DemoNote,
  Empty,
  Label,
  Modal,
  PageIntro,
  Photo,
  Reveal,
  Success,
} from './ui'
import { calendarFile, download, useStored } from './lib'
const Campus3D = lazy(() => import('./Campus3D'))
function Filters({
  items,
  value,
  onChange,
}: {
  items: string[]
  value: string
  onChange: (s: string) => void
}) {
  return (
    <div className="filter-pills">
      {items.map((s) => (
        <button
          key={s}
          className={value === s ? 'active' : ''}
          onClick={() => onChange(s)}
          aria-pressed={value === s}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
function Gallery() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || 'All moments'
  const year = params.get('year') || 'All years'
  const event = params.get('event') || 'All events'
  const [light, setLight] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const filtered = gallery.filter(
    (g) =>
      (category === 'All moments' || g.category === category) &&
      (year === 'All years' || g.year === year) &&
      (event === 'All events' || g.event === event),
  )
  function filter(key: string, value: string) {
    setParams((p) => {
      p.set(key, value)
      return p
    })
    setPage(1)
    setLight(null)
  }
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (light === null) return
      if (e.key === 'ArrowRight') setLight((light + 1) % filtered.length)
      if (e.key === 'ArrowLeft') setLight((light - 1 + filtered.length) % filtered.length)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [light, filtered.length])
  return (
    <>
      <section className="gallery-intro">
        <div className="wrap">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>The memory book
          </div>
          <Label>REAL MOMENTS. ENDLESS POSSIBILITIES.</Label>
          <div className="section-heading">
            <h1>
              Life, in
              <br />
              <em>full colour.</em>
              <span className="gallery-star">✳</span>
            </h1>
            <p>
              A collection of little discoveries,
              <br />
              big celebrations, and everything
              <br />
              that makes school feel like home.
            </p>
          </div>
          <div className="gallery-intro-foot">
            <span>
              <span className="status-dot" /> THE FUTURELAB MEMORY BOOK
            </span>
            <span>
              {gallery.length} moments worth keeping <ArrowDownIcon />
            </span>
          </div>
        </div>
      </section>
      <section className="section wrap gallery-section">
        <div className="gallery-toolbar">
          <Filters
            items={['All moments', 'Learning', 'Innovation', 'Arts & culture', 'Sports']}
            value={category}
            onChange={(v) => filter('category', v)}
          />
          <label className="select-inline">
            <SlidersHorizontal size={16} />
            <select
              aria-label="Gallery year"
              value={year}
              onChange={(e) => filter('year', e.target.value)}
            >
              {['All years', '2026', '2025'].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="gallery-meta">
          <p>
            {filtered.length} moments · {category}
          </p>
          <select
            aria-label="Gallery event"
            value={event}
            onChange={(e) => filter('event', e.target.value)}
          >
            {['All events', ...new Set(gallery.map((g) => g.event))].map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </div>
        <div className="gallery-grid">
          {filtered.slice(0, page * 6).map((g, i) => (
            <Reveal key={g.title} className={`gallery-item item-${i % 6}`} delay={(i % 3) * 0.05}>
              <button onClick={() => setLight(i)} aria-label={`Open photo: ${g.title}`}>
                <Photo name={g.image} alt={g.caption} />
                <span className="gallery-overlay">
                  <span className="photo-tag">{g.category}</span>
                  <span className="gallery-item-caption">
                    <small>
                      {g.event} · {g.year}
                    </small>
                    <strong>{g.title}</strong>
                  </span>
                  <span className="gallery-expand">
                    <Expand size={19} />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
        {!filtered.length && <Empty />}
        {page * 6 < filtered.length && (
          <div className="center-actions">
            <button className="button secondary" onClick={() => setPage((p) => p + 1)}>
              More little moments
              <Plus size={18} />
            </button>
          </div>
        )}
        <DemoNote>
          Illustrative collection using supplied photos. Event names and years are demo metadata,
          not verified dates. Media consent must be checked before publication.
        </DemoNote>
      </section>
      {light !== null && filtered[light] && (
        <Modal wide title={filtered[light].title} onClose={() => setLight(null)}>
          <div className="lightbox">
            <Photo name={filtered[light].image} alt={filtered[light].caption} eager />
            <div className="lightbox-bottom">
              <button
                className="icon-button"
                onClick={() => setLight((light - 1 + filtered.length) % filtered.length)}
                aria-label="Previous photograph"
              >
                <ArrowLeft />
              </button>
              <div>
                <p>{filtered[light].caption}</p>
                <small>
                  {light + 1} / {filtered.length} · {filtered[light].event} · {filtered[light].year}
                </small>
              </div>
              <button
                className="icon-button"
                onClick={() => setLight((light + 1) % filtered.length)}
                aria-label="Next photograph"
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
function ArrowDownIcon() {
  return <span aria-hidden="true">↓</span>
}
function Academics({ slug }: { slug?: string }) {
  const [params, setParams] = useSearchParams()
  const selected = stages.find((s) => s.id === (params.get('stage') || slug)) || stages[1]
  const interest = params.get('interest') || interests[0]
  const [tab, setTab] = useState('The pathway')
  if (slug && !stages.some((s) => s.id === slug)) return <NotFound />
  return (
    <>
      <PageIntro
        label="Learning pathways"
        title="Curiosity has no timetable."
        description="Strong foundations. Expansive thinking. An ICSE-oriented journey that grows with your child."
      />
      <section className="wrap section compact-top">
        <div className="discovery-panel">
          <Label>DISCOVER YOUR LEARNING PATH</Label>
          <div className="form-grid">
            <label>
              Academic stage
              <select
                value={selected.id}
                onChange={(e) =>
                  setParams((p) => {
                    p.set('stage', e.target.value)
                    return p
                  })
                }
              >
                {stages.map((s) => (
                  <option value={s.id} key={s.id}>
                    {s.name} · {s.range}
                  </option>
                ))}
              </select>
            </label>
            <label>
              What sparks their curiosity?
              <select
                value={interest}
                onChange={(e) =>
                  setParams((p) => {
                    p.set('interest', e.target.value)
                    return p
                  })
                }
              >
                {interests.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          {slug && (
            <p>
              <Link className="text-link" to={'/academics?stage=' + selected.id}>
                Explore other stages
                <ArrowUpRight size={16} />
              </Link>
            </p>
          )}
        </div>
        <div className="feature-split">
          <Photo name={selected.image} alt={selected.name + ' learning'} />
          <div>
            <span className="mono">
              {selected.range} · {selected.ages}
            </span>
            <h2>{selected.headline}</h2>
            <p>{selected.description}</p>
            <div className="segmented">
              {['The pathway', 'A school day', 'Resources'].map((t) => (
                <button className={tab === t ? 'active' : ''} onClick={() => setTab(t)} key={t}>
                  {t}
                </button>
              ))}
            </div>
            {tab === 'The pathway' ? (
              <ul className="check-list">
                {selected.subjects.map((s) => (
                  <li key={s}>
                    <Check />
                    {s}
                  </li>
                ))}
              </ul>
            ) : tab === 'A school day' ? (
              <div className="mini-timetable">
                {[
                  ['08:30', 'Morning circle'],
                  ['09:00', selected.subjects[0]],
                  ['10:30', 'Break & movement'],
                  ['11:00', 'Inquiry & projects'],
                  ['13:00', 'Creative exploration'],
                ].map(([t, s]) => (
                  <p key={t}>
                    <strong>{t}</strong>
                    {s}
                  </p>
                ))}
              </div>
            ) : (
              <div className="quick-links">
                <Link to="/downloads">
                  Syllabus & reading lists
                  <Download size={17} />
                </Link>
                <Link to="/faculty">
                  Meet the educators
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            )}
            <ButtonLink to="/admissions/apply">Start this journey</ButtonLink>
          </div>
        </div>
        <div className="section-heading">
          <div>
            <Label>FOLLOW THAT SPARK</Label>
            <h2>More ways to discover.</h2>
          </div>
        </div>
        <div className="card-grid">
          {clubs
            .filter((c) => interest === 'All interests' || c.interest === interest)
            .map((c) => (
              <Link className="content-card" key={c.slug} to={'/clubs/' + c.slug}>
                <Photo name={c.image} alt={c.title} />
                <div>
                  <span className="mono">{c.eligibility}</span>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                  <span className="text-link">
                    Explore club
                    <ArrowUpRight size={17} />
                  </span>
                </div>
              </Link>
            ))}
        </div>
        <DemoNote>
          Curriculum is an illustrative ICSE-oriented concept. No verified CISCE affiliation is
          claimed.
        </DemoNote>
      </section>
    </>
  )
}
function Campus({ slug }: { slug?: string }) {
  const [selected, setSelected] = useState(
    facilities.findIndex((f) => f.slug === slug) > -1
      ? facilities.findIndex((f) => f.slug === slug)
      : 0,
  )
  const [mode, setMode] = useState('Map')
  const [tour, setTour] = useState(false)
  const [campus, setCampus] = useState('Discovery campus')
  const f = facilities[selected]
  if (slug && !facilities.some((f) => f.slug === slug)) return <NotFound />
  return (
    <>
      <PageIntro
        label="Explore campus"
        title="A world beyond four walls."
        description="Click a space. Follow a question. Find a new favourite corner of our illustrative campus."
      />
      <section className="wrap section compact-top">
        <div className="gallery-toolbar">
          <div className="segmented">
            {[
              ['Map', Compass],
              ['3D model', Box],
              ['Facility list', Grid2X2],
            ].map(([t, Icon]) => (
              <button
                key={String(t)}
                className={mode === t ? 'active' : ''}
                onClick={() => setMode(t as string)}
              >
                {typeof Icon !== 'string' && <Icon size={16} />} {String(t)}
              </button>
            ))}
          </div>
          <select aria-label="Campus" value={campus} onChange={(e) => setCampus(e.target.value)}>
            <option>Discovery campus</option>
            <option>Riverside campus · preview unavailable</option>
          </select>
        </div>
        {campus !== 'Discovery campus' ? (
          <Empty
            title="This campus is still taking shape."
            description="No Riverside campus data is configured. Select Discovery campus to explore the demo."
          />
        ) : (
          <div className="campus-explorer">
            <div>
              {mode === '3D model' ? (
                <Suspense fallback={<div className="empty">Loading the 3D campus…</div>}>
                  <Campus3D />
                </Suspense>
              ) : mode === 'Map' ? (
                <div className="campus-map">
                  <span className="map-north">N ↑</span>
                  <svg
                    viewBox="0 0 700 470"
                    role="img"
                    aria-label="Fictional campus diagram with five labelled facilities"
                  >
                    <defs>
                      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M30 0H0V30" fill="none" stroke="#d6e0db" strokeWidth=".5" />
                      </pattern>
                    </defs>
                    <rect width="700" height="470" fill="url(#grid)" />
                    <path d="M350 470V80 M90 242H610" stroke="#fff" strokeWidth="37" fill="none" />
                    <rect
                      x="140"
                      y="96"
                      width="180"
                      height="110"
                      rx="9"
                      fill="#b6cbca"
                      stroke="#799693"
                    />
                    <rect
                      x="390"
                      y="65"
                      width="160"
                      height="113"
                      rx="9"
                      fill="#ccdac8"
                      stroke="#799693"
                    />
                    <rect
                      x="110"
                      y="295"
                      width="175"
                      height="97"
                      rx="9"
                      fill="#e4d5bd"
                      stroke="#b7a585"
                    />
                    <rect
                      x="423"
                      y="282"
                      width="148"
                      height="100"
                      rx="9"
                      fill="#c2cddc"
                      stroke="#879eb7"
                    />
                    <ellipse
                      cx="345"
                      cy="245"
                      rx="62"
                      ry="50"
                      fill="#9bbe9b"
                      stroke="#709670"
                      strokeDasharray="4 5"
                    />
                    <g fill="#759d81">
                      {[
                        [85, 65],
                        [580, 110],
                        [600, 370],
                        [77, 375],
                        [250, 427],
                        [535, 437],
                      ].map(([x, y]) => (
                        <circle key={x} cx={x} cy={y} r="19" />
                      ))}
                    </g>
                    <text x="368" y="446" fill="#456057" fontSize="13">
                      MAIN ENTRANCE + PARKING
                    </text>
                  </svg>
                  {facilities.map((p, i) => (
                    <button
                      style={{ left: p.x + '%', top: p.y + '%' }}
                      className={`hotspot ${selected === i ? 'active' : ''}`}
                      key={p.slug}
                      onClick={() => setSelected(i)}
                      aria-label={'Explore ' + p.name}
                      aria-pressed={selected === i}
                    >
                      <Plus size={17} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                  <span className="map-scale">ILLUSTRATIVE PLAN · NOT TO SCALE</span>
                </div>
              ) : (
                <div className="facility-list">
                  {facilities.map((f, i) => (
                    <button
                      key={f.slug}
                      className={i === selected ? 'active' : ''}
                      onClick={() => setSelected(i)}
                    >
                      <span>0{i + 1}</span>
                      <div>
                        <h3>{f.name}</h3>
                        <p>{f.tag}</p>
                      </div>
                      <ArrowUpRight />
                    </button>
                  ))}
                </div>
              )}
              <div className="facility-chips">
                {facilities.map((f, i) => (
                  <button
                    key={f.slug}
                    className={selected === i ? 'active' : ''}
                    onClick={() => setSelected(i)}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="facility-detail" key={f.slug}>
              <Photo name={f.image} alt={f.name} />
              <div>
                <span className="mono">{f.tag}</span>
                <h2>{f.name}</h2>
                <p>{f.detail}</p>
                <p className="inline-note">
                  <MapPin size={16} />
                  {f.access}
                </p>
                <button className="button" onClick={() => setTour(true)}>
                  Explore the space
                  <Expand size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
        <DemoNote>
          Fictional campus layout. Real accessibility details, coordinates and licensed panoramas
          need school verification.
        </DemoNote>
        <div className="banner-card">
          <div>
            <h3>Better in person.</h3>
            <p>Make room for a morning of questions and discoveries.</p>
          </div>
          <ButtonLink to="/visit">Plan a campus visit</ButtonLink>
        </div>
      </section>
      {tour && (
        <Modal title={f.name + ' · tour preview'} wide onClose={() => setTour(false)}>
          <Photo className="tour-still" name={f.image} alt={f.name} />
          <div className="facility-chips">
            {facilities.map((f, i) => (
              <button
                key={f.slug}
                className={selected === i ? 'active' : ''}
                onClick={() => setSelected(i)}
              >
                {f.name}
              </button>
            ))}
          </div>
          <p>{f.detail}</p>
          <DemoNote>
            Still-image tour fallback. A 360° viewer requires licensed equirectangular panoramas;
            these supplied photos are not panoramas.
          </DemoNote>
        </Modal>
      )}
    </>
  )
}
function StudentLife({ slug, achievements = false }: { slug?: string; achievements?: boolean }) {
  const [filter, setFilter] = useState('All projects')
  const [year, setYear] = useState('2026')
  const project = projects.find((p) => p.slug === slug)
  if (slug && !project) return <NotFound />
  if (project)
    return (
      <>
        <PageIntro
          label="Student project"
          title={project.title}
          description={project.description}
        />
        <section className="wrap section compact-top">
          <Photo className="story-cover" name={project.image} alt={project.title} />
          <div className="story-body">
            <span className="mono">
              {project.class} · {project.category} · DEMO STORY
            </span>
            {(['challenge', 'process', 'prototype', 'reflection'] as const).map((s, i) => (
              <Reveal key={s} className="story-chapter">
                <span>0{i + 1}</span>
                <div>
                  <h2>{s[0].toUpperCase() + s.slice(1)}</h2>
                  <p>{project[s]}</p>
                </div>
              </Reveal>
            ))}
            <ButtonLink to="/school-life">More curious minds</ButtonLink>
          </div>
        </section>
      </>
    )
  return (
    <>
      <PageIntro
        label={achievements ? 'Achievements' : 'Student life'}
        title={achievements ? 'Progress worth celebrating.' : 'There’s more to a school day.'}
        description="The experiments that didn’t work. The performance that finally clicked. The teammate who became a friend. This is where growing happens."
      />
      <section className="wrap section compact-top">
        <div className="gallery-toolbar">
          <Filters
            items={['All projects', ...interests.slice(1, 4)]}
            value={filter}
            onChange={setFilter}
          />
          {achievements && (
            <select
              aria-label="Achievement year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option>2026</option>
              <option>2025</option>
            </select>
          )}
        </div>
        <div className="card-grid">
          {(year === '2026' ? projects : [])
            .filter((p) => filter === 'All projects' || p.category === filter)
            .map((p) => (
              <Link key={p.slug} className="content-card" to={'/school-life/projects/' + p.slug}>
                <Photo name={p.image} alt={p.title} />
                <div>
                  <span className="mono">{p.label}</span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <span className="text-link">
                    Read the story
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            ))}
        </div>
        {year === '2025' && <Empty title="No published achievements for 2025." />}
        <DemoNote>
          Sample student work and outcomes; no external awards or results are asserted.
        </DemoNote>
        <div className="life-callout">
          <Photo name="festival" alt="Colourful school celebration" />
          <div>
            <Label>MAKE A LITTLE ROOM FOR JOY</Label>
            <h2>
              A thousand moments.
              <br />
              One school community.
            </h2>
            <ButtonLink to="/gallery">Explore the memory book</ButtonLink>
            <ArrowLink to="/clubs" light>
              Find your people in a club
            </ArrowLink>
          </div>
        </div>
      </section>
    </>
  )
}
function Clubs({ slug }: { slug?: string }) {
  const [params, setParams] = useSearchParams()
  const filter = params.get('interest') || 'All interests'
  const [joined, setJoined] = useStored<string[]>('clubs', [])
  const [review, setReview] = useState<string | null>(null)
  const chosen = clubs.find((c) => c.slug === slug)
  if (slug && !chosen) return <NotFound />
  return (
    <>
      <PageIntro
        label="Clubs & passions"
        title={chosen ? chosen.title : 'Find your kind of curious.'}
        description={
          chosen
            ? chosen.description
            : 'Follow an interest. Try something new. Find the people who make you feel like you belong.'
        }
      />
      <section className="section wrap compact-top">
        {!chosen && (
          <Filters items={interests} value={filter} onChange={(v) => setParams({ interest: v })} />
        )}
        <div className={chosen ? 'club-detail' : 'card-grid'}>
          {(chosen
            ? [chosen]
            : clubs.filter((c) => filter === 'All interests' || c.interest === filter)
          ).map((c) => (
            <article className="content-card" key={c.slug}>
              <Photo name={c.image} alt={c.title} />
              <div>
                <span className="mono">{c.interest}</span>
                <h3>
                  <Link to={'/clubs/' + c.slug}>{c.title}</Link>
                </h3>
                <p>{c.description}</p>
                <p className="detail-line">
                  <CalendarDays size={16} />
                  {c.schedule}
                </p>
                <p className="detail-line">
                  <BookOpen size={16} />
                  {c.eligibility} · {c.places} sample places
                </p>
                {joined.includes(c.slug) ? (
                  <div role="status" className="registration-state">
                    <strong>
                      {c.places ? 'Demo registration saved' : 'Demo waitlist request saved'}
                    </strong>
                    <button onClick={() => setJoined((old) => old.filter((x) => x !== c.slug))}>
                      Cancel request
                    </button>
                  </div>
                ) : (
                  <button className="button secondary" onClick={() => setReview(c.slug)}>
                    {c.places ? 'Join the club' : 'Join the waitlist'}
                    <Plus size={16} />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
        <DemoNote>
          Demo-only registrations. Capacity, eligibility and parental consent need server
          confirmation in production.
        </DemoNote>
      </section>
      {review && (
        <Modal title="A new interest starts here." onClose={() => setReview(null)}>
          <p>
            Save a demo{' '}
            {clubs.find((c) => c.slug === review)?.places ? 'registration' : 'waitlist request'} for{' '}
            <strong>{clubs.find((c) => c.slug === review)?.title}</strong>?
          </p>
          <p>{clubs.find((c) => c.slug === review)?.schedule} · Discovery campus</p>
          <DemoNote>This local action does not reserve a real place.</DemoNote>
          <button
            className="button"
            disabled={!navigator.onLine}
            onClick={() => {
              setJoined((old) => [...old, review])
              setReview(null)
            }}
          >
            Confirm demo request
            <Check size={17} />
          </button>
        </Modal>
      )}
    </>
  )
}
function Events({ slug }: { slug?: string }) {
  const [params, setParams] = useSearchParams()
  const [view, setView] = useState('Agenda')
  const [registered, setRegistered] = useStored<string[]>('events', [])
  const [review, setReview] = useState(false)
  const selected = events.find((e) => e.slug === slug)
  const month = params.get('month') || 'All months'
  if (slug && !selected) return <NotFound />
  return (
    <>
      <PageIntro
        label="School calendar"
        title={selected ? selected.title : 'Put a little wonder in your diary.'}
        description={
          selected
            ? selected.detail
            : 'Open days, student showcases and shared celebrations. There’s always something to look forward to.'
        }
      />
      <section className="wrap section compact-top">
        {selected ? (
          <div className="feature-split">
            <Photo name={selected.image} alt={selected.title} />
            <div>
              <Label>{selected.category}</Label>
              <h2>
                {selected.day} {selected.month} 2026
              </h2>
              <p>{selected.time} · FutureLab demo campus</p>
              <p>{selected.detail}</p>
              <div className="form-actions">
                <button
                  className="button"
                  onClick={() => setReview(true)}
                  disabled={registered.includes(selected.slug)}
                >
                  {registered.includes(selected.slug)
                    ? 'Demo registration saved'
                    : 'Register interest'}
                  <ArrowUpRight size={17} />
                </button>
                <button
                  className="button secondary"
                  onClick={() =>
                    download(
                      'futurelab-' + selected.slug + '.ics',
                      calendarFile(
                        selected.title,
                        selected.date,
                        selected.slug === 'innovation-fair'
                          ? '09:30'
                          : selected.slug === 'community-festival'
                            ? '16:00'
                            : '10:00',
                        selected.slug === 'innovation-fair' ? 210 : 120,
                      ),
                      'text/calendar',
                    )
                  }
                >
                  Add to calendar
                  <CalendarDays size={16} />
                </button>
              </div>
              {registered.includes(selected.slug) && (
                <button
                  className="text-link"
                  onClick={() => setRegistered((old) => old.filter((s) => s !== selected.slug))}
                >
                  Cancel demo registration
                </button>
              )}
              <DemoNote>Fictional event. Calendar exports are labelled as demo events.</DemoNote>
            </div>
          </div>
        ) : (
          <>
            <div className="gallery-toolbar">
              <Filters items={['Agenda', 'Month view']} value={view} onChange={setView} />
              <select
                aria-label="Event month"
                value={month}
                onChange={(e) => setParams({ month: e.target.value })}
              >
                {['All months', 'OCT', 'NOV', 'DEC'].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className={view === 'Month view' ? 'card-grid' : ''}>
              {events
                .filter((e) => month === 'All months' || e.month === month)
                .map((e) => (
                  <Link
                    className={view === 'Month view' ? 'calendar-card' : 'event-row'}
                    key={e.slug}
                    to={'/events/' + e.slug}
                  >
                    <div className="event-date">
                      <strong>{e.day}</strong>
                      <span>{e.month} 2026</span>
                    </div>
                    <div className="event-text">
                      <span className="mono">{e.category}</span>
                      <h3>{e.title}</h3>
                      <p>{e.time}</p>
                    </div>
                    <ArrowUpRight />
                  </Link>
                ))}
            </div>
          </>
        )}
      </section>
      {review && selected && (
        <Modal title="Review event registration" onClose={() => setReview(false)}>
          <h3>{selected.title}</h3>
          <p>
            {selected.day} {selected.month} 2026 · {selected.time}
          </p>
          <DemoNote>
            Save a local interest registration. No email or real reservation is created.
          </DemoNote>
          <button
            className="button"
            disabled={!navigator.onLine}
            onClick={() => {
              setRegistered((old) => [...old, selected.slug])
              setReview(false)
            }}
          >
            Confirm demo registration
            <Check size={17} />
          </button>
        </Modal>
      )}
    </>
  )
}
function Notices({ slug }: { slug?: string }) {
  const [params, setParams] = useSearchParams()
  const [summary, setSummary] = useState(false)
  const selected = notices.find((n) => n.slug === slug)
  if (slug && !selected) return <NotFound />
  return (
    <>
      <PageIntro
        label="Noticeboard"
        title={selected ? selected.title : 'A little note from school.'}
        description="Dates to remember, ideas to explore, and the things you need to know."
      />
      <section className="section wrap compact-top reading-section">
        {selected ? (
          <article className="paper">
            <span className="mono">
              {selected.date} · {selected.category} · {selected.class}
            </span>
            <h2>{selected.title}</h2>
            <p>{selected.detail}</p>
            <button className="button secondary" onClick={() => setSummary(!summary)}>
              <Sparkles size={17} />
              {summary ? 'Hide summary' : 'Show demo summary'}
            </button>
            {summary && (
              <div className="inline-note">
                <strong>Curated summary · original notice remains authoritative</strong>
                <p>{selected.detail.split('. ').slice(0, 2).join('. ')}.</p>
                <small>
                  Source: {selected.title} · {selected.date}
                </small>
              </div>
            )}
            <p>
              <button
                className="text-link"
                onClick={() =>
                  download(
                    selected.slug + '.txt',
                    'FUTURELAB DEMO NOTICE\n' +
                      selected.date +
                      '\n' +
                      selected.title +
                      '\n\n' +
                      selected.detail,
                  )
                }
              >
                Download original text
                <Download size={16} />
              </button>
            </p>
          </article>
        ) : (
          <>
            <div className="filter-row">
              <select
                aria-label="Notice category"
                value={params.get('category') || 'All categories'}
                onChange={(e) =>
                  setParams((p) => {
                    p.set('category', e.target.value)
                    return p
                  })
                }
              >
                {['All categories', 'Academic', 'Activities', 'Community'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <select
                aria-label="Notice class"
                value={params.get('class') || 'All classes'}
                onChange={(e) =>
                  setParams((p) => {
                    p.set('class', e.target.value)
                    return p
                  })
                }
              >
                <option>All classes</option>
                <option>Classes VI–VIII</option>
              </select>
              <label>
                Published after
                <input
                  type="date"
                  value={params.get('after') || ''}
                  onChange={(e) =>
                    setParams((p) => {
                      p.set('after', e.target.value)
                      return p
                    })
                  }
                />
              </label>
            </div>
            {notices
              .filter(
                (n) =>
                  (!params.get('category') ||
                    params.get('category') === 'All categories' ||
                    n.category === params.get('category')) &&
                  (!params.get('class') ||
                    params.get('class') === 'All classes' ||
                    n.class === params.get('class')) &&
                  (!params.get('after') || n.date >= params.get('after')!),
              )
              .map((n) => (
                <Link className="notice-card" to={'/notices/' + n.slug} key={n.slug}>
                  <span className="mono">
                    {n.date} · {n.category}
                  </span>
                  <h3>
                    {n.title}
                    <ArrowUpRight size={20} />
                  </h3>
                  <p>{n.detail.slice(0, 120)}…</p>
                </Link>
              ))}
            <DemoNote>
              Only public sample notices are listed. Class-specific private communication belongs in
              the portal.
            </DemoNote>
          </>
        )}
      </section>
    </>
  )
}
function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const type = params.get('type') || 'All content'
  const mode = params.get('mode') || 'Keyword'
  const terms = (
    mode === 'Semantic preview'
      ? q.replace(/robotics|robot/gi, 'circuit code').replace(/seekhna|learn/gi, 'learning')
      : q
  )
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
  const found = publicIndex.filter(
    (x) =>
      (type === 'All content' || x.type === type) &&
      (!terms.length || terms.some((t) => (x.title + ' ' + x.text).toLowerCase().includes(t))),
  )
  return (
    <>
      <PageIntro label="Search" title="Follow that question." />
      <section className="section wrap compact-top">
        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
          <div>
            <Search />
            <input
              aria-label="Search public content"
              value={q}
              placeholder="Search for robotics, admissions, science…"
              onChange={(e) =>
                setParams((p) => {
                  p.set('q', e.target.value)
                  return p
                })
              }
            />
          </div>
        </form>
        <div className="gallery-toolbar">
          <Filters
            items={[
              'All content',
              'Academics',
              'Clubs',
              'Campus',
              'Notices',
              'Admissions',
              'Resources',
            ]}
            value={type}
            onChange={(v) =>
              setParams((p) => {
                p.set('type', v)
                return p
              })
            }
          />
          <select
            aria-label="Search mode"
            value={mode}
            onChange={(e) =>
              setParams((p) => {
                p.set('mode', e.target.value)
                return p
              })
            }
          >
            <option>Keyword</option>
            <option>Semantic preview</option>
          </select>
        </div>
        <p>{found.length} results in public demo content</p>
        {mode === 'Semantic preview' && (
          <DemoNote>Semantic preview uses a small synonym map, not live embeddings.</DemoNote>
        )}
        <div className="search-results">
          {found.map((x) => (
            <Link to={x.path} className="notice-card" key={x.path}>
              <span className="mono">{x.type} · Updated 24 September 2026</span>
              <h3>
                {x.title}
                <ArrowUpRight size={20} />
              </h3>
              <p>{x.text.slice(0, 180)}</p>
            </Link>
          ))}
        </div>
        {!found.length && (
          <Empty
            title="A new question to explore."
            description="Try a broader term like science, fees, books or campus."
          />
        )}
      </section>
    </>
  )
}
const docs = [
  {
    name: 'The FutureLab prospectus',
    category: 'School guides',
    stage: 'All stages',
    body: 'Our approach: curiosity, collaboration and learning through doing.\nPathways: Early years, Primary, Middle school, Secondary.\nThis is a fictional ICSE-oriented school concept. No affiliation is asserted.',
  },
  {
    name: 'Class 6 book list',
    category: 'Academics',
    stage: 'Middle school',
    body: 'Sample reading categories: English literature, Hindi reader, Mathematics, Physics, Chemistry, Biology, History and Geography.\nFinal titles and ISBNs require school approval; do not purchase from this illustrative list.',
  },
  {
    name: 'Academic calendar 2026–27',
    category: 'Calendars',
    stage: 'All stages',
    body: '5 October 2026: Term II begins\n17 October 2026: Discovery Day\n7 November 2026: Innovation Fair\n12 December 2026: Community Festival\nAll dates are fictional demo content.',
  },
  {
    name: 'Admission document checklist',
    category: 'Admissions',
    stage: 'All stages',
    body: 'Demo checklist: Birth certificate, previous report card (if applicable).\nUpload preview accepts PDF, JPG, PNG up to 10 MB; no file contents leave the device.',
  },
]
function Downloads() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All categories')
  const [stage, setStage] = useState('All stages')
  const visible = docs.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) &&
      (category === 'All categories' || d.category === category) &&
      (stage === 'All stages' || d.stage === 'All stages' || d.stage === stage),
  )
  return (
    <>
      <PageIntro
        label="Download centre"
        title="The little details, all together."
        description="School guides, learning resources and dates for your diary."
      />
      <section className="section wrap compact-top">
        <div className="filter-row">
          <input
            aria-label="Search downloads"
            placeholder="Search resources…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            aria-label="Resource category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {['All categories', ...new Set(docs.map((d) => d.category))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            aria-label="Resource stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          >
            {['All stages', ...stages.map((s) => s.name)].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        {visible.map((d) => (
          <div key={d.name} className="download-row">
            <div className="document-icon">
              <BookOpen />
            </div>
            <div>
              <h3>{d.name}</h3>
              <p>
                {d.category} · TXT · {new Blob([d.body]).size} bytes body · v1 · 24 Sep 2026
              </p>
            </div>
            <button
              className="icon-button"
              aria-label={'Download ' + d.name}
              onClick={() =>
                download(
                  d.name + '.txt',
                  'FUTURELAB SCHOOL — DEMO RESOURCE\nVersion 1 | 24 September 2026\n\n' + d.body,
                )
              }
            >
              <Download />
            </button>
          </div>
        ))}
        {!visible.length && <Empty />}
        <DemoNote>
          Downloadable text resources are sample guides, not official school documents.
        </DemoNote>
      </section>
    </>
  )
}
function Faculty({ slug }: { slug?: string }) {
  const [params, setParams] = useSearchParams()
  const d = params.get('department') || 'All departments'
  const person = faculty.find((f) => f.slug === slug)
  if (slug && !person) return <NotFound />
  return (
    <>
      <PageIntro
        label="Our educators"
        title={person ? person.name : 'Great questions need great guides.'}
        description={
          person
            ? person.intro
            : 'Meet the people who help curiosity become confidence. All profiles below are fictional.'
        }
      />
      <section className="section wrap compact-top">
        <Filters
          items={['All departments', 'Sciences', 'Technology', 'Humanities', 'Arts']}
          value={d}
          onChange={(v) => setParams({ department: v })}
        />
        <div className="card-grid">
          {(person
            ? [person]
            : faculty.filter((f) => d === 'All departments' || f.department === d)
          ).map((f) => (
            <Link className="faculty-card" to={'/faculty/' + f.slug} key={f.slug}>
              <div className="faculty-avatar">
                {f.initials}
                <span>✳</span>
              </div>
              <span className="mono">{f.department}</span>
              <h3>{f.name}</h3>
              <strong>{f.role}</strong>
              <p>{f.qualification}</p>
              <p>{f.intro}</p>
              <span className="text-link">
                Meet your guide
                <ArrowUpRight size={16} />
              </span>
            </Link>
          ))}
        </div>
        <DemoNote>
          Fictional staff profiles. Professional credentials and staff consent need verification
          before production.
        </DemoNote>
      </section>
    </>
  )
}
function About() {
  const [year, setYear] = useState('2026')
  return (
    <>
      <PageIntro
        label="Our story"
        title="A school built on “what if?”"
        description="What if learning began with a question? What if every child had room to be themselves? These are the ideas at the heart of FutureLab."
      />
      <section className="section wrap compact-top">
        <Photo
          className="story-cover"
          name="classroom"
          alt="Children learning together in a classroom"
        />
        <div className="feature-split text-split">
          <div>
            <Label>OUR APPROACH</Label>
            <h2>
              Strong roots.
              <br />
              Open horizons.
            </h2>
          </div>
          <div>
            <p>
              We imagine a school where rigorous learning and joyful discovery belong together.
              Where science sits alongside storytelling, and a good question matters as much as a
              correct answer.
            </p>
            <p>
              Our ICSE-oriented pathways build knowledge, language, creative confidence and a sense
              of responsibility to the world around us.
            </p>
            <ArrowLink to="/faculty">Meet the minds behind the learning</ArrowLink>
          </div>
        </div>
        <div className="principle-grid">
          {[
            ['01', 'Ask why.', 'Start with curiosity. Make connections. Look a little closer.'],
            [
              '02',
              'Give it a go.',
              'Experiment, reflect and discover that trying again is part of learning.',
            ],
            [
              '03',
              'Grow together.',
              'Listen with care, share ideas and celebrate different perspectives.',
            ],
          ].map(([n, t, d]) => (
            <article className="paper" key={n}>
              <span className="mono">{n} / OUR WAY OF LEARNING</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
        <div className="section-heading">
          <h2>A story taking shape.</h2>
          <Filters items={['2024', '2025', '2026']} value={year} onChange={setYear} />
        </div>
        <div className="timeline-panel">
          <strong>{year}</strong>
          <div>
            <h3>
              {year === '2024'
                ? 'The first question'
                : year === '2025'
                  ? 'Making room for discovery'
                  : 'A world of possibilities'}
            </h3>
            <p>
              {year === '2024'
                ? 'A fictional founding team imagines a school built around inquiry.'
                : year === '2025'
                  ? 'The concept develops learning pathways, creative studios and shared spaces.'
                  : 'The FutureLab frontend brings that school concept to life through an interactive preview.'}
            </p>
            <DemoNote>Illustrative timeline; these are not historical claims.</DemoNote>
          </div>
        </div>
      </section>
    </>
  )
}
function SimpleForm({ kind }: { kind: string }) {
  const [sent, setSent] = useState(false)
  const [review, setReview] = useState(false)
  const [values, setValues] = useState<Record<string, string>>({})
  const [file, setFile] = useState('')
  return sent ? (
    <Success title="Your demo request is saved.">
      <p>Reference FL-{kind.toUpperCase().slice(0, 3)}-2026-001</p>
      <p>No message or document was sent. This is a frontend preview.</p>
      <button
        className="button secondary"
        onClick={() => {
          setSent(false)
          setValues({})
          setFile('')
        }}
      >
        Start another preview
      </button>
    </Success>
  ) : (
    <form
      className="form-card"
      onSubmit={(e) => {
        e.preventDefault()
        setReview(true)
      }}
    >
      <h2>
        {kind === 'careers'
          ? 'Make a difference with us.'
          : kind === 'alumni'
            ? 'Stay part of the story.'
            : 'Let’s start a conversation.'}
      </h2>
      <DemoNote>Please use fictional details only. Nothing is sent to a school.</DemoNote>
      <div className="form-grid">
        <label>
          Name
          <input
            required
            value={values.name || ''}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            placeholder="Demo name"
          />
        </label>
        <label>
          Email
          <input
            required
            type="email"
            value={values.email || ''}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            placeholder="demo@example.com"
          />
        </label>
      </div>
      <label>
        {kind === 'careers' ? 'Role of interest' : kind === 'alumni' ? 'Graduation year' : 'Topic'}
        <select
          value={values.topic || ''}
          required
          onChange={(e) => setValues({ ...values, topic: e.target.value })}
        >
          <option value="">Choose one</option>
          {(kind === 'careers'
            ? ['Science educator', 'Creative arts educator']
            : kind === 'alumni'
              ? ['2024', '2025', '2026']
              : ['Admissions', 'Transport', 'Academics', 'General enquiry']
          ).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label>
        {kind === 'alumni' ? 'Your story' : 'Your message'}
        <textarea
          required
          minLength={10}
          value={values.message || ''}
          onChange={(e) => setValues({ ...values, message: e.target.value })}
          placeholder="Tell us a little more…"
        />
      </label>
      {kind === 'careers' && (
        <label>
          CV preview · PDF, up to 10 MB
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f && (!f.name.toLowerCase().endsWith('.pdf') || f.size > 10 * 1024 * 1024)) {
                e.target.setCustomValidity('Choose a PDF under 10 MB.')
                e.target.reportValidity()
                setFile('')
              } else {
                e.target.setCustomValidity('')
                setFile(f?.name || '')
              }
            }}
          />
          <small>{file ? 'Local preview: ' + file : 'File contents are never uploaded.'}</small>
        </label>
      )}
      <label className="checkbox">
        <input required type="checkbox" />I understand this is a demo using fictional information.
      </label>
      <button className="button" disabled={!navigator.onLine}>
        Review request
        <ArrowUpRight size={17} />
      </button>
      {review && (
        <Modal title="Review your demo request" onClose={() => setReview(false)}>
          <dl className="review-list">
            {Object.entries(values).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          {file && <p>CV filename: {file} · not uploaded</p>}
          <p>Destination: demo {values.topic || kind} queue.</p>
          <button
            className="button"
            disabled={!navigator.onLine}
            onClick={() => {
              setSent(true)
              setReview(false)
            }}
            type="button"
          >
            Confirm local preview
            <Check size={17} />
          </button>
        </Modal>
      )}
    </form>
  )
}
function Contact({ transport = false }: { transport?: boolean }) {
  const [pin, setPin] = useState('')
  const [result, setResult] = useState('')
  const [estimate, setEstimate] = useState(false)
  return (
    <>
      <PageIntro
        label={transport ? 'Transport' : 'Contact & directions'}
        title={
          transport
            ? 'A good day starts with a good journey.'
            : 'Every great journey starts with hello.'
        }
        description={
          transport
            ? 'Explore sample transport coverage and the information families need before the first school run.'
            : 'Have a question about learning, admissions or school life? We’d love to help you explore.'
        }
      />
      <section className="wrap section compact-top">
        <div className="feature-split">
          <div className="contact-card">
            <div className="abstract-map">
              <div />
              <MapPin size={48} />
              <span>FUTURELAB · DISCOVERY CAMPUS</span>
            </div>
            <h2>Your journey to FutureLab</h2>
            <p>
              This is a fictional campus. The school’s verified address, entrance, accessibility
              information and office contacts need to be configured.
            </p>
            <div className="detail-line">
              <Clock size={17} />
              Sample office hours: Mon–Fri, 09:00–16:00 IST
            </div>
            <button className="button secondary" disabled>
              <MapPin size={16} />
              Configure school location
            </button>
            <button className="text-link" onClick={() => setEstimate(!estimate)}>
              Travel estimate preview
              <ExternalLink size={16} />
            </button>
            {estimate && (
              <p className="inline-note">
                A verified destination and routing provider are required. No estimated travel time
                is available; geolocation is not requested.
              </p>
            )}
          </div>
          <div>
            {transport ? (
              <div className="form-card">
                <Label>SAMPLE COVERAGE CHECK</Label>
                <h2>Does your area connect?</h2>
                <p>Try fictional locality “Discovery Park” or demo code “000001”.</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setResult(
                      /^(000001|discovery park)$/i.test(pin.trim())
                        ? 'Sample route D1 covers Discovery Park. This is indicative only; route and seat availability require office confirmation.'
                        : 'No approved demo coverage found. Ask the school office to check your area.',
                    )
                  }}
                >
                  <label>
                    Locality or demo code
                    <input
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Discovery Park"
                    />
                  </label>
                  <button className="button">
                    Check coverage
                    <ArrowRight size={17} />
                  </button>
                </form>
                {result && (
                  <p className="inline-note" role="status">
                    {result}
                  </p>
                )}
                <p>
                  <Link to="/portal/transport" className="text-link">
                    Open assigned-bus preview
                    <ArrowUpRight size={16} />
                  </Link>
                </p>
                <DemoNote>Public coverage never exposes student assignments or live GPS.</DemoNote>
              </div>
            ) : (
              <SimpleForm kind="enquiry" />
            )}
          </div>
        </div>
      </section>
    </>
  )
}
function Community({ kind, slug }: { kind: string; slug?: string }) {
  const career = kind === 'careers'
  if (
    slug &&
    !['science-educator', 'creative-arts-educator', 'the-question-that-stayed'].includes(slug)
  )
    return <NotFound />
  return (
    <>
      <PageIntro
        label={career ? 'Careers' : 'Alumni community'}
        title={career ? 'Help shape what comes next.' : 'Once curious. Always curious.'}
        description={
          career
            ? 'Bring your questions, your creativity and your care. Explore fictional teaching opportunities at FutureLab.'
            : 'A school journey stays with you. Share a story, reconnect and inspire the next generation.'
        }
      />
      <section className="section wrap compact-top">
        {career ? (
          <div className="principle-grid">
            {['Science educator', 'Creative arts educator'].map((t) => (
              <Link
                className="paper"
                to={'/careers/' + t.toLowerCase().replaceAll(' ', '-')}
                key={t}
              >
                <span className="mono">TEACHING · DEMO VACANCY</span>
                <h3>{t}</h3>
                <p>Discovery campus · Full time</p>
                <p>
                  Sample requirements: subject expertise, teaching qualification and a love of
                  inquiry-based learning.
                </p>
                <span className="text-link">
                  Explore this role
                  <ArrowUpRight size={17} />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="feature-split">
            <Photo name="graduates" alt="Students together at a school event" />
            <div>
              <Label>ALUMNI STORIES</Label>
              <h2>The question that stayed.</h2>
              <p>
                “The best thing I learned was how to keep asking questions.” A fictional alumni
                reflection on curiosity, collaboration and finding a path.
              </p>
              <ArrowLink to="/stories/the-question-that-stayed">Read the sample story</ArrowLink>
            </div>
          </div>
        )}
        <div className="reading-section">
          <SimpleForm kind={career ? 'careers' : 'alumni'} />
        </div>
      </section>
    </>
  )
}
function Policies({ kind }: { kind: string }) {
  const [open, setOpen] = useState('')
  const title =
    kind === 'privacy'
      ? 'Your trust matters.'
      : kind === 'accessibility'
        ? 'A school website for everyone.'
        : 'A little guidance goes a long way.'
  const items =
    kind === 'privacy'
      ? [
          [
            'What is stored?',
            'Only fictional demo drafts and preferences are stored in namespaced browser storage. Do not enter real personal information. Upload contents are not persisted or transmitted.',
          ],
          [
            'How can I clear my data?',
            'Use Reset demo in the footer to clear FutureLab browser storage. No production privacy policy or consent process is implemented.',
          ],
          [
            'Before a real launch',
            'School-approved retention periods, access controls, consent, data processors and privacy contacts must replace this placeholder.',
          ],
        ]
      : kind === 'accessibility'
        ? [
            [
              'Keyboard & motion',
              'Use Tab to move between controls, Enter to activate, Escape to close dialogs and arrow keys inside gallery lightboxes. Reduced-motion preferences are respected.',
            ],
            [
              'Alternative formats',
              'Campus spaces have a text list alongside the diagram and optional 3D model. Charts include data tables. Photos have descriptive text alternatives.',
            ],
            [
              'Get assistance',
              'Use the contact preview for a sample accessibility enquiry. A verified support contact must be configured before launch.',
            ],
          ]
        : [
            [
              'How do I apply?',
              'Start in Admissions. Complete the four-step demo application, review it, then save a local reference. Nothing is submitted to a real school.',
            ],
            [
              'Is this a real affiliated school?',
              'FutureLab is a fictional ICSE-oriented school concept. There is no claim of verified affiliation, location or accreditation.',
            ],
            [
              'How does the portal work?',
              'The portal lets you switch between fictional parent, student, teacher and administrator previews. This is not a secure login or a real student information system.',
            ],
            [
              'Are payments and AI live?',
              'No. Payment screens model pending and verified sample states. The assistant uses curated answers. Live providers need backend integration.',
            ],
            [
              'Where are my saved actions?',
              'Demo applications, club choices and some portal actions remain in this browser until you use Reset demo.',
            ],
          ]
  return (
    <>
      <PageIntro label={kind} title={title} />
      <section className="section wrap compact-top reading-section">
        {items.map(([q, a]) => (
          <div className="faq" key={q}>
            <button onClick={() => setOpen(open === q ? '' : q)} aria-expanded={open === q}>
              {q}
              <Plus size={18} />
            </button>
            {open === q && <p>{a}</p>}
          </div>
        ))}
        <div className="banner-card">
          <div>
            <h3>Still curious?</h3>
            <p>There’s always room for another question.</p>
          </div>
          <ButtonLink to="/contact">Get in touch</ButtonLink>
        </div>
      </section>
    </>
  )
}
export function NotFound() {
  return (
    <section className="not-found wrap">
      <span className="mono">404 / A LITTLE DETOUR</span>
      <h1>
        Even curiosity
        <br />
        takes a wrong turn.
      </h1>
      <p>This page doesn’t exist. Let’s find your next discovery.</p>
      <ButtonLink to="/">Back to possibilities</ButtonLink>
    </section>
  )
}
export default function Public() {
  const path = useLocation().pathname.split('/').filter(Boolean)
  const [first, slug] = path
  if (first === 'gallery') return <Gallery />
  if (first === 'academics') return <Academics key={slug || 'index'} slug={slug} />
  if (first === 'campus') return <Campus key={slug || 'index'} slug={slug} />
  if (first === 'school-life')
    return <StudentLife slug={path[1] === 'projects' ? path[2] : undefined} />
  if (first === 'achievements') return <StudentLife achievements />
  if (first === 'clubs') return <Clubs slug={slug} />
  if (first === 'events') return <Events slug={slug} />
  if (first === 'notices') return <Notices slug={slug} />
  if (first === 'search') return <SearchPage />
  if (first === 'downloads') return <Downloads />
  if (first === 'faculty') return <Faculty slug={slug} />
  if (first === 'about') return <About />
  if (first === 'contact' || first === 'transport')
    return <Contact transport={first === 'transport'} />
  if (first === 'careers' || first === 'alumni' || first === 'stories')
    return <Community kind={first} slug={slug} />
  if (['help', 'privacy', 'accessibility'].includes(first)) return <Policies kind={first} />
  if (first === 'verify')
    return (
      <>
        <PageIntro label="Verification" title="Check a school document." />
        <section className="wrap section compact-top">
          <div className="paper">
            <h2>
              {slug === 'demo-valid'
                ? 'Sample certificate verified'
                : 'This token could not be verified.'}
            </h2>
            <p>
              {slug === 'demo-valid'
                ? 'Demo certificate FL-CERT-001 · Participation · fictional record. No personal information is disclosed.'
                : 'The token may be expired, revoked or unknown. Ask the issuing school to verify the document.'}
            </p>
            <DemoNote>
              Production verification requires an opaque server-issued, revocable token.
            </DemoNote>
          </div>
        </section>
      </>
    )
  return <NotFound />
}
