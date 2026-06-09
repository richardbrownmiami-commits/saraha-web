import { useTranslation } from 'react-i18next'
import { useBrain } from '../hooks/useBrain'

const PHASE_ICONS = { awake: 'âœ¨', tired: 'ðŸ˜´', curious: 'ðŸ”', sleeping: 'ðŸ’¤', busy: 'âš¡' }
const PHASE_COLORS = { awake: '#2E86AB', tired: '#6B7280', curious: '#F18F01', sleeping: '#6366F1', busy: '#EF4444' }

function EmotionBar({ label, value, color }) {
  const pct = Math.min(100, Math.max(0, (value || 0) * 10))
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[var(--color-text-sec)]">{label}</span>
        <span className="font-medium" style={{ color }}>{value || 0}/10</span>
      </div>
      <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

function EnergyGauge({ energy }) {
  const pct = Math.min(100, Math.max(0, energy || 0))
  const color = pct > 60 ? '#10B981' : pct > 30 ? '#F59E0B' : '#EF4444'
  return (
    <div className="flex items-center gap-3 bg-[var(--color-bg)] rounded-xl p-3 border border-[var(--color-border)]">
      <span className="text-2xl">âš¡</span>
      <div className="flex-1 space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-[var(--color-text-sec)]">Energy</span>
          <span className="font-bold" style={{ color }}>{pct}%</span>
        </div>
        <div className="h-3 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
        </div>
      </div>
    </div>
  )
}

export default function BrainPage() {
  const { t } = useTranslation()
  const { emotions, phase, activity, stream, loading, error, autoRefresh, setAutoRefresh, refresh } = useBrain()

  const currentPhase = phase?.phase || emotions?.current_phase || 'awake'
  const phaseIcon = PHASE_ICONS[currentPhase] || 'âœ¨'
  const phaseColor = PHASE_COLORS[currentPhase] || '#2E86AB'
  const e = emotions || {}

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[var(--color-text)]">{t('brain.title')}</h1>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-[var(--color-text-sec)] cursor-pointer">
              <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="rounded border-[var(--color-border)]" />
              {t('brain.autoRefresh')}
            </label>
            <button onClick={refresh} className="text-sm text-[var(--color-brand-light)] hover:text-[var(--color-accent)] transition-colors" disabled={loading}>
              {t('brain.refresh')}
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12 text-sm text-[var(--color-text-sec)]">
            <div className="animate-spin-slow inline-block text-3xl mb-3">ðŸ§ </div>
            <p>{t('brain.loading')}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-800/50 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center gap-2">
            <span>âš ï¸</span>
            <span>{t('brain.error')}: {error}</span>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{phaseIcon}</span>
                  <div>
                    <p className="text-xs text-[var(--color-text-sec)]">{t('brain.phase')}</p>
                    <p className="text-lg font-bold" style={{ color: phaseColor }}>{t(`brain.${currentPhase}`)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${e.energy_level > 0 ? 'bg-[var(--color-success)] animate-statusPulse' : 'bg-[var(--color-error)]'}`} />
                  <span className="text-xs text-[var(--color-text-sec)]">{e.energy_level > 0 ? t('brain.online') : t('brain.offline')}</span>
                </div>
              </div>

              <EnergyGauge energy={e.energy_level} />

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[var(--color-text)]">{t('brain.emotions')}</h3>
                <EmotionBar label={t('brain.happy')} value={e.happy} color="#10B981" />
                <EmotionBar label={t('brain.energetic')} value={e.energetic} color="#F59E0B" />
                <EmotionBar label={t('brain.intelligent')} value={e.intelligent} color="#2E86AB" />
                <EmotionBar label={t('brain.bad')} value={e.bad} color="#EF4444" />
              </div>
            </div>

            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">{t('brain.activity')}</h3>
              {activity.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)] text-center py-6">{t('brain.noActivity')}</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                  {activity.slice(0, 15).map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm py-2 border-b border-[var(--color-border)]/50 last:border-0">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] shrink-0" />
                      <div>
                        <p className="text-[var(--color-text)]">{typeof item === 'string' ? item : item.action || item.message || item.content || JSON.stringify(item).slice(0, 100)}</p>
                        {item.created_at && <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{new Date(item.created_at).toLocaleString()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {stream.length > 0 && (
              <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">{t('brain.stream')}</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                  {stream.slice(0, 10).map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm py-2 border-b border-[var(--color-border)]/50 last:border-0">
                      <span className="mt-1 text-xs">{item.mood === 'happy' ? 'ðŸ˜Š' : item.mood === 'curious' ? 'ðŸ¤”' : 'ðŸ’­'}</span>
                      <p className="text-[var(--color-text)] text-xs">{typeof item.content === 'string' ? item.content.slice(0, 200) : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
