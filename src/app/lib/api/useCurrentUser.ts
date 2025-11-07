"use client"
export const useCurrentUser = () => {
  const isBrowser = typeof window !== 'undefined'

  const setUser = (user: any) => {
    if (!isBrowser) return
    try {
      localStorage.setItem('current_user', JSON.stringify(user))
    } catch (e) {
      console.error('Failed to set user', e)
    }
  }

  const getUser = () => {
    if (!isBrowser) return null
    try {
      const raw = localStorage.getItem('current_user')
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      console.error('Failed to parse current_user', e)
      return null
    }
  }

  const removeUser = () => {
    if (!isBrowser) return
    localStorage.removeItem('current_user')
  }

  return { setUser, getUser, removeUser }
}

export default useCurrentUser
