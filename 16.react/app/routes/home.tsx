import type { Route } from './+types/home'
import { Form } from 'react-router'

export const handle = {
  auth: true,
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  // params 代表路由参数
  await new Promise(resolve => setTimeout(resolve, 2000))
  return {
    params,
    code: '200',
    data: 'clientLoader',
  }
}

// 使用Form 和 button 触发该函数
export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData()
  const title = formData.get('title')
  return {
    title,
    formData,
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

      <Form method="post" style={{ border: '1px solid blur' }}>
        <input type="text" name="title" style={{ border: '1px solid red' }} />
        <button type="submit" style={{ border: '1px solid green' }}>Submit</button>
      </Form>
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
