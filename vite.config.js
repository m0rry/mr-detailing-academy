import React, { useMemo } from 'react'
import { TopBar } from '../components/TopBar.jsx'
import { MISTAKES } from '../data/content.js'

function getId(){
  const h = window.location.hash
  const q = h.includes('?') ? h.split('?')[1] : ''
  const sp = new URLSearchParams(q)
  return sp.get('id')
}

export function Mistake({ t, state }){
  const id = getId()
  const m = useMemo(()=>MISTAKES.find(x=>x.id===id) || MISTAKES[0], [id])

  return (
    <div className="container">
      <TopBar title={m.title[state.lang]} backTo="/wiki?special=mistakes" />
      <div className="stack">
        <div className="card">
          <div className="cardBody">
            <div className="small">{t.updated}: {m.updated}</div>
            <hr className="hr" />
            <div className="h2">{state.lang==='ru' ? 'Причины' : 'סיבות'}</div>
            <div className="list" style={{ marginTop: 10 }}>
              {m.why[state.lang].map((s,i)=>(<div key={i} className="item">{s}</div>))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="cardBody">
            <div className="h2">{state.lang==='ru' ? 'Что делать' : 'מה עושים'}</div>
            <div className="list" style={{ marginTop: 10 }}>
              {m.fix[state.lang].map((s,i)=>(<div key={i} className="item">{s}</div>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
