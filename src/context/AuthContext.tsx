import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface UserData {
  uid: string;
  email?: string;
}

interface AuthContextType {
  user: UserData | null;
  isAuthReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthReady: false,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        if (process.env.NODE_ENV === "test") {
          console.log("✅ Mock Firebase activado (test)");
          setUser({ uid: "test-user", email: "user@test.com" });
          setIsAuthReady(true);
          return;
        }

        const { getAuth, onAuthStateChanged } = await import("firebase/auth");
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            setUser({ uid: currentUser.uid, email: currentUser.email ?? "" });
          } else {
            setUser(null);
          }
          setIsAuthReady(true);
        });
        return () => unsubscribe();
      } catch (err) {
        console.error("Error al inicializar Firebase Auth:", err);
        setIsAuthReady(true);
      }
    };
    init();
  }, []);

  const login = async (email: string, _password: string) => {
    setUser({ uid: "test-user", email });
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
