import { useEffect, useState } from 'react'
import { useT } from '../../i18n'
import type { PaginationProps, PageBtnProps } from '../../types'

export default function Pagination({
  page,
  totalPages,
  onChange,
  onPrev,
  onNext,
  className = '',
}: PaginationProps) {
  const t = useT()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 640px)')
    const update = () => setIsMobile(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  const canPrev = page > 1
  const canNext = page < totalPages

  const handlePrev = () => {
    if (!canPrev) return
    if (onPrev) onPrev()
    else onChange(Math.max(1, page - 1))
  }

  const handleNext = () => {
    if (!canNext) return
    if (onNext) onNext()
    else onChange(Math.min(totalPages, page + 1))
  }

  if (isMobile) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button className="btn" disabled={!canPrev} onClick={handlePrev}>
          {t('pagination.prev')}
        </button>
        <button className="btn" disabled={!canNext} onClick={handleNext}>
          {t('pagination.next')}
        </button>
      </div>
    )
  }

  const WINDOW_SIZE = 5
  const clamp = (n: number) => Math.min(Math.max(n, 1), totalPages)

  let start = clamp(page - Math.floor(WINDOW_SIZE / 2))
  const end = clamp(start + WINDOW_SIZE - 1)
  start = clamp(end - WINDOW_SIZE + 1)

  const centerPages = Array.from({ length: end - start + 1 }, (_, i) => start + i)
  const firstVisible = centerPages[0] ?? 1
  const lastVisible = centerPages[centerPages.length - 1] ?? 1

  const showFirstBtn = firstVisible > 1
  const showLeadingEllipsis = firstVisible > 2
  const showLastBtn = lastVisible < totalPages
  const showTrailingEllipsis = lastVisible < totalPages - 1

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button className="btn" disabled={!canPrev} onClick={handlePrev}>
        {t('pagination.prev')}
      </button>

      <div className="flex items-center gap-1">
        {showFirstBtn && (
          <>
            <PageBtn n={1} current={page} onClick={onChange} />
            {showLeadingEllipsis && <span className="px-1 select-none">…</span>}
          </>
        )}

        {centerPages.map((n) => (
          <PageBtn key={n} n={n} current={page} onClick={onChange} />
        ))}

        {showLastBtn && (
          <>
            {showTrailingEllipsis && <span className="px-1 select-none">…</span>}
            <PageBtn n={totalPages} current={page} onClick={onChange} />
          </>
        )}
      </div>

      <button className="btn" disabled={!canNext} onClick={handleNext}>
        {t('pagination.next')}
      </button>
    </div>
  )
}

function PageBtn({ n, current, onClick }: PageBtnProps) {
  const active = n === current
  return (
    <button
      onClick={() => onClick(n)}
      disabled={active}
      className={`btn ${active ? 'bg-gray-900 text-white border-gray-900' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      {n}
    </button>
  )
}
