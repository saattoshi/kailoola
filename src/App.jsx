import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Header from './components/Header'
import AuthPage from './components/AuthPage'
import StatsCards from './components/StatsCards'
import SleepForm from './components/SleepForm'
import SleepChart from './components/SleepChart'
import HistoryList from './components/HistoryList'
import AISuggestions from './components/AISuggestions'

function App() {
  const [user, setUser] = useState(null)
  const [sleepLogs, setSleepLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchSleepLogs(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchSleepLogs(session.user.id)
      } else {
        setSleepLogs([])
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchSleepLogs(userId) {
    const { data } = await supabase
      .from('sleep_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(30)

    setSleepLogs(data || [])
    setLoading(false)
  }

  function handleLogAdded(newLog) {
    setSleepLogs(prev => [newLog, ...prev])
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning'
    : hour < 17 ? 'Good afternoon'
    : 'Good evening'

  return (
    <div className="min-h-screen bg-slate-950">
      <Header user={user} onSignOut={handleSignOut} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100">{greeting}! 👋</h1>
          <p className="text-slate-400 mt-1">
            {sleepLogs.length === 0
              ? 'Log your first night of sleep to start tracking.'
              : `You have ${sleepLogs.length} sleep log${sleepLogs.length !== 1 ? 's' : ''} recorded.`}
          </p>
        </div>

        <StatsCards sleepLogs={sleepLogs} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SleepForm user={user} onLogAdded={handleLogAdded} />
            <AISuggestions sleepLogs={sleepLogs} />
          </div>

          <div className="space-y-6">
            <SleepChart sleepLogs={sleepLogs} />
            <HistoryList sleepLogs={sleepLogs} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
