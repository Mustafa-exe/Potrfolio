import { createContext, useContext, useState, useCallback } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, hasConfig } from "../firebase";

const AuthContext = createContext(null);

const LOCKOUT_DURATION = 30000; // 30 seconds
const MAX_ATTEMPTS = 5;

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateSessionToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!sessionStorage.getItem("portfolio_session");
  });
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);
  const [loginError, setLoginError] = useState("");

  const login = useCallback(
    async (email, password) => {
      // Check lockout
      const now = Date.now();
      if (lockoutUntil > now) {
        const remaining = Math.ceil((lockoutUntil - now) / 1000);
        setLoginError(
          `Too many attempts. Try again in ${remaining} seconds.`
        );
        return false;
      }

      if (hasConfig && auth) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const token = await userCredential.user.getIdToken();
          sessionStorage.setItem("portfolio_session", token);
          setIsAuthenticated(true);
          setLoginAttempts(0);
          setLoginError("");
          return true;
        } catch (error) {
          console.error("Firebase Auth Error:", error);
          const newAttempts = loginAttempts + 1;
          setLoginAttempts(newAttempts);
          if (newAttempts >= MAX_ATTEMPTS) {
            setLockoutUntil(Date.now() + LOCKOUT_DURATION);
            setLoginAttempts(0);
            setLoginError(
              `Too many failed attempts. Locked out for 30 seconds.`
            );
          } else {
            setLoginError(
              `Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`
            );
          }
          return false;
        }
      } else {
        // Fallback to local password hash comparison
        // Note: in local mode, the first parameter serves as the password
        const localPassword = password || email;
        const hash = await hashPassword(localPassword);
        const expectedHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;

        if (hash === expectedHash) {
          const token = generateSessionToken();
          sessionStorage.setItem("portfolio_session", token);
          setIsAuthenticated(true);
          setLoginAttempts(0);
          setLoginError("");
          return true;
        } else {
          const newAttempts = loginAttempts + 1;
          setLoginAttempts(newAttempts);

          if (newAttempts >= MAX_ATTEMPTS) {
            setLockoutUntil(Date.now() + LOCKOUT_DURATION);
            setLoginAttempts(0);
            setLoginError(
              `Too many failed attempts. Locked out for 30 seconds.`
            );
          } else {
            setLoginError(
              `Invalid password. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`
            );
          }
          return false;
        }
      }
    },
    [loginAttempts, lockoutUntil]
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem("portfolio_session");
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loginError, setLoginError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
