import React from 'react'
import { Icon } from './Icons.jsx'
import { nav } from '../lib/router.js'

export function BottomNav({ t, active }){
  const items = [
    { id:'home', label:t.tabs.home, icon:'home', path:'/home' },
    { id:'courses', label:t.tabs.courses, icon:'courses', path:'/courses' },
    { id:'support', label:t.tabs.support, icon:'support', path:'/support' },
    { id:'wiki', label:t.tabs.wiki, icon:'wiki', path:'/wiki' },
  ]
  return (
    <div className="nav">
      <div className="navInner">
        {items.map(it => (
          <div key={it.id}
            className={'tab' + (active===it.id ? ' active' : '')}
            onClick={()=>nav(it.path)}
            role="button"
            tabIndex={0}
          >
            <Icon name={it.icon} />
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
