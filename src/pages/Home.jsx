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
      <div className="stack" style={{ gap: 12 }}>
        <div className="card">
          <div className="cardBody">
            <div className="row" style={{ alignItems:'center', justifyContent:'space-between' }}>
              <div className="stack" style={{ gap: 6 }}>
                <div className="small">{t.hello},</div>
                <div className="h1">{state.userName}</div>
                <div className="row" style={{ alignItems:'center', gap: 8, flexWrap:'wrap' }}>
                  <span className="badge"><span style={{opacity:.9}}>{t.status}:</span> <b style={{color:'white'}}>{t.statuses[statusKey]}</b></span>
                  <span className={'badge ' + (state.proUnlocked ? 'pro' : '')}><Icon name="pro" /> {state.proUnlocked ? t.pro : t.free}</span>
                  <span className="badge">{t.disclaimer}</span>
                </div>
              </div>
              <div className="stack" style={{ alignItems:'flex-end', gap: 8 }}>
                <button className="btn" onClick={()=>setState(s=>({ ...s, lang: s.lang==='ru' ? 'he':'ru' }))}>🌐 {state.lang.toUpperCase()}</button>
                <div className="small" style={{ textAlign:'right', maxWidth: 240 }}>{t.grammarNote}</div>
              </div>
            </div>

            <hr className="hr" />

            <div className="row" style={{ gap: 10, flexWrap:'wrap' }}>
              <div className="kpi col"><div className="v">{kpi.courses}</div><div className="l">{t.kpiCourses}</div></div>
              <div className="kpi col"><div className="v">{kpi.articles}</div><div className="l">{t.kpiArticles}</div></div>
              <div className="kpi col"><div className="v">{kpi.protocols}</div><div className="l">{t.kpiProtocols}</div></div>
              <div className="kpi col"><div className="v">{kpi.mistakes}</div><div className="l">{t.kpiMistakes}</div></div>
            </div>
          </div>
        </div>

        <div className="row" style={{ flexWrap:'wrap' }}>
          <div className="col">
            <div className="card">
              <div className="cardHeader">
                <div className="row" style={{ alignItems:'center', justifyContent:'space-between' }}>
                  <div className="h2">{t.nextUp}</div>
                  <span className={'badge ' + (next.type==='pro' ? 'pro':'')}>{next.type==='pro' ? t.pro : t.free}</span>
                </div>
                <div className="p" style={{ marginTop: 6 }}>{next.summary[state.lang]}</div>
              </div>
              <div className="cardBody">
                <button className="btn primary" onClick={()=>nav('/course', { id: next.id })}><Icon name="play" /> {t.continue}</button>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card">
              <div className="cardHeader">
                <div className="row" style={{ alignItems:'center', justifyContent:'space-between' }}>
                  <div className="h2">{t.proZone}</div>
                  <span className="badge pro"><Icon name="pro" /> {t.pro}</span>
                </div>
                <div className="p" style={{ marginTop: 6 }}>
                  {state.lang==='ru'
                    ? 'Продвинутые технологии, коммерческие стандарты, контроль качества. Это “дорогая” часть продукта.'
                    : 'טכנולוגיות מתקדמות, סטנדרטים מסחריים ובקרת איכות. זה החלק ה”פרימיום” של המוצר.'}
                </div>
              </div>
              <div className="cardBody">
                {!state.proUnlocked ? (
                  <button className="btn pro" onClick={()=>setState(s=>({ ...s, proUnlocked: true }))}><Icon name="pro" /> {t.unlockPro}</button>
                ) : (
                  <button className="btn pro" onClick={()=>nav('/courses', { filter: 'pro' })}><Icon name="star" /> {state.lang==='ru' ? 'Открыть PRO курсы' : 'פתח קורסי PRO'}</button>
                )}
                <div className="small" style={{ marginTop: 8 }}>
                  {state.lang==='ru'
                    ? 'Для презентации: показан принцип доступа. В проде — оплата/подписка.'
                    : 'להצגה: מוצג עיקרון גישה. בגרסה מסחרית — תשלום/מנוי.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row" style={{ flexWrap:'wrap' }}>
          <div className="col">
            <div className="card">
              <div className="cardHeader">
                <div className="h2">{t.industryNews}</div>
                <div className="p" style={{ marginTop: 6 }}>{state.lang==='ru' ? 'Коротко и по делу.' : 'קצר ולעניין.'}</div>
              </div>
              <div className="cardBody">
                <div className="list">
                  {NEWS.map(n => (
                    <div key={n.id} className="item">
                      <div className="row" style={{ alignItems:'center', justifyContent:'space-between' }}>
                        <div style={{ fontWeight: 700 }}>{n[state.lang].title}</div>
                        <div className="small">{n.date}</div>
                      </div>
                      <div className="p" style={{ marginTop: 6 }}>{n[state.lang].text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card">
              <div className="cardHeader">
                <div className="h2">{state.lang==='ru' ? 'Практики рынка (UA/RU)' : 'פרקטיקות שוק (UA/RU)'}</div>
                <div className="p" style={{ marginTop: 6 }}>
                  {state.lang==='ru'
                    ? 'Оригинальные заметки по практикам студий региона (без копирования чужих материалов).'
                    : 'הערות מקוריות מפרקטיקות סטודיו באזור (בלי העתקה).'}
                </div>
              </div>
              <div className="cardBody">
                <div className="list">
                  {MARKET_NOTES.map(m => (
                    <div key={m.id} className="item">
                      <div style={{ fontWeight: 700 }}>{m[state.lang].title}</div>
                      <div className="p" style={{ marginTop: 6 }}>{m[state.lang].text}</div>
                    </div>
                  ))}
                </div>
                <div className="small" style={{ marginTop: 10 }}>
                  {state.lang==='ru'
                    ? 'Дальше можно добавить реальные кейсы Carfix (без персональных данных клиентов).'
                    : 'בהמשך אפשר להוסיף מקרי אמת מ‑Carfix (בלי נתוני לקוחות).'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row" style={{ flexWrap:'wrap' }}>
          <div className="col">
            <div className="card">
              <div className="cardHeader">
                <div className="row" style={{ alignItems:'center', justifyContent:'space-between' }}>
                  <div className="h2">{t.protocols}</div>
                  <button className="btn" onClick={()=>nav('/wiki', { special:'protocols' })}>{t.open}</button>
                </div>
                <div className="p" style={{ marginTop: 6 }}>{state.lang==='ru' ? 'Стандарты = повторяемое качество.' : 'סטנדרטים = איכות חוזרת.'}</div>
              </div>
              <div className="cardBody">
                <div className="small">{state.lang==='ru' ? 'Это то, чего нет у большинства курсов в сети.' : 'זה מה שחסר לרוב הקורסים ברשת.'}</div>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card">
              <div className="cardHeader">
                <div className="row" style={{ alignItems:'center', justifyContent:'space-between' }}>
                  <div className="h2">{t.mistakes}</div>
                  <button className="btn" onClick={()=>nav('/wiki', { special:'mistakes' })}>{t.open}</button>
                </div>
                <div className="p" style={{ marginTop: 6 }}>{state.lang==='ru' ? 'Причины → решение → профилактика.' : 'סיבה → פתרון → מניעה.'}</div>
              </div>
              <div className="cardBody">
                <div className="small">{state.lang==='ru' ? 'Снижает переделки и поднимает уровень команды.' : 'מוריד תיקונים ומעלה רמה לצוות.'}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
