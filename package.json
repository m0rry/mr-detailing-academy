import React, { useMemo } from 'react'
import { TopBar } from '../components/TopBar.jsx'
import { WIKI_ARTICLES } from '../data/content.js'

function getId(){
  const h = window.location.hash
  const q = h.includes('?') ? h.split('?')[1] : ''
  const sp = new URLSearchParams(q)
  return sp.get('id')
}

export function WikiArticle({ t, state }){
  const id = getId()
  const a = useMemo(()=>WIKI_ARTICLES.find(x=>x.id===id) || WIKI_ARTICLES[0], [id])

  return (
    <div className="container">
      <TopBar title={a.title[state.lang]} backTo="/wiki" />
      <div className="card">
        <div className="cardBody">
          <div className="small">{t.updated}: {a.updated}</div>
          <hr className="hr" />
          <div className="stack" style={{ gap: 10 }}>
            {a.body[state.lang].map((p,i)=>(
              <div key={i} className="p" style={{ color:'rgba(255,255,255,.80)' }}>{p}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
