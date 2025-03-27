import type { RouteConfig } from '@react-router/dev/routes'
import { index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  index('./routes/home.tsx'),
  route('us', './routes/us.tsx'),
  layout('./routes/layout.tsx', [
    route('user', './routes/user.tsx'),
  ]),
] satisfies RouteConfig
