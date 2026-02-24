import React, { useMemo, useState } from 'react'
import { TopBar } from '../components/TopBar.jsx'
import { nav } from '../lib/router.js'
import { Icon } from '../components/Icons.jsx'
import { WIKI_CATEGORIES, WIKI_ARTICLES, PROTOCOLS, MISTAKES } from '../data/content.js'

function getParams(){
  const h = window.location.hash
  const q = h.includes('?') ? h.split('?')[1] : ''
  return new URLSearchParams(q)
}

export function Wiki({ t, state }){
  const params = getParams()
  const special = params.get('special')
  const [q, setQ] = useState('')

  const articles = useMemo(()=>{
    const query = q.trim().toLowerCase()
    if(special) return []
    return WIKI_ARTICLES.filter(a=>{
      const title = a.title[state.lang].toLowerCase()
      const body = a.body[state.lang].join(' ').toLowerCase()
      return !query || title.includes(query) || body.includes(query)
    })
  }, [q, state.lang, special])

  const cats = useMemo(()=> special ? WIKI_CATEGORIES.filter(c=>c.special===special) : WIKI_CATEGORIES.filter(c=>!c.special), [special])

  return (
    <div className="container">
      <TopBar title={t.tabs.wiki} right={<button className="btn" onClick={()=>nav('/home')}>{state.lang==='ru' ? 'Дашборд' : 'דשבורד'}</button>} />

      <div className="card">
        <div className="cardBody">
          <input className="input" value={q} onChange={(e)=>setQ(e.target.value)} placeholder={t.searchPlaceholder} />
          <div className="small" style={{ marginTop: 8 }}>
            {state.lang==='ru'
              ? 'Химия, круги, машинки, микрофибра, защиты и процессы. Плюс — протоколы и разбор ошибок.'
              : 'כימיה, פדים, מכונות, מיקרופייבר, הגנות ותהליכים. בנוסף — פרוטוקולים וטעויות.'}
          </div>
        </div>
      </div>

      {!special ? (
        <div className="grid grid2" style={{ marginTop: 12 }}>
          <div className="col">
            <div className="card">
              <div className="cardHeader">
                <div className="row" style={{ alignItems:'center', justifyContent:'space-between' }}>
                  <div className="h2">{t.protocols}</div>
                  <button className="btn" onClick={()=>nav('/wiki', { special:'protocols' })}>{t.open}</button>
                </div>
              </div>
              <div className="cardBody"><div className="p">{state.lang==='ru' ? 'Пошаговые стандарты для команды.' : 'סטנדרטים צעד-אחר-צעד לצוות.'}</div></div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="cardHeader">
                <div className="row" style={{ alignItems:'center', justifyContent:'space-between' }}>
                  <div className="h2">{t.mistakes}</div>
                  <button className="btn" onClick={()=>nav('/wiki', { special:'mistakes' })}>{t.open}</button>
                </div>
              </div>
              <div className="cardBody"><div className="p">{state.lang==='ru' ? 'Причины дефектов и быстрые решения.' : 'סיבות לפגמים ופתרונות מהירים.'}</div></div>
            </div>
          </div>
        </div>
      ) : null}

      {special==='protocols' ? (
        <div className="stack" style={{ marginTop: 12 }}>
          {PROTOCOLS.map(p => (
            <div key={p.id} className="item" onClick={()=>nav('/protocol', { id: p.id })} role="button" tabIndex={0}>
              <div className="row" style={{ alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontWeight: 800 }}><Icon name="protocol" /> {p.title[state.lang]}</div>
                <div className="small">{t.updated}: {p.updated}</div>
              </div>
              <div className="p" style={{ marginTop: 6 }}>{state.lang==='ru' ? 'Открыть схему.' : 'פתח תהליך.'}</div>
            </div>
          ))}
        </div>
      ) : null}

      {special==='mistakes' ? (
        <div className="stack" style={{ marginTop: 12 }}>
          {MISTAKES.map(m => (
            <div key={m.id} className="item" onClick={()=>nav('/mistake', { id: m.id })} role="button" tabIndex={0}>
              <div className="row" style={{ alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontWeight: 800 }}><Icon name="warn" /> {m.title[state.lang]}</div>
                <div className="small">{t.updated}: {m.updated}</div>
              </div>
              <div className="p" style={{ marginTop: 6 }}>{state.lang==='ru' ? 'Причины → решение → профилактика.' : 'סיבה → פתרון → מניעה.'}</div>
            </div>
          ))}
        </div>
      ) : null}

      {!special ? (
        <>
          <div className="grid grid2" style={{ marginTop: 12 }}>
            {cats.map(c => (
              <div key={c.id}>
                <div className="item" onClick={()=>nav('/wiki-cat', { id: c.id })} role="button" tabIndex={0}>
                  <div style={{ fontWeight: 800 }}>{c.icon} {c.title[state.lang]}</div>
                  <div className="small" style={{ marginTop: 6 }}>{state.lang==='ru' ? 'Открыть раздел' : 'פתח קטגוריה'}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: 12 }}>
            <div className="cardHeader">
              <div className="h2">{state.lang==='ru' ? 'Статьи' : 'מאמרים'}</div>
              <div className="p" style={{ marginTop: 6 }}>{state.lang==='ru' ? 'Короткие практичные материалы.' : 'חומרים קצרים ומעשיים.'}</div>
            </div>
            <div className="cardBody">
              <div className="list">
                {articles.map(a => (
                  <div key={a.id} className="item" onClick={()=>nav('/wiki-article', { id: a.id })} role="button" tabIndex={0}>
                    <div className="row" style={{ alignItems:'center', justifyContent:'space-between' }}>
                      <div style={{ fontWeight: 800 }}>{a.title[state.lang]}</div>
                      <div className="small">{t.updated}: {a.updated}</div>
                    </div>
                    <div className="p" style={{ marginTop: 6 }}>{a.body[state.lang][0]}</div>
                  </div>
                ))}
                {articles.length===0 ? <div className="small">{state.lang==='ru' ? 'Ничего не найдено.' : 'לא נמצא.'}</div> : null}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
