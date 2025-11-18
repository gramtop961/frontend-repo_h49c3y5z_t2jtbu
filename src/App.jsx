import { useMemo, useState } from 'react'
import RfpCreator from './components/RfpCreator'
import SectionEditor from './components/SectionEditor'

function App() {
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-6">
        <header className="flex items-center justify-between max-w-6xl mx-auto mb-6">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="Flames" className="w-8 h-8" />
            <h1 className="text-xl font-semibold text-white">AI RFP Builder</h1>
          </div>
          <a href="/test" className="text-blue-300 hover:text-white text-sm">Connection Test</a>
        </header>

        <main className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <div>
            <RfpCreator baseUrl={baseUrl} onSelect={setSelected} />
          </div>
          <div>
            {selected ? (
              <SectionEditor baseUrl={baseUrl} rfp={selected} />
            ) : (
              <div className="h-full min-h-[400px] bg-slate-800/60 border border-slate-700 rounded-xl p-6 flex items-center justify-center text-slate-400">
                Select or create an RFP to start editing sections.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
