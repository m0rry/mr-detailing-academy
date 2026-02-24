import React from 'react'
import { Icon } from './Icons.jsx'
import { nav } from '../lib/router.js'

export function TopBar({ title, right, backTo }){
  return (
    <div className="row" style={{ alignItems:'center', justifyContent:'space-between', marginBottom: 10 }}>
      <div className="row" style={{ alignItems:'center', gap:10 }}>
        {backTo ? (
          <button className="btn" onClick={()=>nav(backTo)} aria-label="Back">
            <Icon name="back" />
          </button>
        ) : null}
        <div className="h2">{title}</div>
      </div>
      <div className="row" style={{ alignItems:'center' }}>
        {right}
      </div>
    </div>
  )
}
