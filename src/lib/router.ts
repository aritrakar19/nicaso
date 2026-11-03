import { useEffect, useState } from 'react'

/**
 * Tiny typed hash router. Hash URLs work on any static host (including the
 * Figma Make preview) without server-side rewrites.
 */
export type Route =
  | { name: 'home' }
  | { name: 'explore' }
  | { name: 'provider'; id: string }
  | { name: 'brief' }
  | { name: 'quotes' }
  | { name: 'checkout'; providerId: string }
  | { name: 'projects' }
  | { name: 'project'; id: string }
  | { name: 'help' }
  | { name: 'notFound' }

export type AppRoute = Exclude<Route, { name: 'notFound' }>

/** Top-level nav section a route belongs to. */
export type Section = 'home' | 'explore' | 'projects' | 'help'

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '').split('?')[0] || '/'
  const [first, second] = path.split('/').filter(Boolean)
  switch (first) {
    case undefined:
      return { name: 'home' }
    case 'explore':
      return { name: 'explore' }
    case 'providers':
      return second ? { name: 'provider', id: second } : { name: 'explore' }
    case 'brief':
      return { name: 'brief' }
    case 'quotes':
      return { name: 'quotes' }
    case 'checkout':
      return second ? { name: 'checkout', providerId: second } : { name: 'quotes' }
    case 'projects':
      return second ? { name: 'project', id: decodeURIComponent(second) } : { name: 'projects' }
    case 'help':
      return { name: 'help' }
    default:
      return { name: 'notFound' }
  }
}

export function href(route: AppRoute): string {
  switch (route.name) {
    case 'home':
      return '#/'
    case 'explore':
      return '#/explore'
    case 'provider':
      return `#/providers/${route.id}`
    case 'brief':
      return '#/brief'
    case 'quotes':
      return '#/quotes'
    case 'checkout':
      return `#/checkout/${route.providerId}`
    case 'projects':
      return '#/projects'
    case 'project':
      return `#/projects/${encodeURIComponent(route.id)}`
    case 'help':
      return '#/help'
  }
}

export function navigate(route: AppRoute): void {
  const target = href(route)
  if (window.location.hash === target) window.scrollTo(0, 0)
  else window.location.hash = target
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export function sectionOf(route: Route): Section {
  switch (route.name) {
    case 'explore':
    case 'provider':
    case 'brief':
      return 'explore'
    case 'quotes':
    case 'checkout':
    case 'projects':
    case 'project':
      return 'projects'
    case 'help':
      return 'help'
    default:
      return 'home'
  }
}
