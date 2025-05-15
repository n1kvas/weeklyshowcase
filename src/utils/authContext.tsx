import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  doc,
  getDoc,
  setDoc,
} from "./firebase";
import { User } from "firebase/auth";
import { Firestore } from "firebase/firestore";
import { Auth } from "firebase/auth";

// Define user roles
export type UserRole = "teacher" | "student";

// Define user data structure
export interface UserData {
  uid: string;
  email: string | null;
  role: UserRole;
  name?: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    role: UserRole,
    name: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Create a safe version of useEffect that only runs on the client
const useClientEffect = typeof window !== "undefined" ? useEffect : () => {};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use our safe effect hook to avoid SSR hydration issues
  useClientEffect(() => {
    // Only run auth state monitoring on the client side
    if (typeof window === "undefined" || !auth) {
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(true);

      if (user && db) {
        try {
          // Get user data from Firestore
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserData(userSnap.data() as UserData);
          } else {
            console.error("No user data found in Firestore");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) return;

    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    role: UserRole,
    name: string
  ) => {
    if (!auth || !db) return;

    try {
      setError(null);
      setLoading(true);

      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create a user document in Firestore
      const userData: UserData = {
        uid: user.uid,
        email: user.email,
        role,
        name,
        displayName: name,
      };

      await setDoc(doc(db, "users", user.uid), userData);
      setUserData(userData);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!auth) return;

    try {
      setError(null);
      await signOut(auth);
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(err.message || "Failed to logout");
    }
  };

  const value = {
    user,
    userData,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
