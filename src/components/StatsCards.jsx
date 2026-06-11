function StatCard({ icon, value, label }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <div className="text-2xl font-bold text-slate-100">{value}</div>
        <div className="text-sm text-slate-400">{label}</div>
      </div>
    </div>
  )
}

function StatsCards({ sleepLogs }) {
  const last7 = sleepLogs.slice(0, 7)

  const avgSleep = last7.length > 0
    ? (last7.reduce((sum, log) => sum + (log.sleep_duration || 0), 0) / last7.length).toFixed(1)
    : null

  const avgMoodNum = last7.length > 0
    ? last7.reduce((sum, log) => sum + (log.mood || 0), 0) / last7.length
    : null

  const moodEmoji = avgMoodNum === null ? '—'
    : avgMoodNum >= 4.5 ? '😄'
    : avgMoodNum >= 3.5 ? '🙂'
    : avgMoodNum >= 2.5 ? '😐'
    : avgMoodNum >= 1.5 ? '😔'
    : '😫'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <StatCard
        icon="🌙"
        value={avgSleep ? `${avgSleep}h` : '—'}
        label="Avg Sleep (7 days)"
      />
      <StatCard
        icon={moodEmoji === '—' ? '😊' : moodEmoji}
        value={avgMoodNum ? avgMoodNum.toFixed(1) : '—'}
        label="Avg Mood (7 days)"
      />
      <StatCard
        icon="📝"
        value={sleepLogs.length}
        label="Total Logs"
      />
    </div>
  )
}

export default StatsCards
