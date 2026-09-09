import { mkdirSync } from 'node:fs'
import { beforeAll, describe, expect, it, vi } from 'vitest'

type Action = (request: Request) => Promise<unknown>

type ActionCase = {
  action: Action
  method: 'POST' | 'PUT' | 'DELETE'
  name: string
  path: string
}

const expectForbidden = async (actionCase: ActionCase) => {
  const request = new Request(
    `https://concert-diary.example${actionCase.path}`,
    {
      method: actionCase.method,
      body: new URLSearchParams(),
    },
  )

  try {
    await actionCase.action(request)
    throw new Error('Expected a 403 response')
  } catch (error) {
    expect(error).toBeInstanceOf(Response)

    if (error instanceof Response) {
      expect(error.status).toBe(403)
    }
  }
}

describe('state-changing route actions', () => {
  let actionCases: ActionCase[]

  beforeAll(async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('APP_ORIGIN', 'https://concert-diary.example')
    vi.stubEnv('SESSION_COOKIE_SECRET', 'test-session-cookie-secret')
    mkdirSync('data', { recursive: true })

    const [
      login,
      register,
      logout,
      newConcert,
      editConcert,
      newFestival,
      editFestival,
    ] = await Promise.all([
      import('~/routes/Login'),
      import('~/routes/Register'),
      import('~/routes/Logout'),
      import('~/routes/NewConcert'),
      import('~/routes/EditConcert'),
      import('~/routes/NewFestival'),
      import('~/routes/EditFestival'),
    ])

    actionCases = [
      {
        name: 'login',
        action: (request) =>
          login.action({
            request,
            params: {},
            context: {},
            unstable_pattern: '/login',
          }),
        method: 'POST',
        path: '/login',
      },
      {
        name: 'registration',
        action: (request) =>
          register.action({
            request,
            params: {},
            context: {},
            unstable_pattern: '/register',
          }),
        method: 'POST',
        path: '/register',
      },
      {
        name: 'logout',
        action: (request) =>
          logout.action({
            request,
            params: {},
            context: {},
            unstable_pattern: '/logout',
          }),
        method: 'POST',
        path: '/logout',
      },
      {
        name: 'concert creation',
        action: (request) =>
          newConcert.action({
            request,
            params: {},
            context: {},
            unstable_pattern: '/concerts/new',
          }),
        method: 'POST',
        path: '/concerts/new',
      },
      {
        name: 'concert update',
        action: (request) =>
          editConcert.action({
            request,
            params: { id: 'concert-id' },
            context: {},
            unstable_pattern: '/concerts/:id',
          }),
        method: 'PUT',
        path: '/concerts/concert-id',
      },
      {
        name: 'concert deletion',
        action: (request) =>
          editConcert.action({
            request,
            params: { id: 'concert-id' },
            context: {},
            unstable_pattern: '/concerts/:id',
          }),
        method: 'DELETE',
        path: '/concerts/concert-id',
      },
      {
        name: 'festival creation',
        action: (request) =>
          newFestival.action({
            request,
            params: {},
            context: {},
            unstable_pattern: '/festivals/new',
          }),
        method: 'POST',
        path: '/festivals/new',
      },
      {
        name: 'festival update',
        action: (request) =>
          editFestival.action({
            request,
            params: { id: 'festival-id' },
            context: {},
            unstable_pattern: '/festivals/:id',
          }),
        method: 'PUT',
        path: '/festivals/festival-id',
      },
      {
        name: 'festival deletion',
        action: (request) =>
          editFestival.action({
            request,
            params: { id: 'festival-id' },
            context: {},
            unstable_pattern: '/festivals/:id',
          }),
        method: 'DELETE',
        path: '/festivals/festival-id',
      },
    ]
  })

  it('covers every mutation action', () => {
    expect(actionCases.map(({ name }) => name)).toEqual([
      'login',
      'registration',
      'logout',
      'concert creation',
      'concert update',
      'concert deletion',
      'festival creation',
      'festival update',
      'festival deletion',
    ])
  })

  it('rejects forged requests before performing a mutation', async () => {
    for (const actionCase of actionCases) {
      await expectForbidden(actionCase)
    }
  })
})
