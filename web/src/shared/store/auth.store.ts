import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean

  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  setToken: (token: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        set({
          token,
          user,
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        })
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (!currentUser) throw new Error('No current user')
        set({
          user: { ...currentUser, ...userData },
        })
      },

      setToken: (token: string) => {
        set({ token })
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
