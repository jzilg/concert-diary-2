import type { FC } from 'react'
import { data, Form, redirect } from 'react-router'
import Button from '~/components/Button'
import Input from '~/components/Input'
import NavLink from '~/components/NavLink'
import type { LoginDto } from '~/entities/LoginDto'
import { extractStringFromBody } from '~/helpers/extractFromBody'
import renderIf from '~/helpers/renderIf'
import { commitSession, getSession } from '~/logic/session'
import { authenticateUser } from '~/logic/user'
import type { Route } from './+types/Login'

export const meta: Route.MetaFunction = () => [
  { title: 'Concert Diary | Login' },
]

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getSession(request.headers.get('Cookie'))
  const body = await request.formData()
  const loginDto: LoginDto = {
    username: extractStringFromBody(body)('username'),
    password: extractStringFromBody(body)('password'),
  }

  const [userIsAuthenticated, user] = await authenticateUser(
    loginDto.username,
    loginDto.password,
  )

  if (!userIsAuthenticated) {
    session.flash('error', 'Invalid username/password')

    return data(
      {
        error: 'Wrong username or password',
      },
      {
        status: 401,
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      },
    )
  }

  session.set('userId', user?.id)

  return redirect('/concerts', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

const Login: FC<Route.ComponentProps> = ({ actionData }) => {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-4xl font-bold my-6">Concert Diary</h1>
      <Form method="post">
        <h2 className="text-2xl font-bold">Login</h2>
        <label className="block mt-3">
          <span className="block mb-2 font-bold">Username</span>
          <Input type="text" name="username" minLength={2} required />
        </label>
        <label className="block mt-3">
          <span className="block mb-2 font-bold">Password</span>
          <Input type="password" name="password" minLength={6} required />
        </label>
        {renderIf(
          <p className="mt-6 text-red-600" role="alert">
            {actionData?.error}
          </p>,
          actionData?.error !== undefined,
        )}
        <ul className="flex gap-2 mt-6">
          <li>
            <Button type="submit">Login</Button>
          </li>
          <li>
            <NavLink to="/register">Register</NavLink>
          </li>
        </ul>
      </Form>
    </main>
  )
}

export default Login
