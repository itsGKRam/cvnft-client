import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const globalStore = (set) => ({
  loading: false,
  setLoading: (loading) => set((state) => ({ ...state, loading: loading })),
  user: null,
  setUser: (user) => set((state) => ({ ...state, user: user })),
  token: null,
  setToken: (token) => set((state) => ({ ...state, token: token })),
  isAuthenticated: () => !!globalStore.getState().user,
});

const useGlobalStore = create(
  devtools(
    persist(globalStore, {
      name: "globalStore",
    })
  )
);

export default useGlobalStore;
