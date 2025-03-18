import type { Route } from './+types/route-name'
import { } from 'react-router'

export async function clientLoader() {
  return {
    code: '200',
    data: 'clientLoader',
  }
}

export async function clientAction() {
  return {
    code: '200',
    data: 'clientAction',
  }
}

export default function Home({ loaderData, actionData, params, matches }: Route.ComponentProps) {
  return (
    <>

      <p>
        Loader Data:
        {JSON.stringify(loaderData)}
      </p>
      <p>
        Action Data:
        {JSON.stringify(actionData)}
      </p>
      <p>
        Route Parameters:
        {JSON.stringify(params)}
      </p>
      <p>
        Matched Routes:
        {JSON.stringify(matches)}
      </p>
    </>
  )
}
