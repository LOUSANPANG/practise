import type { Route } from './+types/route-name'

export const handle = {
  auth: true,
}

export async function clientLoader() {
  await new Promise(resolve => setTimeout(resolve, 2000))
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
      {/* 打印 clientLoader 函数的返回值 */}
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

      {/* 全部信息 */}
      {/* [{"id":"root","pathname":"/","params":{},"data":null},{"id":"routes/home","pathname":"/","params":{},"data":{"code":"200","data":"clientLoader"},"handle":{"auth":true}}] */}
      <p>
        Matched Routes:
        {JSON.stringify(matches)}
      </p>
    </>
  )
}
