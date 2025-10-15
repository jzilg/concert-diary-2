import { index, type RouteConfig, route } from '@react-router/dev/routes'

export default [
  index('routes/Index.tsx'),
  route('login', 'routes/Login.tsx'),
  route('logout', 'routes/Logout.tsx'),
  route('register', 'routes/Register.tsx'),
  route('statistics', 'routes/Statistics.tsx'),
  route('concerts', 'routes/Concerts.tsx', [
    index('routes/ConcertsView.tsx'),
    route('new', 'routes/NewConcert.tsx'),
    route(':id', 'routes/EditConcert.tsx'),
  ]),
  route('festivals', 'routes/Festivals.tsx', [
    index('routes/FestivalsView.tsx'),
    route('new', 'routes/NewFestival.tsx'),
    route(':id', 'routes/EditFestival.tsx'),
  ]),
] satisfies RouteConfig
