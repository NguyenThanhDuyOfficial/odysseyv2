import { User } from '@odyssey/database';
import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';

type AuthActions = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  login: (user: User, accessToken: string) => void;
  logout: () => void;
};
const useAuthStore = create<AuthActions>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),
      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
