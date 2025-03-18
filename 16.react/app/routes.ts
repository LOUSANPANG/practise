import type { RouteConfig } from '@react-router/dev/routes'
import { index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  index('./routes/home.tsx'),
] satisfies RouteConfig
