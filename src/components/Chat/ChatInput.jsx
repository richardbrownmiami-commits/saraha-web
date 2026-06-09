import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function ChatInput({ onSend, onStop, isStreaming }) {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (!isStreaming && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isStreaming])

  const handleSend = () => {
    if (!input.trim() || isStreaming) return
    onSend(input)
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e) => {
    setInput(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px'
    }
  }

  return (
    <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-card)]">
      <div className="flex items-end gap-2 p-4 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={t('chat.placeholder')}
            rows={1}
            disabled={isStreaming}
            className="w-full bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] rounded-xl px-4 py-3 pr-12 text-sm border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-brand)] resize-none transition-colors disabled:opacity-50"
            style={{ maxHeight: '150px' }}
          />
        </div>

        {isStreaming ? (
          <button
            onClick={onStop}
            className="shrink-0 bg-[var(--color-error)] hover:bg-red-600 text-white rounded-xl px-4 py-3 text-sm font-medium transition-colors"
          >
            {t('chat.stop')}
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="shrink-0 bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 text-sm font-medium transition-colors"
          >
            {t('chat.send')}
          </button>
        )}
      </div>
    </div>
  )
}
