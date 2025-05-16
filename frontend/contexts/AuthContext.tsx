
"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  user: any;
  isLoggedIn: boolean;
  loading: boolean;
  login: (userData: any) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // This runs only on client
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
    }
    
    setLoading(false);
    setIsMounted(true);
  }, []);

  const login = (userData: any) => {
   
  const parsedUser = typeof userData === "string" ? JSON.parse(userData) : userData;
  if (typeof window !== "undefined") {localStorage.setItem("user", JSON.stringify(parsedUser));}
  
  setUser(parsedUser);
 
};

  const logout = async () => {
    // Optionally notify backend
    // try {
    //   await API.post("/auth/logout");
    // } catch {}
    if (typeof window !== "undefined") {localStorage.removeItem("user");}
    
    setUser(null);
    router.push("/");
    toast.success("Logout successful");
  };

  // Prevent hydration errors
  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        login,
        logout,
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








// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import API from "@/services/api"; 
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// interface AuthContextType {
//   user: any;
//   isLoggedIn: boolean;
//   loading: boolean;
//   login: (userData: any) => void;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

  
//   // useEffect(() => {
//   //   const storedUser = localStorage.getItem("user");
//   //   if (storedUser) {
//   //     setUser(JSON.parse(storedUser));
//   //   } else {
//   //     setUser(null);
//   //   }
//   //   setLoading(false);
//   // }, []);

 
//   const login = (userData: any) => {
//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);
//   };

 
//   const logout = async () => {
//     // try {
//     //   await API.post("/auth/logout"); // Optional if you have a logout API
//     // } catch {
//     //   // handle server errors silently
//     // }
//     localStorage.removeItem("user");
//     setUser(null);
    
//     router.push("/");
//     toast.success('Logout successfull')
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoggedIn: !!user,
//         loading,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };







// "use client";

// import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// interface AuthContextType {
//   isLoggedIn: boolean;
//   login: (userData: string) => void;
//   logout: () => void;
//   loading: boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     setIsLoggedIn(!!user);
//     setLoading(false)
//   }, []);

//   const login = (userData: string) => {
//     localStorage.setItem("user", userData);
//     setIsLoggedIn(true);
//   };

//   const logout = () => {
//     localStorage.removeItem("user");
//     setIsLoggedIn(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };
