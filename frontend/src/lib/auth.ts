const KEY = "pa_token";

export const tokenStore = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(KEY);
  },
  set(token: string) {
    localStorage.setItem(KEY, token);
  },
  clear() {
    localStorage.removeItem(KEY);
  },
};
