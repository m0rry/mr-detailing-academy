import { loadState, saveState } from './lib/storage.js'
import { COURSES } from './data/content.js'

export function defaultState(){
  return { lang:'ru', userName:'Mark', openedCourses:['prep-wash'], lastCourseId:'prep-wash', proUnlocked:false }
}
export function hydrate(){
  const saved = loadState()
  const st = { ...defaultState(), ...(saved||{}) }
  if(!Array.isArray(st.openedCourses)) st.openedCourses = []
  if(!st.lastCourseId) st.lastCourseId = st.openedCourses[0] || 'prep-wash'
  return st
}
export function persist(state){ saveState(state) }

export function computeStatus(state){
  const opened = state.openedCourses?.length || 0
  if(state.proUnlocked) return 'pro'
  if(opened >= 2) return 'master'
  if(opened >= 1) return 'practitioner'
  return 'newbie'
}
export function getNextCourse(state){
  const byId = Object.fromEntries(COURSES.map(c=>[c.id,c]))
  if(state.lastCourseId && byId[state.lastCourseId]) return byId[state.lastCourseId]
  const opened = new Set(state.openedCourses || [])
  return COURSES.find(c=>!opened.has(c.id) && c.type==='free') || COURSES[0]
}
export function openCourse(state, courseId){
  const opened = new Set(state.openedCourses || [])
  opened.add(courseId)
  return { ...state, openedCourses:[...opened], lastCourseId: courseId }
}
