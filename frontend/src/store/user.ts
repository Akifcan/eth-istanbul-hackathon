import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProps } from '../types/user'

type Store = {
  user?: UserProps
  setUser: (user?: UserProps) => void
  logout: () => void
}

const useUserStore = create<Store>()(
  persist(
    (set) => ({
      user: undefined,
      setUser: (user?: UserProps) => set(() => ({ user })),
      logout: () => set(() => ({ user: undefined }))
    }),
    {
      name: 'ally-buy-user'
    }
  )
)

export default useUserStore