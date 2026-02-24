import React, { useMemo } from 'react'
import { Icon } from '../components/Icons.jsx'
import { nav } from '../lib/router.js'
import { computeStatus, getNextCourse } from '../state.js'
import { COURSES, NEWS, MARKET_NOTES } from '../data/content.js'

export function Home({ t, state, setState }){
  const statusKey = useMemo(()=>computeStatus(state), [state])
  const next = useMemo(()=>getNextCourse(state), [state])

  const kpi = { courses: COURSES.length, articles: 7, protocols: 2, mistakes: 2 }

  return (
    <div className="container">
      <div className="stack">

        <div className="card">
          <div className="cardBody">
            <div className="grid grid2" style={{ alignItems:'start' }}>
              <div className="stack" style={{ gap: 8 }}>
                <div className="small">{t.hello},</div>
                <div className="h1" style={{ lineHeight: 1.15, wordBreak:'break-word' }}>{state.userName}</div>

                <div className="stack" style={{ gap: 8 }}>
                  <div className="grid grid2">
                    <span className="badge" style={{ justifyContent:'center' }}>
                      <span style={{opacity:.9}}>{t.status}:</span>
                      <b style={{color:'white'}}>{t.statuses[statusKey]}</b>
                    </span>
                    <span className={'badge ' + (state.proUnlocked ? 'pro' : '')} style={{ justifyContent:'center' }}>
                      <Icon name="pro" /> {state.proUnlocked ? t.pro : t.free}
                    </span>
                  </div>

                  <span className="badge" style={{ justifyContent:'center', whiteSpace:'normal' }}>
                    {t.disclaimer}
                  </span>
                </div>
              </div>

              <div className="stack" style={{ gap: 8, alignItems:'stretch' }}>
                <button className="btn" onClick={()=>setState(s=>({ ...s, lang: s.lang==='ru' ? 'he':'ru' }))}>🌐 {state.lang.toUpperCase()}</button>
                <div className="small" style={{ textAlign:'right' }}>{t.grammarNote}</div>
              </div>
            </div>

            <hr className="hr" />

            <div className="grid grid2">
              <div className="kpi"><div className="v">{kpi.courses}</div><div className="l">{t.kpiCourses}</div></div>
              <div className="kpi"><div className="v">{kpi.articles}</div><div className="l">{t.kpiArticles}</div></div>
              <div className="kpi"><div className="v">{kpi.protocols}</div><div className="l">{t.kpiProtocols}</div></div>
              <div className="kpi"><div className="v">{kpi.mistakes}</div><div className="l">{t.kpiMistakes}</div></div>
            </div>
          </div>
        </div>

        <div className="grid grid2">
          <div className="card">
            <div className="cardHeader">
              <div className="grid grid2" style={{ alignItems:'center' }}>
                <div className="h2">{t.nextUp}</div>
                <div style={{ textAlign:'right' }}>
                  <span className={'badge ' + (next.type==='pro' ? 'pro':'')}>{next.type==='pro' ? t.pro : t.free}</span>
                </div>
              </div>
              <div className="p" style={{ marginTop: 8 }}>{next.summary[state.lang]}</div>
            </div>
            <div className="cardBody">
              <button className="btn primary" onClick={()=>nav('/course', { id: next.id })}><Icon name="play" /> {t.continue}</button>
            </div>
          </div>

          <div className="card">
            <div className="cardHeader">
              <div className="grid grid2" style={{ alignItems:'center' }}>
                <div className="h2">{t.proZone}</div>
                <div style={{ textAlign:'right' }}>
                  <span className="badge pro"><Icon name="pro" /> {t.pro}</span>
                </div>
              </div>
              <div className="p" style={{ marginTop: 8 }}>
                {state.lang==='ru'
                  ? 'Продвинутые технологии, коммерческие стандарты, контроль качества.'
                  : 'טכנולוגיות מתקדמות, סטנדרטים מסחריים ובקרת איכות.'}
              </div>
            </div>
            <div className="cardBody">
              {!state.proUnlocked ? (
                <button className="btn pro" onClick={()=>setState(s=>({ ...s, proUnlocked: true }))}><Icon name="pro" /> {t.unlockPro}</button>
              ) : (
                <button className="btn pro" onClick={()=>nav('/courses', { filter: 'pro' })}><Icon name="star" /> {state.lang==='ru' ? 'PRO курсы' : 'קורסי PRO'}</button>
              )}
              <div className="small" style={{ marginTop: 10 }}>
                {state.lang==='ru'
                  ? 'В проде: оплата/подписка. Сейчас — демонстрация доступа.'
                  : 'במסחרי: תשלום/מנוי. כרגע — הדגמת גישה.'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid2">
          <div className="card">
            <div className="cardHeader">
              <div className="h2">{t.industryNews}</div>
              <div className="p" style={{ marginTop: 8 }}>{state.lang==='ru' ? 'Коротко и по делу.' : 'קצר ולעניין.'}</div>
            </div>
            <div className="cardBody">
              <div className="hScroll">
                {NEWS.map(n => (
                  <div key={n.id} className="item hCard">
                    <div className="grid grid2" style={{ alignItems:'start' }}>
                      <div style={{ fontWeight: 800, wordBreak:'break-word' }}>{n[state.lang].title}</div>
                      <div className="small" style={{ textAlign:'right' }}>{n.date}</div>
                    </div>
                    <div className="p" style={{ marginTop: 8 }}>{n[state.lang].text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="cardHeader">
              <div className="h2">{state.lang==='ru' ? 'Практики рынка (UA/RU)' : 'פרקטיקות שוק (UA/RU)'}</div>
              <div className="p" style={{ marginTop: 8 }}>
                {state.lang==='ru'
                  ? 'Оригинальные заметки по практикам студий региона.'
                  : 'הערות מקוריות מפרקטיקות סטודיו באזור.'}
              </div>
            </div>
            <div className="cardBody">
              <div className="hScroll">
                {MARKET_NOTES.map(m => (
                  <div key={m.id} className="item hCard">
                    <div style={{ fontWeight: 800, wordBreak:'break-word' }}>{m[state.lang].title}</div>
                    <div className="p" style={{ marginTop: 8 }}>{m[state.lang].text}</div>
                  </div>
                ))}
              </div>
              <div className="small" style={{ marginTop: 10 }}>
                {state.lang==='ru'
                  ? 'Дальше добавим реальные кейсы (без персональных данных).'
                  : 'בהמשך נוסיף מקרי אמת (בלי נתונים אישיים).'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid2">
          <div className="card">
            <div className="cardHeader">
              <div className="grid grid2" style={{ alignItems:'center' }}>
                <div className="h2">{t.protocols}</div>
                <div style={{ textAlign:'right' }}>
                  <button className="btn" onClick={()=>nav('/wiki', { special:'protocols' })}>{t.open}</button>
                </div>
              </div>
              <div className="p" style={{ marginTop: 8 }}>{state.lang==='ru' ? 'Стандарты = повторяемое качество.' : 'סטנדרטים = איכות חוזרת.'}</div>
            </div>
            <div className="cardBody">
              <div className="small">{state.lang==='ru' ? 'Схемы для команды: быстро, стабильно, без “переделок”.' : 'תהליכים לצוות: מהר, יציב, בלי “תיקונים”.'}</div>
            </div>
          </div>

          <div className="card">
            <div className="cardHeader">
              <div className="grid grid2" style={{ alignItems:'center' }}>
                <div className="h2">{t.mistakes}</div>
                <div style={{ textAlign:'right' }}>
                  <button className="btn" onClick={()=>nav('/wiki', { special:'mistakes' })}>{t.open}</button>
                </div>
              </div>
              <div className="p" style={{ marginTop: 8 }}>{state.lang==='ru' ? 'Причины → решение → профилактика.' : 'סיבה → פתרון → מניעה.'}</div>
            </div>
            <div className="cardBody">
              <div className="small">{state.lang==='ru' ? 'Снижает рекламации и повышает уровень мастеров.' : 'מוריד תלונות ומעלה רמה למקצוענים.'}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
