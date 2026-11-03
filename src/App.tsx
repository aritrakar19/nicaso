import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { TabBar } from '@/components/layout/TabBar'
import { Footer } from '@/components/layout/Footer'
import { ScreenMap } from '@/components/dev/ScreenMap'
import { ToastProvider } from '@/components/ui/Toast'
import { sectionOf, useRoute, type Route } from '@/lib/router'
import { AppStoreProvider, useAppStore } from '@/state/AppStore'
import { getProvider } from '@/data/providers'
import { HomePage } from '@/pages/HomePage'
import { ExplorePage } from '@/pages/ExplorePage'
import { ProviderPage } from '@/pages/ProviderPage'
import { BriefPage } from '@/pages/BriefPage'
import { QuotesPage } from '@/pages/QuotesPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { ProjectPage } from '@/pages/project/ProjectPage'
import { HelpPage } from '@/pages/HelpPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case 'home':
      return <HomePage />
    case 'explore':
      return <ExplorePage />
    case 'provider':
      return <ProviderPage key={route.id} id={route.id} />
    case 'brief':
      return <BriefPage />
    case 'quotes':
      return <QuotesPage />
    case 'checkout':
      return <CheckoutPage key={route.providerId} providerId={route.providerId} />
    case 'projects':
      return <ProjectsPage />
    case 'project':
      return <ProjectPage key={route.id} id={route.id} />
    case 'help':
      return <HelpPage />
    case 'notFound':
      return <NotFoundPage />
  }
}

function useDocumentTitle(route: Route) {
  const { state } = useAppStore()
  useEffect(() => {
    const titles: Partial<Record<Route['name'], string>> = {
      explore: 'Find photographers',
      brief: 'Post a brief',
      quotes: 'Compare quotes',
      checkout: 'Scope and booking',
      projects: 'My projects',
      help: 'Help and safety',
      notFound: 'Page not found',
    }
    let title = titles[route.name]
    if (route.name === 'provider') title = getProvider(route.id)?.name
    if (route.name === 'project') title = state.projects[route.id]?.title
    document.title = title ? `${title} · NICASO` : 'NICASO · Hire photographers with milestone payments'
  }, [route, state.projects])
}

function Shell() {
  const route = useRoute()
  useDocumentTitle(route)
  const section = sectionOf(route)
  return (
    <div className="min-h-screen pb-[76px] lg:pb-0">
      <Header section={section} />
      <main>
        <Page route={route} />
      </main>
      <Footer />
      <TabBar section={section} />
      {import.meta.env.DEV && <ScreenMap route={route} />}
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppStoreProvider>
        <Shell />
      </AppStoreProvider>
    </ToastProvider>
  )
}
