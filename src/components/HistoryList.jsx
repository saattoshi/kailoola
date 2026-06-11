const moodEmojis = { 1: '😫', 2: '😔', 3: '😐', 4: '🙂', 5: '😄' }
const tirednessEmojis = { 1: '💀', 2: '😴', 3: '😐', 4: '⚡', 5: '🌟' }

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

function HistoryList({ sleepLogs }) {
  if (sleepLogs.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
        <p className="text-slate-500 text-sm">No logs yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-sm font-medium text-slate-400 mb-4">Recent Logs</h3>
      <div className="space-y-1 max-h-72 overflow-y-auto">
        {sleepLogs.slice(0, 14).map(log => (
          <div
            key={log.id}
            className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0"
          >
            <div className="min-w-0">
              <div className="text-sm font-medium text-slate-200">{formatDate(log.date)}</div>
              {log.notes && (
                <div className="text-xs text-slate-500 mt-0.5 truncate max-w-48">{log.notes}</div>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm shrink-0 ml-3">
              <span className="text-indigo-400 font-medium tabular-nums">{log.sleep_duration}h</span>
              <span title={`Mood: ${log.mood}/5`}>{moodEmojis[log.mood]}</span>
              <span title={`Tiredness: ${log.tiredness}/5`}>{tirednessEmojis[log.tiredness]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryList
