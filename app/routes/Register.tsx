import { Activity, type FC } from 'react'
import { data, Form, redirect } from 'react-router'
import Button from '~/components/Button'
import CsrfInput from '~/components/CsrfInput'
import Input from '~/components/Input'
import NavLink from '~/components/NavLink'
import { extractStringFromBody } from '~/helpers/extractFromBody'
import { commitSession, getSession } from '~/logic/session'
import { createNewUser, userAlreadyExists, validateToken } from '~/logic/user'
import {
  csrfSessionKey,
  getCsrfToken,
  validateCsrfRequest,
} from '~/security/csrf.server'
import type { Route } from './+types/Register'

export const meta: Route.MetaFunction = () => [
  { title: 'Concert Diary | Register' },
]

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await getSession(request.headers.get('Cookie'))
  const csrfToken = getCsrfToken()
  session.set(csrfSessionKey, csrfToken)

  return data(
    { csrfToken },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  )
}

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getSession(request.headers.get('Cookie'))
  const body = await validateCsrfRequest(request, session.get(csrfSessionKey))
  const username = extractStringFromBody(body)('username')
  const password = extractStringFromBody(body)('password')
  const token = extractStringFromBody(body)('token')

  if (validateToken(token)) {
    return data('Incorrect token', { status: 401 })
  }

  if (await userAlreadyExists(username)) {
    return data('Username already exists', { status: 409 })
  }

  await createNewUser(username, password)

  return redirect('/login')
}

const Register: FC<Route.ComponentProps> = ({ actionData, loaderData }) => (
  <main className="container mx-auto p-6">
    <h1 className="text-4xl font-bold my-6">Concert Diary</h1>
    <Form method="post">
      <CsrfInput token={loaderData.csrfToken} />
      <h2 className="text-2xl font-bold">Register</h2>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Username</span>
        <Input type="text" name="username" minLength={2} required />
      </label>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Password</span>
        <Input type="password" name="password" minLength={6} required />
      </label>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Register token</span>
        <Input type="password" name="token" required />
      </label>
      <Activity mode={actionData !== undefined ? 'visible' : 'hidden'}>
        <p className="mt-6 text-red-600" role="alert">
          {actionData}
        </p>
      </Activity>
      <ul className="flex gap-2 mt-6">
        <li>
          <Button type="submit">Register</Button>
        </li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      </ul>
    </Form>
  </main>
)

export default Register
