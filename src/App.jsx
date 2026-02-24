import React, { useEffect, useMemo, useState } from 'react'
import './styles.css'
import { initTelegram, getTgUser } from './lib/telegram.js'
import { getRoute, onRouteChange } from './lib/router.js'
import { hydrate, persist } from './state.js'
import { UI } from './data/content.js'
import { BottomNav } from './components/Nav.jsx'

import { Home } from './pages/Home.jsx'
import { Courses } from './pages/Courses.jsx'
import { Course } from './pages/Course.jsx'
import { Support } from './pages/Support.jsx'
import { Wiki } from './pages/Wiki.jsx'
import { WikiCat } from './pages/WikiCat.jsx'
import { WikiArticle } from './pages/WikiArticle.jsx'
import { Protocol } from './pages/Protocol.jsx'
import { Mistake } from './pages/Mistake.jsx'

export default function App(){
  const [state, setState] = useState(()=>hydrate())
  const [route, setRoute] = useState(()=>getRoute())
  const t = useMemo(()=>UI[state.lang] || UI.ru, [state.lang])

  useEffect(()=>{
    initTelegram()
    const u = getTgUser()
    if(u?.name) setState(s=>({ ...s, userName: u.name }))
    const off = onRouteChange(setRoute)
    return off
  }, [])

  useEffect(()=>{ persist(state) }, [state])

  const page = route.path
  const activeTab = page.startsWith('/courses') || page.startsWith('/course') ? 'courses'
    : page.startsWith('/support') ? 'support'
    : page.startsWith('/wiki') || page.startsWith('/protocol') || page.startsWith('/mistake') ? 'wiki'
    : 'home'

  return (
    <>
      {(page==='/home' || page==='') && <Home t={t} state={state} setState={setState} />}
      {page==='/courses' && <Courses t={t} state={state} />}
      {page==='/course' && <Course t={t} state={state} setState={setState} />}
      {page==='/support' && <Support t={t} state={state} />}
      {page==='/wiki' && <Wiki t={t} state={state} />}
      {page==='/wiki-cat' && <WikiCat t={t} state={state} />}
      {page==='/wiki-article' && <WikiArticle t={t} state={state} />}
      {page==='/protocol' && <Protocol t={t} state={state} />}
      {page==='/mistake' && <Mistake t={t} state={state} />}

      <BottomNav t={t} active={activeTab} />
    </>
  )
}
