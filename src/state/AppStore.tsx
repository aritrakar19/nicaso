import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type { CategoryFilter, ProjectDetail } from '@/types'
import { ENGAGEMENT_ID, engagementProject } from '@/data/projects'
import * as P from './projectReducer'

interface State {
  shortlist: string[]
  category: CategoryFilter
  projects: Record<string, ProjectDetail>
  /** Set once the wedding quote has been booked and paid. */
  weddingProjectId: string | null
}

type Action =
  | { type: 'toggleShortlist'; id: string }
  | { type: 'setCategory'; category: CategoryFilter }
  | { type: 'addProject'; project: ProjectDetail; isWedding?: boolean }
  | { type: 'updateProject'; id: string; update: (p: ProjectDetail) => ProjectDetail }

const initialState: State = {
  shortlist: ['northlight', 'lensary', 'frames'],
  category: 'All',
  projects: { [ENGAGEMENT_ID]: engagementProject },
  weddingProjectId: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'toggleShortlist': {
      const has = state.shortlist.includes(action.id)
      return { ...state, shortlist: has ? state.shortlist.filter((x) => x !== action.id) : [...state.shortlist, action.id] }
    }
    case 'setCategory':
      return { ...state, category: action.category }
    case 'addProject':
      return {
        ...state,
        projects: { ...state.projects, [action.project.id]: action.project },
        weddingProjectId: action.isWedding ? action.project.id : state.weddingProjectId,
      }
    case 'updateProject': {
      const current = state.projects[action.id]
      if (!current) return state
      return { ...state, projects: { ...state.projects, [action.id]: action.update(current) } }
    }
  }
}

function useStoreValue() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const actions = useMemo(() => {
    const update = (id: string, fn: (p: ProjectDetail) => ProjectDetail) => dispatch({ type: 'updateProject', id, update: fn })
    return {
      toggleShortlist: (id: string) => dispatch({ type: 'toggleShortlist', id }),
      setCategory: (category: CategoryFilter) => dispatch({ type: 'setCategory', category }),
      bookWedding: (project: ProjectDetail) => dispatch({ type: 'addProject', project, isWedding: true }),
      approveDelivery: (id: string) => update(id, P.approveDelivery),
      togglePick: (id: string, photoId: string) => update(id, (p) => P.togglePick(p, photoId)),
      raiseChange: (id: string, title: string) => update(id, (p) => P.raiseChange(p, title)),
      respondChange: (id: string, changeId: string, accept: boolean) => update(id, (p) => P.respondChange(p, changeId, accept)),
      sendMessage: (id: string, text: string) => update(id, (p) => P.sendMessage(p, text)),
      openDispute: (id: string, caseId: string, reason: string) => update(id, (p) => P.openDispute(p, caseId, reason)),
    }
  }, [])
  return { state, actions }
}

type Store = ReturnType<typeof useStoreValue>

const StoreContext = createContext<Store | null>(null)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const store = useStoreValue()
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useAppStore(): Store {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useAppStore must be used inside <AppStoreProvider>')
  return store
}
