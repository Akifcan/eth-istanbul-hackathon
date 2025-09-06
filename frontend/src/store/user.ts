import { create } from 'zustand'
import { UserProps } from '../types/user'

type Store = {
  user?: UserProps
  setUser: (user?: UserProps) => void
  logout: () => void
}

const useUserStore = create<Store>()((set) => ({
  user: undefined,
  setUser: (user?: UserProps) => set(() => ({ user })),
  logout: () => set(() => ({ user: undefined }))
}))

export default useUserStore