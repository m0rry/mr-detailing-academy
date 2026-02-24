import React from 'react'
import { TopBar } from '../components/TopBar.jsx'

export function Support({ t, state }){
  const msg = state.lang==='ru'
    ? 'Привет! Нужна консультация. Машина/год: … Состояние: … Что пробовали: … Цель: …'
    : 'היי! צריך ייעוץ. רכב/שנה: … מצב: … מה ניסית: … מטרה: …'

  const openTelegram = () => {
    const tg = window.Telegram?.WebApp
    const url = 'https://t.me/'
    try{ tg?.openTelegramLink ? tg.openTelegramLink(url) : window.open(url,'_blank') }
    catch{ window.open(url,'_blank') }
  }

  const copyTemplate = async () => {
    try{ await navigator.clipboard.writeText(msg); alert(state.lang==='ru' ? 'Скопировано' : 'הועתק') }
    catch{ alert(state.lang==='ru' ? 'Не удалось скопировать' : 'לא הצליח') }
  }

  return (
    <div className="container">
      <TopBar title={t.tabs.support} />
      <div className="card">
        <div className="cardBody">
          <div className="h1">{t.aboutSupport}</div>
          <div className="p" style={{ marginTop: 8 }}>{t.supportPitch}</div>
          <div className="row" style={{ gap: 10, flexWrap:'wrap', marginTop: 14 }}>
            <button className="btn primary" onClick={openTelegram}>🟦 {t.supportCTA1}</button>
            <button className="btn" onClick={copyTemplate}>📋 {t.supportCTA2}</button>
          </div>
          <div className="small" style={{ marginTop: 12 }}>
            {state.lang==='ru' ? 'В релизе подключим оплату/подписку и кабинет заявок.' : 'בגרסת שוק נחבר תשלום/מנוי ומערכת פניות.'}
          </div>
        </div>
      </div>
    </div>
  )
}
