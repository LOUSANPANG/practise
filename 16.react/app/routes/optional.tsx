import type { Route } from './+types/optional'

export default function Optional({ params }: Route.LoaderArgs) {
  return (
    <>
      <h1>Optional</h1>
      {/* { lang: 123 } */}
      <h1>{JSON.stringify(params)}</h1>
    </>
  )
}
