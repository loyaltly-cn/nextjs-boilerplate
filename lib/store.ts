type User = {
  id: string
  email: string
  name: string | null
  isAdmin: boolean
}

export const setUserInfo = (user: User) => {
  console.log('Saving user info:', user)
  localStorage.setItem('user', JSON.stringify(user))
}

export const getUserInfo = (): User | null => {
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  console.log('Getting user info:', user)
  return user
}

export const clearUserInfo = () => {
  console.log('Clearing user info')
  localStorage.removeItem('user')
} 