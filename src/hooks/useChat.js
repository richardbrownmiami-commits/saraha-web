import { useState, useEffect, useRef, useCallback } from 'react'
import { useSettings } from '../context/SettingsContext'
import { sendChatMessage, streamChatResponse } from '../services/gateway'
import { loadConversations, saveConversations, generateId } from '../services/storage'

export function useChat() {
  const { settings } = useSettings()
  const [conversations, setConversations] = useState(loadConversations)
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  useEffect(() => { saveConversations(conversations) }, [conversations])

  const getConversation = useCallback((id) => {
    return conversations.find(c => c.id === id)
  }, [conversations])

  const createConversation = useCallback(() => {
    const id = generateId()
    const conv = { id, title: 'New Chat', createdAt: new Date().toISOString(), messages: [] }
    setConversations(prev => [...prev, conv])
    setActiveId(id)
    setMessages([])
    setError(null)
    return id
  }, [])

  const selectConversation = useCallback((id) => {
    const conv = conversations.find(c => c.id === id)
    if (conv) {
      setActiveId(id)
      setMessages(conv.messages)
      setError(null)
      setStreamingContent('')
    }
  }, [conversations])

  const deleteConversation = useCallback((id) => {
    setConversations(prev => prev.filter(c => c.id !== id))
    if (activeId === id) {
      setActiveId(null)
      setMessages([])
    }
  }, [activeId])

  const updateConversationTitle = useCallback((id, title) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title } : c))
  }, [])

  const updateMessages = useCallback((convId, newMessages) => {
    setConversations(prev => prev.map(c =>
      c.id === convId ? { ...c, messages: newMessages } : c
    ))
  }, [])

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || isStreaming) return

    const convId = activeId || createConversation()
    const userMsg = { id: generateId(), role: 'user', content, createdAt: new Date().toISOString() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setError(null)
    setIsStreaming(true)
    setStreamingContent('')

    if (convId !== activeId) {
      setConversations(prev => prev.map(c =>
        c.id === convId ? { ...c, messages: updatedMessages } : c
      ))
    } else {
      updateMessages(convId, updatedMessages)
    }

    const chatMessages = [...updatedMessages.map(m => ({ role: m.role, content: m.content }))]

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await sendChatMessage({
        apiKey: settings.apiKey,
        gatewayUrl: settings.gatewayUrl,
        model: settings.model,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        stream: settings.stream,
        messages: chatMessages,
        signal: controller.signal,
      })

      if (!settings.stream) {
        const data = await response.json()
        const fullContent = data.choices?.[0]?.message?.content || ''
        const assistantMsg = { id: generateId(), role: 'assistant', content: fullContent, createdAt: new Date().toISOString() }
        const finalMessages = [...updatedMessages, assistantMsg]
        setMessages(finalMessages)
        updateMessages(convId, finalMessages)
        if (conversations.find(c => c.id === convId)?.title === 'New Chat') {
          updateConversationTitle(convId, content.slice(0, 40) + (content.length > 40 ? '...' : ''))
        }
        setIsStreaming(false)
        return
      }

      let fullContent = ''
      for await (const token of streamChatResponse(response)) {
        fullContent += token
        setStreamingContent(fullContent)
      }

      if (controller.signal.aborted) {
        if (fullContent) {
          const assistantMsg = { id: generateId(), role: 'assistant', content: fullContent + ' âœ‹', createdAt: new Date().toISOString() }
          const finalMessages = [...updatedMessages, assistantMsg]
          setMessages(finalMessages)
          updateMessages(convId, finalMessages)
        }
        setIsStreaming(false)
        setStreamingContent('')
        return
      }

      const assistantMsg = { id: generateId(), role: 'assistant', content: fullContent, createdAt: new Date().toISOString() }
      const finalMessages = [...updatedMessages, assistantMsg]
      setMessages(finalMessages)
      updateMessages(convId, finalMessages)

      if (conversations.find(c => c.id === convId)?.title === 'New Chat') {
        updateConversationTitle(convId, content.slice(0, 40) + (content.length > 40 ? '...' : ''))
      }
    } catch (err) {
      if (err.name === 'AbortError') return
      setError(err.message)
      setIsStreaming(false)
      setStreamingContent('')
    }

    setIsStreaming(false)
    setStreamingContent('')
  }, [messages, activeId, isStreaming, settings, conversations, createConversation, updateMessages, updateConversationTitle])

  const stopStreaming = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
  }, [])

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
    setStreamingContent('')
    if (activeId) {
      setConversations(prev => prev.map(c =>
        c.id === activeId ? { ...c, messages: [] } : c
      ))
    }
  }, [activeId])

  return {
    conversations,
    activeId,
    messages,
    isStreaming,
    streamingContent,
    error,
    setActiveId,
    getConversation,
    createConversation,
    selectConversation,
    deleteConversation,
    sendMessage,
    stopStreaming,
    clearChat,
    setMessages,
  }
}
