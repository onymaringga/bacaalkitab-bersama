const REMEMBER_KEY = "bab-login-remember";
const REMEMBER_USER_KEY = "bab-login-remember-username";

export function readRememberMe(): { enabled: boolean; username: string } {
  if (typeof window === "undefined") {
    return { enabled: false, username: "" };
  }
  try {
    const enabled = window.localStorage.getItem(REMEMBER_KEY) === "1";
    const username = enabled
      ? (window.localStorage.getItem(REMEMBER_USER_KEY) ?? "")
      : "";
    return { enabled, username };
  } catch {
    return { enabled: false, username: "" };
  }
}

export function writeRememberMe(enabled: boolean, username: string) {
  if (typeof window === "undefined") return;
  try {
    if (enabled) {
      window.localStorage.setItem(REMEMBER_KEY, "1");
      window.localStorage.setItem(REMEMBER_USER_KEY, username.trim());
    } else {
      window.localStorage.removeItem(REMEMBER_KEY);
      window.localStorage.removeItem(REMEMBER_USER_KEY);
    }
  } catch {
    /* ignore */
  }
}
