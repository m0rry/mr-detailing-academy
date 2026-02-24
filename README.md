import React, { useMemo } from 'react'
import { TopBar } from '../components/TopBar.jsx'
import { PROTOCOLS } from '../data/content.js'

function getId(){
  const h = window.location.hash
  const q = h.includes('?') ? h.split('?')[1] : ''
  const sp = new URLSearchParams(q)
  return sp.get('id')
}

export function Protocol({ t, state }){
  const id = getId()
  const p = useMemo(()=>PROTOCOLS.find(x=>x.id===id) || PROTOCOLS[0], [id])

  return (
    <div className="container">
      <TopBar title={p.title[state.lang]} backTo="/wiki?special=protocols" />
      <div className="card">
        <div className="cardBody">
          <div className="small">{t.updated}: {p.updated}</div>
          <hr className="hr" />
          <div className="h2">{state.lang==='ru' ? 'Шаги' : 'שלבים'}</div>
          <div className="list" style={{ marginTop: 10 }}>
            {p.steps[state.lang].map((s,i)=>(<div key={i} className="item">{(i+1)+'. '} {s}</div>))}
          </div>
          <div className="h2" style={{ marginTop: 12 }}>{state.lang==='ru' ? 'Заметки' : 'הערות'}</div>
          <div className="list" style={{ marginTop: 10 }}>
            {p.notes[state.lang].map((s,i)=>(<div key={i} className="item">{s}</div>))}
          </div>
        </div>
      </div>
    </div>
  )
}
