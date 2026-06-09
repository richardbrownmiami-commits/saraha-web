import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useChat } from '../hooks/useChat'
import MessageBubble from '../components/Chat/MessageBubble'
import StreamingMessage from '../components/Chat/StreamingMessage'
import ChatInput from '../components/Chat/ChatInput'

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : initial } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }, [key, value])
  return [value, setValue]
}

export default function ChatPage() {
  const { t } = useTranslation()
  const {
    conversations, activeId, messages, isStreaming, streamingContent,
    error, selectConversation, deleteConversation, createConversation,
    sendMessage, stopStreaming, clearChat,
  } = useChat()

  const messagesEndRef = useRef(null)
  const [showSidebar, setShowSidebar] = useLocalStorage('chat-sidebar', true)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  const handleCopy = async (content) => {
    try { await navigator.clipboard.writeText(content) } catch {}
  }

  const sortedConvs = [...conversations].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  )

  return (
    <div className="flex h-full">
      <div className={`${showSidebar ? 'w-64' : 'w-0'} transition-all duration-200 overflow-hidden border-r border-[var(--color-border)] bg-[var(--color-bg-card)]`}>
        <div className="p-3 border-b border-[var(--color-border)]">
          <button
            onClick={createConversation}
            className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
          >
            + {t('chat.newChat')}
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-57px)] scrollbar-thin">
          {sortedConvs.map(conv => (
            <div
              key={conv.id}
              onClick={() => selectConversation(conv.id)}
              className={`group flex items-center gap-2 px-3 py-2.5 cursor-pointer border-b border-[var(--color-border)]/50 transition-colors ${
                activeId === conv.id ? 'bg-[var(--color-bg-hover)]' : 'hover:bg-[var(--color-bg-hover)]'
              }`}
            >
              <span className="text-sm truncate flex-1 text-[var(--color-text)]">{conv.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id) }}
                className="opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-[var(--color-error)] text-xs px-1 transition-opacity"
              >
                âœ•
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-card)]/50">
          <button onClick={() => setShowSidebar(!showSidebar)} className="text-[var(--color-text-sec)] hover:text-[var(--color-text)] p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button onClick={clearChat} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-error)] px-2 py-1 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors">
                {t('chat.clear')}
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin py-4 space-y-4">
          {messages.length === 0 && !isStreaming ? (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center">
              <span className="text-6xl mb-4">ðŸ§ </span>
              <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">{t('chat.emptyTitle')}</h2>
              <p className="text-sm text-[var(--color-text-sec)] max-w-md">{t('chat.emptyDesc')}</p>
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} onCopy={handleCopy} />
              ))}
              {isStreaming && <StreamingMessage content={streamingContent} />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="mx-4 mb-2 bg-red-900/30 border border-red-800/50 rounded-xl px-4 py-2 flex items-center gap-2 text-sm text-red-400">
            <span>âš ï¸</span>
            <span className="flex-1">{error}</span>
          </div>
        )}

        <ChatInput onSend={sendMessage} onStop={stopStreaming} isStreaming={isStreaming} />
      </div>
    </div>
  )
}
