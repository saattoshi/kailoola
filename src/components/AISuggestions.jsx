import { useState } from 'react'
import { supabase } from '../lib/supabase'

function AISuggestions({ sleepLogs }) {
  const [suggestions, setSuggestions] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function getSuggestions() {
    if (sleepLogs.length === 0) {
      setError('Add at least one sleep log first.')
      return
    }

    setLoading(true)
    setError('')
    setSuggestions('')

    const { data, error } = await supabase.functions.invoke('get-suggestions', {
      body: { sleepLogs: sleepLogs.slice(0, 7) },
    })

    if (error) {
      setError('Could not load suggestions. Make sure the edge function is deployed and ANTHROPIC_API_KEY is set.')
    } else {
      setSuggestions(data.suggestions)
    }

    setLoading(false)
  }

  const lines = suggestions
    ? suggestions.split('\n').filter(line => line.trim())
    : []

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <span>✨</span> AI Suggestions
        </h2>
        <button
          onClick={getSuggestions}
          disabled={loading}
          className="text-sm bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {loading ? 'Thinking...' : suggestions ? 'Refresh' : 'Get Suggestions'}
        </button>
      </div>

      {!suggestions && !loading && !error && (
        <p className="text-slate-500 text-sm">
          Get personalized sleep tips based on your recent data.
        </p>
      )}

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {suggestions && !loading && (
        <div className="space-y-3">
          {lines.map((line, i) => (
            <div
              key={i}
              className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-slate-300 text-sm leading-relaxed"
            >
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AISuggestions
