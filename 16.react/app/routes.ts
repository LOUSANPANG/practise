import type { RouteConfig } from '@react-router/dev/routes'
import { index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  index('./routes/home.tsx'),

  route('us', './routes/us.tsx'),

  layout('./routes/layout.tsx', [
    route('user', './routes/layout-user.tsx'),
  ]),

  ...prefix('prefix', [
    index('./routes/prefix/index.tsx'),
    route('a', './routes/prefix/prefix-a.tsx'),
  ]),

  route(':lang?/optional', './routes/optional.tsx'),

  route('/render-component/*', './routes/render-component.tsx'),

  route('/store', './routes/store.tsx'),

  route('/services', './routes/tanstack-query.tsx'),

  route('/shadcn-ui', './routes/shadcn-ui.tsx'),
] satisfies RouteConfig
