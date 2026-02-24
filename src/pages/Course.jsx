import React, { useMemo } from 'react'
import { TopBar } from '../components/TopBar.jsx'
import { COURSES } from '../data/content.js'
import { openCourse } from '../state.js'

function getCourseId(){
  const h = window.location.hash
  const q = h.includes('?') ? h.split('?')[1] : ''
  const sp = new URLSearchParams(q)
  return sp.get('id')
}

export function Course({ t, state, setState }){
  const id = getCourseId()
  const course = useMemo(()=>COURSES.find(c=>c.id===id) || COURSES[0], [id])
  const locked = course.type==='pro' && !state.proUnlocked

  return (
    <div className="container">
      <TopBar title={course.title[state.lang]} backTo="/courses" />
      {locked ? (
        <div className="card">
          <div className="cardBody">
            <div className="h2">{state.lang==='ru' ? 'Курс доступен в PRO' : 'הקורס זמין ב‑PRO'}</div>
            <div className="p" style={{ marginTop: 8 }}>
              {state.lang==='ru'
                ? 'Для презентации включи PRO на главной.'
                : 'להצגה אפשר להפעיל PRO בבית.'}
            </div>
          </div>
        </div>
      ) : (
        <div className="stack">
          <div className="card">
            <div className="cardBody">
              <div className="row" style={{ alignItems:'center', justifyContent:'space-between', flexWrap:'wrap' }}>
                <div className="badge">{t.level}: <b style={{ color:'white' }}>{course.level[state.lang]}</b></div>
                <div className={'badge ' + (course.type==='pro' ? 'pro' : '')}>{course.type==='pro' ? t.pro : t.free}</div>
              </div>
              <div className="p" style={{ marginTop: 10 }}>{course.summary[state.lang]}</div>
              <div style={{ marginTop: 12 }}>
                <button className="btn primary" onClick={()=>setState(s=>openCourse(s, course.id))}>
                  {state.lang==='ru' ? 'Отметить как пройдено / открыть' : 'סמן כבוצע / פתח'}
                </button>
                <div className="small" style={{ marginTop: 8 }}>
                  {state.lang==='ru'
                    ? 'В следующей версии добавим тесты и серверную фиксацию результата.'
                    : 'בגרסה הבאה נוסיף מבחנים ושמירה בשרת.'}
                </div>
              </div>
            </div>
          </div>

          <div className="card"><div className="cardHeader"><div className="h2">{t.forWhom}</div></div>
            <div className="cardBody"><div className="list">{course.forWhom[state.lang].map((x,i)=>(<div key={i} className="item">{x}</div>))}</div></div>
          </div>

          <div className="card"><div className="cardHeader"><div className="h2">{t.outcome}</div></div>
            <div className="cardBody"><div className="list">{course.outcome[state.lang].map((x,i)=>(<div key={i} className="item">{x}</div>))}</div></div>
          </div>

          <div className="card"><div className="cardHeader"><div className="h2">{t.program}</div></div>
            <div className="cardBody"><div className="list">{course.program[state.lang].map((x,i)=>(<div key={i} className="item">{(i+1)+'. '} {x}</div>))}</div></div>
          </div>
        </div>
      )}
    </div>
  )
}
