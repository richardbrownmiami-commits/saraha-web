import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMonitor } from '../hooks/useMonitor'

const TOOL_ICONS = {
  web_search: 'ðŸ”', github_read: 'ðŸ“–', github_write: 'âœï¸',
  fix_my_brain: 'ðŸ©º', math_eval: 'ðŸ”¢', web_fetch: 'ðŸŒ',
}

const TOOL_COLORS = {
  web_search: '#3B82F6', github_read: '#8B5CF6', github_write: '#EF4444',
  fix_my_brain: '#10B981', math_eval: '#F59E0B', web_fetch: '#6366F1',
}

function ApprovalCard({ item, onApprove, onDeny, isLoading }) {
  const { t } = useTranslation()
  const icon = TOOL_ICONS[item.tool_name] || 'ðŸ› ï¸'
  const color = TOOL_COLORS[item.tool_name] || '#2E86AB'
  const isPending = item.status === 'pending'

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: color + '22' }}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]" style={{ color }}>{item.tool_name}</p>
            <p className="text-[10px] text-[var(--color-text-muted)]">
              {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${
          isPending ? 'bg-yellow-900/30 text-yellow-400' :
          item.status === 'approved' ? 'bg-green-900/30 text-green-400' :
          'bg-red-900/30 text-red-400'
        }`}>
          {isPending ? t('monitor.pending') : item.status === 'approved' ? t('monitor.approved') : t('monitor.denied')}
        </span>
      </div>

      {item.tool_input && (
        <div className="bg-[var(--color-bg)] rounded-xl p-3 border border-[var(--color-border)]">
          <p className="text-[10px] text-[var(--color-text-muted)] mb-1">{t('monitor.toolInput')}</p>
          <p className="text-xs text-[var(--color-text)] font-mono break-all">{item.tool_input}</p>
        </div>
      )}

      {isPending && (
        <div className="flex gap-2">
          <button
            onClick={() => onDeny(item.id)}
            disabled={isLoading}
            className="flex-1 bg-red-900/20 hover:bg-red-900/40 border border-red-800/50 text-red-400 rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? '...' : `âœ— ${t('monitor.deny')}`}
          </button>
          <button
            onClick={() => onApprove(item.id)}
            disabled={isLoading}
            className="flex-1 bg-green-900/20 hover:bg-green-900/40 border border-green-800/50 text-green-400 rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? '...' : `âœ“ ${t('monitor.approve')}`}
          </button>
        </div>
      )}
    </div>
  )
}

export default function MonitorPage() {
  const { t } = useTranslation()
  const { pending, history, loading, actionLoading, error, approve, deny } = useMonitor()
  const [tab, setTab] = useState('pending')

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[var(--color-text)]">{t('monitor.title')}</h1>
          {pending.length > 0 && (
            <span className="bg-[var(--color-warning)] text-black text-xs font-bold px-2.5 py-1 rounded-full">
              {pending.length} {t('monitor.pending')}
            </span>
          )}
        </div>

        <div className="flex gap-1 bg-[var(--color-bg)] rounded-xl p-1 border border-[var(--color-border)]">
          <button
            onClick={() => setTab('pending')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === 'pending' ? 'bg-[var(--color-bg-card)] text-[var(--color-text)] shadow-sm' : 'text-[var(--color-text-sec)] hover:text-[var(--color-text)]'}`}
          >
            {t('monitor.pending')} ({pending.length})
          </button>
          <button
            onClick={() => setTab('history')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === 'history' ? 'bg-[var(--color-bg-card)] text-[var(--color-text)] shadow-sm' : 'text-[var(--color-text-sec)] hover:text-[var(--color-text)]'}`}
          >
            {t('monitor.history')} ({history.length})
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800/50 rounded-xl px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-sm text-[var(--color-text-sec)]">
            <div className="animate-spin-slow inline-block text-2xl mb-2">â³</div>
            <p>{t('common.loading')}</p>
          </div>
        ) : tab === 'pending' ? (
          pending.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl mb-4 block">âœ…</span>
              <p className="text-[var(--color-text-sec)] text-sm">{t('monitor.noPending')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map(item => (
                <ApprovalCard key={item.id} item={item} onApprove={approve} onDeny={deny} isLoading={actionLoading[item.id]} />
              ))}
            </div>
          )
        ) : (
          history.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl mb-4 block">ðŸ“‹</span>
              <p className="text-[var(--color-text-sec)] text-sm">{t('monitor.noHistory')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map(item => (
                <ApprovalCard key={item.id} item={item} onApprove={approve} onDeny={deny} isLoading={false} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
