export function getRoute(){
  const h = window.location.hash || '#/home'
  const parts = h.replace('#','').split('?')
  const path = parts[0] || '/home'
  const query = new URLSearchParams(parts[1] || '')
  return { path, query }
}
export function nav(path, params){
  const qs = params ? `?${new URLSearchParams(params).toString()}` : ''
  window.location.hash = `#${path}${qs}`
}
export function onRouteChange(cb){
  const fn = () => cb(getRoute())
  window.addEventListener('hashchange', fn)
  return () => window.removeEventListener('hashchange', fn)
}
