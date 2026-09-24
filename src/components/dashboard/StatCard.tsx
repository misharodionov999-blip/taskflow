type StatCardProps = {
  label: string
  value: number
  tone: 'total' | 'todo' | 'progress' | 'done'
}

function StatIcon({ tone }: { tone: StatCardProps['tone'] }) {
  if (tone === 'todo') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7.25" />
      </svg>
    )
  }

  if (tone === 'progress') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7.25" />
        <path d="M12 5.2a6.8 6.8 0 0 1 0 13.6Z" />
      </svg>
    )
  }

  if (tone === 'done') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7.25" />
        <path d="m8.6 12.2 2.2 2.2 4.6-4.8" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19V6.5M5 19h14" />
      <path d="m8.5 15 3.1-3.8 2.6 2 4-5.4" />
    </svg>
  )
}

export function StatCard({ label, value, tone }: StatCardProps) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <div className="stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <span className="stat-icon">
        <StatIcon tone={tone} />
      </span>
    </article>
  )
}
