import React, { useMemo } from 'react'
import { TopBar } from '../components/TopBar.jsx'
import { Icon } from '../components/Icons.jsx'
import { nav } from '../lib/router.js'
import { COURSES } from '../data/content.js'

export function Courses({ t, state }){
  const routeFilter = (() => {
    const h = window.location.hash
    const q = h.includes('?') ? h.split('?')[1] : ''
    const sp = new URLSearchParams(q)
    return sp.get('filter')
  })()

  const list = useMemo(()=>{
    if(routeFilter==='pro') return COURSES.filter(c=>c.type==='pro')
    if(routeFilter==='free') return COURSES.filter(c=>c.type==='free')
    return COURSES
  }, [routeFilter])

  return (
    <div className="container">
      <TopBar
        title={t.tabs.courses}
        right={
          <div className="grid grid2" style={{ gap: 10 }}>
            <button className="btn" onClick={()=>nav('/courses', { filter:'free' })}>{t.free}</button>
            <button className="btn" onClick={()=>nav('/courses', { filter:'pro' })}>{t.pro}</button>
            <button className="btn" onClick={()=>nav('/courses')}>{state.lang==='ru' ? 'Все' : 'הכל'}</button>
          </div>
        }
      />

      <div className="list">
        {list.map(c => {
          const isLocked = c.type==='pro' && !state.proUnlocked
          const opened = (state.openedCourses || []).includes(c.id)
          return (
            <div key={c.id} className="item">
              <div className="row" style={{ alignItems:'center', justifyContent:'space-between' }}>
                <div className="stack" style={{ gap: 6 }}>
                  <div className="row" style={{ gap: 8, flexWrap:'wrap', alignItems:'center' }}>
                    <div style={{ fontWeight: 800 }}>{c.title[state.lang]}</div>
                    <span className={'badge ' + (c.type==='pro' ? 'pro' : '')}>
                      {c.type==='pro' ? <><Icon name="pro" /> {t.pro}</> : t.free}
                    </span>
                    {opened ? <span className="badge">{state.lang==='ru' ? 'Открыт' : 'נפתח'}</span> : null}
                  </div>
                  <div className="p">{c.summary[state.lang]}</div>
                  <div className="small">{t.level}: {c.level[state.lang]}</div>
                </div>
                <div className="stack" style={{ alignItems:'flex-end' }}>
                  <button className={'btn ' + (c.type==='pro' ? 'pro' : 'primary')}
                    onClick={()=> isLocked ? nav('/home') : nav('/course', { id: c.id })}
                  >
                    {isLocked ? (state.lang==='ru' ? 'Требуется PRO' : 'נדרש PRO') : t.open}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="small" style={{ marginTop: 12 }}>
        {state.lang==='ru'
          ? 'Структура курса как программа: для кого → результат → шаги. Это выглядит “дорого”.'
          : 'מבנה קורס כתכנית: למי → תוצאה → שלבים. זה נראה “פרימיום”.'}
      </div>
    </div>
  )
}
