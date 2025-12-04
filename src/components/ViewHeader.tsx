type ViewHeaderProps = {
  eyebrow: string
  title: string
  description: string
  stats?: {
    total: number
    completed: number
    pending: number
  }
}

export function ViewHeader({ eyebrow, title, description, stats }: ViewHeaderProps) {
  return (
    <div className="flex flex-col gap-2 mb-6">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{eyebrow}</p>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        {stats && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 bg-white">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" aria-hidden />
              {stats.completed} done
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 bg-white">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500" aria-hidden />
              {stats.pending} remaining
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 bg-white">
              <span className="inline-block h-2 w-2 rounded-full bg-gray-400" aria-hidden />
              {stats.total} total
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
