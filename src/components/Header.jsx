function Header({ user, onSignOut }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🌙</span>
          <span className="text-xl font-bold text-slate-100 tracking-tight">Kailoola</span>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:block">{user.email}</span>
            <button
              onClick={onSignOut}
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
