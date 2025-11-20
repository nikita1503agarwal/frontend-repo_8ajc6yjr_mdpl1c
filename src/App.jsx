import XMB from './components/XMB'

function App() {
  return (
    <div className="relative min-h-screen bg-slate-900 text-blue-50">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(80%_60%_at_50%_-10%,rgba(56,189,248,0.18),transparent_60%),radial-gradient(70%_50%_at_120%_10%,rgba(99,102,241,0.14),transparent_50%)]" />
      <XMB />
    </div>
  )
}

export default App
