import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NAV = [
  { path: '/', icon: 'ðŸ’¬', key: 'nav.chat' },
  { path: '/brain', icon: 'ðŸ§ ', key: 'nav.brain' },
  { path: '/monitor', icon: 'ðŸ›¡ï¸', key: 'nav.monitor' },
  { path: '/settings', icon: 'âš™ï¸', key: 'nav.settings' },
]

export default function Layout({ children }) {
  const { t, i18n } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isRtl = i18n.language === 'ar'

  return (
    <div className="flex h-screen overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <aside className={`sidebar fixed md:static inset-y-0 left-0 z-40 w-64 bg-[var(--color-bg-card)] border-r border-[var(--color-border)] transform transition-transform duration-200 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
        <div className="p-5 border-b border-[var(--color-border)]">
          <h1 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <span className="text-2xl">ðŸ§ </span>
            <span>{t('app.name')}</span>
          </h1>
          <p className="text-xs text-[var(--color-text-sec)] mt-0.5">{t('app.tagline')}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
          {NAV.map(item => {
            const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--color-brand)] text-white shadow-md'
                    : 'text-[var(--color-text-sec)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text)]'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{t(item.key)}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-sec)]">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-success)]"></span>
            <span>v1.0.0</span>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[var(--color-bg-card)] border-b border-[var(--color-border)]">
          <button onClick={() => setMobileOpen(true)} className="p-2 text-[var(--color-text)]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-[var(--color-text)]">{t('app.name')}</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
