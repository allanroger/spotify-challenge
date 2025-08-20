import { useState } from 'react'
import { useApp } from '../../context/useApp'

type Language = 'pt' | 'en'
const OPTIONS: { value: Language; flag: string; label: string }[] = [
  { value: 'pt', flag: 'br', label: 'Português' },
  { value: 'en', flag: 'us', label: 'English' },
]

export default function LanguageSelector() {
  const { lang, setLang } = useApp()
  const [open, setOpen] = useState(false)
  const current = OPTIONS.find(o => o.value === lang)!

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="btn flex items-center gap-2"
      >
        <span className={`fi fi-${current.flag} w-5 h-5 rounded`} />
        <span className="hidden sm:inline">{current.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-sm bg-app-bg z-10">
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { setLang(opt.value); setOpen(false) }}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-app-surface"
            >
              <span className={`fi fi-${opt.flag} w-5 h-5 rounded`} />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
