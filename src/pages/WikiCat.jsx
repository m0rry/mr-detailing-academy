import React, { useMemo } from 'react'
import { TopBar } from '../components/TopBar.jsx'
import { nav } from '../lib/router.js'
import { WIKI_CATEGORIES, WIKI_ARTICLES } from '../data/content.js'

function getId(){
  const h = window.location.hash
  const q = h.includes('?') ? h.split('?')[1] : ''
  const sp = new URLSearchParams(q)
  return sp.get('id')
}

export function WikiCat({ t, state }){
  const id = getId()
  const cat = useMemo(()=>WIKI_CATEGORIES.find(c=>c.id===id) || WIKI_CATEGORIES[0], [id])
  const list = useMemo(()=>WIKI_ARTICLES.filter(a=>a.cat===id), [id])

  return (
    <div className="container">
      <TopBar title={`${cat.icon} ${cat.title[state.lang]}`} backTo="/wiki" />
      <div className="list">
        {list.map(a => (
          <div key={a.id} className="item" onClick={()=>nav('/wiki-article', { id: a.id })} role="button" tabIndex={0}>
            <div className="row" style={{ alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontWeight: 800 }}>{a.title[state.lang]}</div>
              <div className="small">{t.updated}: {a.updated}</div>
            </div>
            <div className="p" style={{ marginTop: 6 }}>{a.body[state.lang][0]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
