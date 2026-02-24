import React from 'react'
export function Icon({ name, size=16 }){
  const style = { width:size, height:size, display:'inline-block' }
  const map = { home:'🏠', courses:'🎓', support:'🛠️', wiki:'📘', pro:'💎', play:'▶️', back:'←', protocol:'📘', warn:'⚠️', star:'⭐' }
  return <span style={style} aria-hidden="true">{map[name] || '•'}</span>
}
