import { index, type RouteConfig, route } from '@react-router/dev/routes'

export default [
  index('routes/_index.tsx'),
  route('login', 'routes/login.tsx'),
  route('logout', 'routes/logout.tsx'),
  route('register', 'routes/register.tsx'),
  route('statistics', 'routes/statistics.tsx'),
  route('concerts', 'routes/concerts.tsx', [
    index('routes/concerts._index.tsx'),
    route('new', 'routes/concerts.new.tsx'),
    route(':id', 'routes/concerts.$id.tsx'),
  ]),
  route('festivals', 'routes/festivals.tsx', [
    index('routes/festivals._index.tsx'),
    route('new', 'routes/festivals.new.tsx'),
    route(':id', 'routes/festivals.$id.tsx'),
  ]),
] satisfies RouteConfig
