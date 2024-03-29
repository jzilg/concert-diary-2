import type { ActionFunction, MetaFunction } from '@remix-run/node'
import type { FC } from 'react'
import type RegisterDto from '~/entities/RegisterDto'
import { Form } from '@remix-run/react'
import Input from '~/components/Input'
import { extractStringFromBody } from '~/helpers/extractFromBody'
import { json, redirect } from '@remix-run/node'
import { createNewUser, userAlreadyExists, validateToken } from '~/logic/user'
import Button from '~/components/Button'
import NavLink from '~/components/NavLink'

export const meta: MetaFunction = () => [
  { title: 'Concert Diary | Register' },
]

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData()
  const registerDto: RegisterDto = {
    username: extractStringFromBody(body)('username'),
    password: extractStringFromBody(body)('password'),
    token: extractStringFromBody(body)('token'),
  }

  if (validateToken(registerDto.token)) {
    return json('Incorrect token', { status: 401 })
  }

  if (await userAlreadyExists(registerDto.username)) {
    return json('Username already exists', { status: 400 })
  }

  await createNewUser(registerDto.username, registerDto.password)

  return redirect('/login')
}

const Register: FC = () => (
  <main className="container mx-auto p-6">
    <h1 className="text-4xl font-bold my-6">Concert Diary</h1>
    <Form method="post">
      <h2 className="text-2xl font-bold">Register</h2>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Username</span>
        <Input
          type="text"
          name="username"
          minLength={2}
          required
        />
      </label>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Password</span>
        <Input
          type="password"
          name="password"
          minLength={6}
          required
        />
      </label>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Register token</span>
        <Input
          type="password"
          name="token"
          required
        />
      </label>
      <ul className="flex gap-2 mt-6">
        <li>
          <Button type="submit">
            Register
          </Button>
        </li>
        <li>
          <NavLink to="/login">
            Login
          </NavLink>
        </li>
      </ul>
    </Form>
  </main>
)

export default Register
