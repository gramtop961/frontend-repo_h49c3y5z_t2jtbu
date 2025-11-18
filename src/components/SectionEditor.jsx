import { useEffect, useMemo, useState } from 'react'

export default function SectionEditor({ baseUrl, rfp }) {
  const [sections, setSections] = useState([])
  const [heading, setHeading] = useState('Executive Summary')
  const [content, setContent] = useState('')
  const [order, setOrder] = useState(0)
  const [loading, setLoading] = useState(false)
  const [genTone, setGenTone] = useState('professional')

  const loadSections = async () => {
    if (!rfp) return
    try {
      const res = await fetch(`${baseUrl}/api/sections?rfp_id=${rfp.id}`)
      const data = await res.json()
      setSections(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadSections()
  }, [rfp?.id])

  const addSection = async (e) => {
    e.preventDefault()
    if (!heading.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfp_id: rfp.id, heading, content, order: Number(order) || 0 })
      })
      if (!res.ok) throw new Error('Failed to create section')
      setHeading('')
      setContent('')
      setOrder(0)
      await loadSections()
    } catch (e) {
      console.error(e)
      alert('Could not create section')
    } finally {
      setLoading(false)
    }
  }

  const generate = async (h) => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfp_title: rfp.title, section_heading: h, context: content, tone: genTone })
      })
      const data = await res.json()
      setContent(data.text || '')
    } catch (e) {
      console.error(e)
      alert('Generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Sections for: {rfp?.title}</h3>
          <div className="text-slate-400 text-sm">{sections.length} items</div>
        </div>
        <div className="space-y-2 max-h-72 overflow-auto pr-1">
          {sections.map((s) => (
            <div key={s.id} className="p-3 rounded bg-slate-900/60 border border-slate-700">
              <div className="text-white font-medium">{s.order}. {s.heading}</div>
              {s.content && <div className="text-slate-400 text-sm line-clamp-3 whitespace-pre-wrap">{s.content}</div>}
            </div>
          ))}
          {sections.length === 0 && (
            <p className="text-slate-400 text-sm">No sections yet. Add one below.</p>
          )}
        </div>
      </div>

      <form onSubmit={addSection} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Add / Edit Section</h3>
          <select value={genTone} onChange={(e)=>setGenTone(e.target.value)} className="bg-slate-900/70 border border-slate-700 rounded px-2 py-1 text-slate-200">
            <option value="professional">Professional</option>
            <option value="concise">Concise</option>
            <option value="persuasive">Persuasive</option>
          </select>
        </div>
        <input
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="Section heading"
          className="w-full bg-slate-900/70 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="Order"
            className="w-32 bg-slate-900/70 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="button" onClick={()=>generate(heading)} className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white ml-auto" disabled={loading}>
            {loading ? 'Generating...' : 'AI Generate' }
          </button>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Section content (you can edit or use AI)"
          rows={8}
          className="w-full bg-slate-900/70 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-pre-wrap"
        />
        <div className="flex gap-2">
          <button disabled={loading} className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white">
            Save Section
          </button>
        </div>
      </form>
    </div>
  )
}
