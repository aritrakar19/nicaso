import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Layout'
import { href } from '@/lib/router'

export function NotFoundPage() {
  return (
    <Container className="max-w-[640px] pb-[100px] pt-20 text-center">
      <p className="font-mono text-sm text-brand">404</p>
      <h1 className="mt-2 text-3xl">We could not find that page</h1>
      <p className="mt-3 text-ink-2">The link may be old, or the project may belong to another account.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <ButtonLink href={href({ name: 'home' })}>Go home</ButtonLink>
        <ButtonLink href={href({ name: 'projects' })} variant="secondary">
          My projects
        </ButtonLink>
      </div>
    </Container>
  )
}
