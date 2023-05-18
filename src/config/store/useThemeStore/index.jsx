import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const themeStore = (set) => ({
  theme: "dark",
  setTheme: (theme) => set((state) => ({ ...state, theme: theme })),
});

const useThemeStore = create(
  devtools(
    persist(themeStore, {
      name: "themeStore",
    })
  )
);

export default useThemeStore;
