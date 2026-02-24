export function initTelegram(){
  const tg = window.Telegram?.WebApp
  if(!tg) return { tg: null, isTelegram: false }
  try{
    tg.ready()
    tg.expand()
    tg.setHeaderColor?.('#0b1020')
    tg.setBackgroundColor?.('#0b1020')
  }catch(e){}
  return { tg, isTelegram: true }
}
export function getTgUser(){
  const tg = window.Telegram?.WebApp
  const u = tg?.initDataUnsafe?.user
  if(!u) return null
  const name = [u.first_name, u.last_name].filter(Boolean).join(' ')
  return { id: u.id, name: name || 'User', username: u.username || '' }
}
