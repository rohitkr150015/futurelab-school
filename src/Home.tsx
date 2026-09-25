import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDown,
  ArrowUpRight,
  FlaskConical,
  Sparkles,
  Play,
  Plus,
  MoveUpRight,
  Compass,
  Heart,
  BookOpen,
  Microscope,
} from 'lucide-react'
import { motion } from 'motion/react'
import { stages, projects, events } from './data'
import { ArrowLink, ButtonLink, Label, Photo, Reveal, DemoNote } from './ui'

export default function Home({ hindi }: { hindi: boolean }) {
  const [stage, setStage] = useState(1)
  const selected = stages[stage]
  return (
    <>
      <section className="hero-shell">
        <div className="hero wrap">
          <Reveal className="hero-copy">
            <div className="hero-kicker">
              <span className="status-dot" /> A NEW SCHOOL OF THOUGHT{' '}
              <span className="small-line" />
            </div>
            <h1>
              {hindi ? (
                <>
                  छोटी जिज्ञासा।
                  <br />
                  बड़ी <em>संभावनाएँ।</em>
                </>
              ) : (
                <>
                  Big futures.
                  <br />
                  Start with
                  <br />{' '}
                  <span className="curious-word">
                    curious{' '}
                    <svg viewBox="0 0 290 20" aria-hidden="true">
                      <path d="M3 15 Q130 -5 285 10" />
                    </svg>
                  </span>{' '}
                  minds<span className="cyan">.</span>
                </>
              )}
            </h1>
            <p>
              {hindi
                ? 'सवाल पूछने, सपने देखने और करके सीखने की जगह। हर बच्चे में छिपी संभावनाओं के लिए।'
                : 'A place to ask why. To try, to make, to become. An ICSE-oriented learning journey for a world of possibilities.'}
            </p>
            <div className="hero-actions">
              <ButtonLink to="/admissions">
                {hindi ? 'अपना सफर शुरू करें' : 'Find your beginning'}
              </ButtonLink>
              <Link className="watch-link" to="/campus">
                <span>
                  <Play size={14} fill="currentColor" />
                </span>
                Explore our world
              </Link>
            </div>
            <div className="hero-foot">
              <span className="tiny-stars">✳</span>
              <span>
                Rooted in values.
                <br />
                <strong>Designed for tomorrow.</strong>
              </span>
              <div className="hero-foot-divider" />
              <span>
                EARLY YEARS TO CLASS X<br />
                <strong>One extraordinary journey.</strong>
              </span>
            </div>
          </Reveal>
          <Reveal className="hero-visual" delay={0.15}>
            <div className="orbital orbital-one" />
            <div className="orbital orbital-two" />
            <div className="hero-image">
              <Photo name="hero" alt="A student discovering a book in the school library" eager />
              <div className="hero-image-shade" />
              <span className="image-corner">01 / A WORLD OF BOOKS</span>
              <div className="image-caption">
                <span>
                  A little wonder.
                  <br />
                  <strong>A world to discover.</strong>
                </span>
                <Link
                  to="/school-life/projects/little-ideas-big-impact"
                  aria-label="Discover student science projects"
                >
                  <ArrowUpRight />
                </Link>
              </div>
            </div>
            <div className="floating-label label-top">
              <FlaskConical size={17} />
              <span>Curiosity, in action.</span>
              <span className="status-dot" />
            </div>
            <Link to="/gallery" className="hero-mini-photo">
              <Photo name="children" alt="Young learners working on a colourful project" eager />
              <span>
                Little moments. Big memories.
                <ArrowUpRight size={16} />
              </span>
            </Link>
            <div className="possibility-sticker">
              <Sparkles size={23} />
              <span>
                WHAT IF
                <br />
                STARTS HERE.
              </span>
            </div>
            <svg className="hero-doodle" viewBox="0 0 100 100" aria-hidden="true">
              <path d="M12 65 Q60 90 71 34 M49 44 L72 30 L84 55" />
            </svg>
          </Reveal>
        </div>
        <div className="hero-bottom wrap">
          <a href="#learning">
            <span className="scroll-circle">
              <ArrowDown size={16} />
            </span>
            SCROLL TO DISCOVER
          </a>
          <span>
            A little wonder goes a long way.
            <Sparkles size={16} />
          </span>
        </div>
      </section>
      <div className="values-ribbon">
        <div className="wrap">
          <span>Curiosity is our starting point.</span>
          <b>✳</b>
          <span>Learning by doing.</span>
          <b>✳</b>
          <span>Room to be yourself.</span>
          <b>✳</b>
          <span>Possibilities, everywhere.</span>
        </div>
      </div>
      <section id="learning" className="section wrap learning-section">
        <Reveal className="section-heading">
          <div>
            <Label>A JOURNEY, NOT JUST A CURRICULUM</Label>
            <h2>
              Growing minds.
              <br />
              <span className="muted">At every stage.</span>
            </h2>
          </div>
          <p>
            Every child learns differently. Our learning pathways make room for their questions,
            their strengths, and the person they’re becoming.
          </p>
        </Reveal>
        <div className="stage-tabs" role="tablist" aria-label="Academic stage">
          {stages.map((s, i) => (
            <button
              id={`home-tab-${s.id}`}
              aria-controls="home-stage-panel"
              role="tab"
              aria-selected={stage === i}
              key={s.id}
              onClick={() => setStage(i)}
            >
              <span className="tab-index">0{i + 1}</span>
              <strong>{s.name}</strong>
              <small>{s.range}</small>
              <ArrowUpRight size={19} />
            </button>
          ))}
        </div>
        <motion.div
          role="tabpanel"
          id="home-stage-panel"
          aria-labelledby={`home-tab-${selected.id}`}
          className="stage-content"
          key={selected.id}
          initial={{ opacity: 0.4, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="stage-photo">
            <Photo name={selected.image} alt={`${selected.name} learning environment`} />
            <span>
              {selected.ages} <Plus size={16} />
            </span>
          </div>
          <div className="stage-copy">
            <span className="mono">THE {selected.name.toUpperCase()} YEARS</span>
            <h3>{selected.headline}</h3>
            <p>{selected.description}</p>
            <div className="tag-row">
              {selected.subjects.slice(0, 3).map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
            <ArrowLink to={`/academics/${selected.id}`}>Explore the learning pathway</ArrowLink>
          </div>
        </motion.div>
      </section>
      <section className="section projects-section">
        <div className="wrap">
          <Reveal className="section-heading">
            <div>
              <Label>IDEAS WITH THEIR SLEEVES ROLLED UP</Label>
              <h2>
                Made of questions.
                <br />
                <span className="muted">Built by our students.</span>
              </h2>
            </div>
            <ArrowLink to="/school-life">Meet our young makers</ArrowLink>
          </Reveal>
          <div className="project-grid">
            {projects.map((p, i) => (
              <Reveal className="project-card" key={p.slug} delay={i * 0.08}>
                <Link to={`/school-life/projects/${p.slug}`}>
                  <div className="project-photo">
                    <Photo name={p.image} alt={p.title} />
                    <span className="round-link">
                      <ArrowUpRight />
                    </span>
                    <span className="photo-tag">{p.class}</span>
                  </div>
                  <div className="project-info">
                    <span className="mono">
                      0{i + 1} / {p.label}
                    </span>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <DemoNote>
            Student stories and class labels are illustrative; photos are from the supplied asset
            collection.
          </DemoNote>
        </div>
      </section>
      <section className="campus-feature wrap">
        <Reveal className="campus-copy">
          <Label>SPACE TO THINK BIGGER</Label>
          <h2>
            Not just classrooms.
            <br />A whole world
            <br />
            to <em>discover.</em>
          </h2>
          <p>
            From that first lab experiment to a book you can’t put down. Explore the spaces where
            everyday learning becomes something extraordinary.
          </p>
          <ButtonLink to="/campus">Step inside FutureLab</ButtonLink>
          <div className="campus-facts">
            <span>
              <Microscope />
              Hands-on labs
            </span>
            <span>
              <BookOpen />
              Reading spaces
            </span>
            <span>
              <Heart />
              Room to play
            </span>
          </div>
        </Reveal>
        <Reveal className="campus-collage">
          <Photo name="campus" alt="Illustrative school campus building" />
          <div className="campus-map-label">
            <Compass />
            <span>
              YOUR NEXT DISCOVERY
              <br />
              <strong>Starts right here.</strong>
            </span>
          </div>
          <Photo
            name="library"
            alt="A school library with books and reading spaces"
            className="campus-inset"
          />
          <Link
            className="map-pin"
            to="/campus/discovery-lab"
            aria-label="Explore the discovery lab"
          >
            <Plus />
          </Link>
          <span className="campus-coordinates">CAMPUS EXPLORER / 05 SPACES</span>
        </Reveal>
      </section>
      <section className="life-section">
        <div className="wrap">
          <Reveal className="section-heading">
            <div>
              <Label>THE DAYS THEY’LL ALWAYS REMEMBER</Label>
              <h2>
                Life here.
                <br />
                <span>In full colour.</span>
              </h2>
            </div>
            <div>
              <p>
                The cheers. The friendships. The “I did it!” moments.
                <br />
                There’s a whole lot of growing up beyond the books.
              </p>
              <ArrowLink to="/gallery" light>
                Open the memory book
              </ArrowLink>
            </div>
          </Reveal>
          <div className="life-grid">
            <Link to="/gallery?category=Arts+%26+culture" className="life-tall">
              <Photo name="dance" alt="Students perform a vibrant traditional dance" />
              <span>
                <small>TAKE THE STAGE</small>
                <strong>
                  A little spotlight.
                  <br />A lot of self-belief.
                </strong>
              </span>
              <ArrowUpRight />
            </Link>
            <Link to="/gallery?category=Sports">
              <Photo name="sports" alt="Students participating in an outdoor sports activity" />
              <span>
                <small>PLAY YOUR HEART OUT</small>
                <strong>Better, together.</strong>
              </span>
              <ArrowUpRight />
            </Link>
            <Link to="/gallery?category=Learning">
              <Photo name="children" alt="Young students making a project together" />
              <span>
                <small>FIND YOUR PEOPLE</small>
                <strong>Belonging begins here.</strong>
              </span>
              <ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
      <section className="section wrap">
        <Reveal className="section-heading">
          <div>
            <Label>ROOM TO FLOURISH</Label>
            <h2>Many ways to shine.</h2>
          </div>
          <p>
            Success is more than a score. It’s the confidence to speak up, the courage to try again,
            and the joy of finding what you love.
          </p>
        </Reveal>
        <div className="outcome-grid">
          {[
            {
              n: '4',
              t: 'Learning pathways',
              d: 'One connected journey, from early years to secondary.',
            },
            {
              n: '5',
              t: 'Spaces for discovery',
              d: 'Purposeful places to read, experiment, make and play.',
            },
            {
              n: '4',
              t: 'Passion-led clubs',
              d: 'Creative, scientific, literary and sporting possibilities.',
            },
          ].map((s, i) => (
            <Reveal key={s.t} className="outcome" delay={i * 0.08}>
              <span className="mono">0{i + 1} / THE FUTURELAB EXPERIENCE</span>
              <strong>
                {s.n}
                <span>↗</span>
              </strong>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </Reveal>
          ))}
        </div>
        <DemoNote>Counts describe the pathways, spaces and clubs available in this demo.</DemoNote>
      </section>
      <section className="events-section section">
        <div className="wrap">
          <Reveal className="section-heading">
            <div>
              <Label>MARK A LITTLE MOMENT</Label>
              <h2>Good things, coming up.</h2>
            </div>
            <ArrowLink to="/events">See the school calendar</ArrowLink>
          </Reveal>
          {events.map((e) => (
            <Link className="event-row" key={e.slug} to={`/events/${e.slug}`}>
              <div className="event-date">
                <strong>{e.day}</strong>
                <span>{e.month} 2026</span>
              </div>
              <Photo name={e.image} alt={e.title} />
              <div className="event-text">
                <span className="mono">{e.category}</span>
                <h3>{e.title}</h3>
                <span>{e.time} · FutureLab demo campus</span>
              </div>
              <span className="round-link">
                <ArrowUpRight />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="join-section wrap">
        <Reveal>
          <span className="join-spark">✳</span>
          <Label>THE NEXT CHAPTER STARTS WITH YOU</Label>
          <h2>
            A curious mind.
            <br />A world of <em>possibilities.</em>
          </h2>
          <p>Come meet us. Ask your questions. Imagine what’s possible.</p>
          <div className="center-actions">
            <ButtonLink to="/admissions/apply">Start your application</ButtonLink>
            <ButtonLink to="/visit" secondary>
              Let’s plan a visit
            </ButtonLink>
          </div>
          <span className="join-note">
            EXPLORE THE 2026–27 DEMO ADMISSIONS JOURNEY <MoveUpRight size={14} />
          </span>
        </Reveal>
      </section>
    </>
  )
}
