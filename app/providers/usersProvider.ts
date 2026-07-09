// biome-ignore-all lint/complexity/useLiteralKeys: biome conflicts with TypeScript rule
import { db } from '~/db'
import { createUser, type User } from '~/entities/User'

const usersProvider = {
  getUserByField(field: 'id' | 'username', value: string = '') {
    const querySingle = db.prepare(`SELECT * FROM users WHERE ${field} = ?`)
    const data = querySingle.get(value)

    if (data === undefined) {
      return undefined
    }

    return createUser({
      id: data['id'],
      username: data['username'],
      password: data['password'],
    })
  },

  addNewUser(user: User) {
    const insertUser = db.prepare(
      'INSERT INTO users (id, username, password) VALUES (?, ?, ?)',
    )

    insertUser.run(user.id, user.username, user.password)
  },
}

export default usersProvider
