import { useState } from 'react'
import StatusBar from './StatusBar' from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const ICONS = {
  chat: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  brain: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  monitor: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  prompt: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
}

const NAV = [
  { path: '/', icon: 'chat', key: 'nav.chat' },
  { path: '/brain', icon: 'brain', key: 'nav.brain' },
  { path: '/monitor', icon: 'monitor', key: 'nav.monitor' },
  { path: '/prompt', icon: 'prompt', key: 'nav.prompt' },
  { path: '/settings', icon: 'settings', key: 'nav.settings' },
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
            <svg className="w-6 h-6 text-[var(--color-brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
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
                <span className="w-5 h-5 shrink-0">{ICONS[item.icon]}</span>
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

        <StatusBar />`n        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
