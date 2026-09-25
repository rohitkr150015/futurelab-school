import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import {
  ArrowUpRight,
  Search,
  Menu,
  X,
  Sparkles,
  Send,
  Globe2,
  ChevronDown,
  ArrowRight,
  RotateCcw,
  WifiOff,
  Mic,
} from 'lucide-react'
import { Brand, ButtonLink, Modal, DemoNote } from './ui'
import { demoAnswer, resetDemo, useStored } from './lib'
import Home from './Home'
import './styles.css'
const Public = lazy(() => import('./Public'))
const Admissions = lazy(() => import('./Admissions'))
const Portal = lazy(() => import('./Portal'))
const nav = [
  {
    name: 'Learn',
    to: '/academics',
    links: [
      ['Learning pathways', '/academics'],
      ['Our approach', '/about'],
      ['Meet our educators', '/faculty'],
      ['Resources & downloads', '/downloads'],
    ],
  },
  {
    name: 'Explore campus',
    to: '/campus',
    links: [
      ['Campus explorer', '/campus'],
      ['Plan your visit', '/visit'],
      ['Transport & coverage', '/transport'],
    ],
  },
  {
    name: 'Student life',
    to: '/school-life',
    links: [
      ['Life at FutureLab', '/school-life'],
      ['The memory book', '/gallery'],
      ['Clubs & passions', '/clubs'],
      ['Student achievements', '/achievements'],
    ],
  },
  {
    name: 'Admissions',
    to: '/admissions',
    links: [
      ['Your next chapter', '/admissions'],
      ['Fee estimator', '/admissions/fees'],
      ['Check eligibility', '/admissions/eligibility'],
      ['Track application', '/admissions/track'],
    ],
  },
  {
    name: 'Community',
    to: '/events',
    links: [
      ['What’s happening', '/events'],
      ['Noticeboard', '/notices'],
      ['Alumni stories', '/alumni'],
      ['Join our team', '/careers'],
      ['Get in touch', '/contact'],
    ],
  },
]
function ScrollManager() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    const part = pathname.split('/').filter(Boolean).at(-1)
    document.title = `${part ? part.replaceAll('-', ' ').replace(/^./, (s) => s.toUpperCase()) : 'Big futures. Curious minds.'} | FutureLab School`
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute(
        'content',
        pathname.startsWith('/portal') ? 'noindex,nofollow' : 'noindex,follow',
      )
  }, [pathname])
  return null
}
function Chat() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('school')
  const [q, setQ] = useState('')
  const [voice, setVoice] = useState(false)
  const [messages, setMessages] = useState<
    { q: string; text: string; path: string; source: string }[]
  >([])
  function ask(question: string) {
    if (!question.trim()) return
    setMessages((m) => [...m, { q: question, ...demoAnswer(question, mode) }])
    setQ('')
  }
  return (
    <>
      <button
        className="chat-launch"
        aria-label="Ask FutureLab assistant"
        onClick={() => setOpen(true)}
      >
        <Sparkles size={19} />
        <span>Ask FutureLab</span>
        <span className="status-dot" />
      </button>
      {open && (
        <Modal title="A little help, a little wonder." onClose={() => setOpen(false)}>
          <div className="chat-content">
            <div className="segmented">
              {['school', 'study'].map((m) => (
                <button
                  key={m}
                  className={mode === m ? 'active' : ''}
                  onClick={() => {
                    setMode(m)
                    setMessages([])
                  }}
                >
                  {m === 'school' ? 'School information' : 'Study help'}
                </button>
              ))}
            </div>
            <DemoNote>Demo answers · curated examples, not a live AI service.</DemoNote>
            <div className="chat-messages" aria-live="polite">
              <div className="chat-answer">
                <Sparkles />
                <p>
                  Hello, curious mind.{' '}
                  {mode === 'school'
                    ? 'Ask me about admissions, fees, clubs or a visit.'
                    : 'Let’s explore electric circuits, one hint at a time.'}
                </p>
              </div>
              {messages.map((m, i) => (
                <div key={i}>
                  <div className="chat-question">{m.q}</div>
                  <div className="chat-answer">
                    <p>{m.text}</p>
                    <Link to={m.path} onClick={() => setOpen(false)}>
                      {m.source}
                      <ArrowUpRight size={14} />
                    </Link>
                    <small>Updated 24 September 2026 · sample source</small>
                  </div>
                </div>
              ))}
            </div>
            <div className="suggestions">
              {(mode === 'school'
                ? ['How do I apply?', 'Explore robotics', 'Plan a visit']
                : ['How does a circuit work?']
              ).map((s) => (
                <button key={s} onClick={() => ask(s)}>
                  {s}
                  <ArrowUpRight size={13} />
                </button>
              ))}
            </div>
            <form
              className="chat-input"
              onSubmit={(e) => {
                e.preventDefault()
                ask(q)
              }}
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="What are you curious about?"
                aria-label="Your question"
                required
                maxLength={500}
              />
              <button
                type="button"
                className="icon-button"
                aria-label="Voice assistant availability"
                onClick={() => setVoice(!voice)}
              >
                <Mic size={18} />
              </button>
              <button className="icon-button" aria-label="Send question">
                <Send size={19} />
              </button>
            </form>
            {voice && (
              <p role="status" className="inline-note">
                Voice is an integration preview. Connect a speech provider to enable it; you can
                always type your question.
              </p>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
function Shell() {
  const loc = useLocation()
  const navigate = useNavigate()
  const [hindi, setHindi] = useStored('locale', false)
  const [mobile, setMobile] = useState(false)
  const [search, setSearch] = useState(false)
  const [query, setQuery] = useState('')
  const [online, setOnline] = useState(navigator.onLine)
  const [reset, setReset] = useState(false)
  useEffect(() => {
    // A router navigation closes the mobile disclosure, including browser back/forward.
    // eslint-disable-next-line react/set-state-in-effect
    setMobile(false)
  }, [loc.pathname])
  useEffect(() => {
    const on = () => setOnline(navigator.onLine)
    window.addEventListener('online', on)
    window.addEventListener('offline', on)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', on)
    }
  }, [])
  return (
    <>
      <ScrollManager />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="demo-bar">
        <span>
          <span className="status-dot" /> DEMO SCHOOL{' '}
          <span className="demo-long">— sample data; no real submission or payment</span>
        </span>
        <div>
          <Link to="/admissions">
            A world of possibilities awaits <ArrowUpRight size={12} />
          </Link>
          <button onClick={() => setHindi(!hindi)} aria-label="Toggle Hindi language">
            <Globe2 size={12} />
            {hindi ? 'EN' : 'हिंदी'}
          </button>
        </div>
      </div>
      {!online && (
        <div className="offline" role="status">
          <WifiOff size={16} />
          You’re offline. Browsing cached public pages may work; demo submissions are paused.
        </div>
      )}
      <header className="site-header">
        <div className="nav-wrap">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map((n) => (
              <div className="nav-item" key={n.name}>
                <Link className={loc.pathname.startsWith(n.to) ? 'current' : ''} to={n.to}>
                  {n.name}
                  <ChevronDown size={12} />
                </Link>
                <div className="mega-menu">
                  <span className="mono">A WORLD OF {n.name.toUpperCase()}</span>
                  {n.links.map(([name, path]) => (
                    <Link key={path} to={path}>
                      {name}
                      <ArrowUpRight size={16} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              className="icon-button"
              aria-label="Search website"
              onClick={() => setSearch(true)}
            >
              <Search size={19} />
            </button>
            <Link className="portal-link" to="/portal/parent">
              School portal
              <ArrowUpRight size={15} />
            </Link>
            <button
              className="icon-button mobile-toggle"
              aria-label={mobile ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobile}
              onClick={() => setMobile(!mobile)}
            >
              {mobile ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobile && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {nav.map((n) => (
              <details key={n.name}>
                <summary>
                  {n.name}
                  <ChevronDown size={17} />
                </summary>
                {n.links.map(([name, path]) => (
                  <Link key={path} to={path}>
                    {name}
                    <ArrowUpRight size={16} />
                  </Link>
                ))}
              </details>
            ))}
            <ButtonLink to="/admissions/apply">Start your application</ButtonLink>
          </nav>
        )}
      </header>
      {hindi && (
        <div className="language-note">
          हिंदी पूर्वावलोकन · Detailed pages currently use English fallback.
        </div>
      )}
      <main id="main">
        <Suspense
          fallback={
            <div className="loading-page" role="status">
              <div className="loading-orbit" />
              <span>Making room for possibilities…</span>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home hindi={hindi} />} />
            <Route path="/admissions/*" element={<Admissions />} />
            <Route path="/visit" element={<Admissions />} />
            <Route path="/portal/*" element={<Portal />} />
            <Route path="/login" element={<Portal />} />
            <Route path="/auth/callback" element={<Portal />} />
            <Route path="/*" element={<Public />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="footer">
        <div className="wrap">
          <div className="footer-top">
            <div>
              <Brand />
              <h3>
                Stay curious.
                <br />
                The future is yours.
              </h3>
              <p>
                An imaginative ICSE-oriented school concept.
                <br />
                Built around the possibilities in every child.
              </p>
              <span className="footer-note">FICTIONAL SCHOOL · FRONTEND PREVIEW</span>
            </div>
            {[
              {
                title: 'Discover',
                links: [
                  ['Our story', '/about'],
                  ['Learning pathways', '/academics'],
                  ['Campus & spaces', '/campus'],
                  ['Student life', '/school-life'],
                  ['The gallery', '/gallery'],
                ],
              },
              {
                title: 'Your next step',
                links: [
                  ['Admissions', '/admissions'],
                  ['Plan a visit', '/visit'],
                  ['Fee estimator', '/admissions/fees'],
                  ['School portal', '/portal/parent'],
                  ['Work with us', '/careers'],
                ],
              },
              {
                title: 'Let’s connect',
                links: [
                  ['Contact & directions', '/contact'],
                  ['News & notices', '/notices'],
                  ['School calendar', '/events'],
                  ['Alumni community', '/alumni'],
                  ['Help centre', '/help'],
                ],
              },
            ].map((g) => (
              <div className="footer-group" key={g.title}>
                <h4>{g.title}</h4>
                {g.links.map(([name, to]) => (
                  <Link to={to} key={to}>
                    {name}
                    <ArrowUpRight size={13} />
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span>© 2026 FutureLab School. A world of possibilities.</span>
            <div>
              <Link to="/privacy">Privacy</Link>
              <Link to="/accessibility">Accessibility</Link>
              <button onClick={() => setReset(true)}>
                <RotateCcw size={12} />
                Reset demo
              </button>
            </div>
          </div>
          <p className="asset-disclaimer">
            Supplied school photos are used as illustrative assets. No affiliation with the schools
            pictured is claimed. Publication requires permission and verified school content.
          </p>
        </div>
      </footer>
      <Chat />
      {search && (
        <Modal title="Follow your curiosity." onClose={() => setSearch(false)}>
          <form
            className="search-form"
            onSubmit={(e) => {
              e.preventDefault()
              setSearch(false)
              navigate('/search?q=' + encodeURIComponent(query))
            }}
          >
            <label htmlFor="global-search">Search programmes, clubs, campus and resources</label>
            <div>
              <input
                id="global-search"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try robotics or admissions…"
              />
              <button className="button">
                Search
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
          <div className="quick-links">
            {[
              ['Admissions', '/admissions'],
              ['Gallery', '/gallery'],
              ['The Tinker Club', '/clubs/robotics'],
              ['School calendar', '/events'],
            ].map(([t, p]) => (
              <Link key={p} to={p} onClick={() => setSearch(false)}>
                {t}
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </Modal>
      )}
      {reset && (
        <Modal title="Reset your demo?" onClose={() => setReset(false)}>
          <p>This clears saved demo applications, bookings and portal actions from this browser.</p>
          <div className="form-actions">
            <button className="button secondary" onClick={() => setReset(false)}>
              Keep exploring
            </button>
            <button className="button" onClick={resetDemo}>
              Reset demo
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <Shell />
      </MotionConfig>
    </BrowserRouter>
  )
}
