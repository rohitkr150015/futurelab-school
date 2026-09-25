import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, X, CheckCircle2, Atom } from 'lucide-react'
export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="FutureLab School home">
      <span className="brand-mark">
        <Atom size={27} />
      </span>
      <span>
        futurelab<span className="brand-dot">.</span>
        <small>SCHOOL OF POSSIBILITIES</small>
      </span>
    </Link>
  )
}
export function ArrowLink({
  to,
  children,
  light = false,
}: {
  to: string
  children: ReactNode
  light?: boolean
}) {
  return (
    <Link className={`text-link ${light ? 'light' : ''}`} to={to}>
      {children}
      <ArrowUpRight size={19} />
    </Link>
  )
}
export function ButtonLink({
  to,
  children,
  secondary = false,
}: {
  to: string
  children: ReactNode
  secondary?: boolean
}) {
  return (
    <Link className={`button ${secondary ? 'secondary' : ''}`} to={to}>
      {children}
      <ArrowUpRight size={18} />
    </Link>
  )
}
export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}
export function Label({ children }: { children: ReactNode }) {
  return (
    <div className="eyebrow">
      <span />
      {children}
    </div>
  )
}
export function PageIntro({
  label,
  title,
  description,
  children,
}: {
  label: string
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <section className="page-intro wrap">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        {label}
      </div>
      <Reveal>
        <Label>{label}</Label>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {children}
      </Reveal>
    </section>
  )
}
export function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string
  children: ReactNode
  onClose: () => void
  wide?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const prev = document.activeElement as HTMLElement
    const d = ref.current
    d?.showModal()
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      d?.close()
      document.body.style.overflow = old
      prev?.focus()
    }
  }, [])
  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={`modal ${wide ? 'wide' : ''}`}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button autoFocus className="icon-button" onClick={onClose} aria-label="Close dialog">
          <X />
        </button>
      </div>
      {children}
    </dialog>
  )
}
export function Success({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="success" role="status">
      <CheckCircle2 size={36} />
      <h2>{title}</h2>
      {children}
    </div>
  )
}
export function Empty({
  title = 'Nothing here just yet.',
  description = 'Try another filter to discover more.',
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="empty">
      <Atom size={36} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
export function Photo({
  name,
  alt,
  className = '',
  eager = false,
}: {
  name: string
  alt: string
  className?: string
  eager?: boolean
}) {
  return (
    <img
      className={className}
      src={`/images/${name}.webp`}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}
export function DemoNote({ children }: { children?: ReactNode }) {
  return (
    <p className="demo-note">
      {children || 'Fictional school preview · sample data and local interactions only.'}
    </p>
  )
}
