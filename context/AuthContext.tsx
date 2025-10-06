import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  handleLogin: (email: string, password: string) => Promise<boolean>;
  message: string;
  messageType: "success" | "error" | "";
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthGuard = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  return { user, loading };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(true);

  // Load token & user from backend on app start
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");

        if (storedToken) {
          // Validate token by fetching the authenticated user
          const response = await fetch(
            `${Constants.expoConfig?.extra?.LARAVEL_API_URL}/user`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setToken(storedToken);
          } else {
            // Token invalid → remove it
            await AsyncStorage.removeItem("authToken");
            setUser(null);
            setToken(null);
          }
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    AsyncStorage.setItem("authToken", authToken);
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${Constants.expoConfig?.extra?.LARAVEL_API_URL}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem("authToken");
      setMessage("✅ Logout successful");
      setMessageType("success");
    }
  };

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${Constants.expoConfig?.extra?.LARAVEL_API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.user && data.token) {
        login(data.user, data.token);
        setMessage("✅ Login successful");
        setMessageType("success");
        return true;
      } else {
        setMessage(data.message || "❌ Login failed. Invalid credentials.");
        setMessageType("error");
        return false;
      }
    } catch (error: any) {
      setMessage(error.message || "🚨 Network error. Unable to connect.");
      setMessageType("error");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        handleLogin,
        message,
        messageType,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
