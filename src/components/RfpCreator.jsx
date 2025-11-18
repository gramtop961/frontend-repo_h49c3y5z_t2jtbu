import { useEffect, useState } from 'react'

export default function RfpCreator({ baseUrl, onSelect }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [rfps, setRfps] = useState([])

  const loadRfps = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/rfps`)
      const data = await res.json()
      setRfps(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadRfps()
  }, [])

  const createRfp = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/rfps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      })
      if (!res.ok) throw new Error('Failed to create RFP')
      setTitle('')
      setDescription('')
      await loadRfps()
    } catch (e) {
      console.error(e)
      alert('Could not create RFP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={createRfp} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Create RFP</h3>
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-slate-900/70 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
            rows={2}
            className="w-full bg-slate-900/70 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white"
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>

      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Your RFPs</h3>
        <div className="space-y-2 max-h-64 overflow-auto pr-1">
          {rfps.length === 0 && (
            <p className="text-slate-400 text-sm">No RFPs yet. Create one above.</p>
          )}
          {rfps.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelect(r)}
              className="w-full text-left px-3 py-2 rounded bg-slate-900/60 border border-slate-700 hover:border-blue-500/40 hover:bg-slate-900/80 transition-colors"
            >
              <div className="text-white font-medium">{r.title}</div>
              {r.description && <div className="text-slate-400 text-sm line-clamp-2">{r.description}</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
