import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}`
}

const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: '#e2e8f0',
  fontSize: '12px',
}

function SleepChart({ sleepLogs }) {
  const last7 = sleepLogs.slice(0, 7).reverse()

  const data = last7.map(log => ({
    date: formatDate(log.date),
    sleep: log.sleep_duration,
    mood: log.mood,
  }))

  if (data.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">📊</div>
        <p className="text-slate-400 text-sm">Charts will appear after your first log.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-medium text-slate-400 mb-4">Sleep Duration (hours)</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 12]} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#1e293b' }} />
            <Bar dataKey="sleep" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Hours slept" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-medium text-slate-400 mb-4">Mood Trend</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#a78bfa"
              strokeWidth={2}
              dot={{ fill: '#a78bfa', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
              name="Mood (1–5)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default SleepChart
