import { useState } from 'react'
import { supabase } from '../lib/supabase'

function calculateDuration(bedtime, wakeTime) {
  if (!bedtime || !wakeTime) return null
  const [bh, bm] = bedtime.split(':').map(Number)
  const [wh, wm] = wakeTime.split(':').map(Number)
  let bedMins = bh * 60 + bm
  let wakeMins = wh * 60 + wm
  if (wakeMins <= bedMins) wakeMins += 24 * 60
  return Math.round(((wakeMins - bedMins) / 60) * 10) / 10
}

const moodOptions = [
  { value: 1, emoji: '😫', label: 'Terrible' },
  { value: 2, emoji: '😔', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
]

const tirednessOptions = [
  { value: 1, emoji: '💀', label: 'Exhausted' },
  { value: 2, emoji: '😴', label: 'Tired' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '⚡', label: 'Rested' },
  { value: 5, emoji: '🌟', label: 'Energized' },
]

function EmojiScale({ options, value, onChange }) {
  return (
    <div className="flex gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 flex flex-col items-center py-2.5 px-1 rounded-xl border transition-all ${
            value === opt.value
              ? 'border-violet-500 bg-violet-500/20 text-violet-300'
              : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
          }`}
        >
          <span className="text-xl">{opt.emoji}</span>
          <span className="text-xs mt-1 hidden sm:block text-slate-400">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}

function SleepForm({ user, onLogAdded }) {
  const now = new Date()
  const [day, setDay] = useState(String(now.getDate()).padStart(2, '0'))
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'))
  const [year, setYear] = useState(String(now.getFullYear()))

  const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

  const [bedtime, setBedtime] = useState('22:00')
  const [wakeTime, setWakeTime] = useState('07:00')
  const [mood, setMood] = useState(3)
  const [tiredness, setTiredness] = useState(3)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const duration = calculateDuration(bedtime, wakeTime)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('sleep_logs')
      .insert({
        user_id: user.id,
        date,
        bedtime,
        wake_time: wakeTime,
        sleep_duration: duration,
        mood,
        tiredness,
        notes: notes.trim() || null,
      })
      .select()
      .single()

    if (error) {
      setError(error.message)
    } else {
      onLogAdded(data)
      setNotes('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }

    setLoading(false)
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-slate-100 mb-5">Log Tonight's Sleep</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Date</label>
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-violet-500/50">
            <input
              type="text"
              inputMode="numeric"
              maxLength="2"
              value={day}
              onChange={e => setDay(e.target.value)}
              placeholder="DD"
              className="w-7 bg-transparent text-slate-200 text-center focus:outline-none placeholder-slate-600"
            />
            <span className="text-slate-500 mx-1">/</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength="2"
              value={month}
              onChange={e => setMonth(e.target.value)}
              placeholder="MM"
              className="w-7 bg-transparent text-slate-200 text-center focus:outline-none placeholder-slate-600"
            />
            <span className="text-slate-500 mx-1">/</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength="4"
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="YYYY"
              className="w-14 bg-transparent text-slate-200 text-center focus:outline-none placeholder-slate-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Bedtime</label>
            <input
              type="time"
              value={bedtime}
              onChange={e => setBedtime(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Wake up</label>
            <input
              type="time"
              value={wakeTime}
              onChange={e => setWakeTime(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>
        </div>

        {duration && (
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-center text-indigo-300 text-sm">
            Sleep duration: <strong>{duration} hours</strong>
          </div>
        )}

        <div>
          <label className="block text-sm text-slate-400 mb-2">How was your mood today?</label>
          <EmojiScale options={moodOptions} value={mood} onChange={setMood} />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">How tired do you feel right now?</label>
          <EmojiScale options={tirednessOptions} value={tiredness} onChange={setTiredness} />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1.5">
            Notes <span className="text-slate-600">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            placeholder="Anything affecting your sleep tonight?"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-emerald-400 text-sm">✓ Sleep log saved!</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors"
        >
          {loading ? 'Saving...' : 'Save Sleep Log'}
        </button>
      </form>
    </div>
  )
}

export default SleepForm
