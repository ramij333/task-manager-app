

"use client"

import { useState, useEffect } from "react";
import { Menu, Users, Settings, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import TaskSearchBar from "./TaskSearchBar";

interface NavbarProps {
  logo?: {
     url: string;
    // src: string;
    // alt: string;
    title: string;
  };
  auth?: {
    login: {
      title: string;
      url: string;
    };
    register: {
      title: string;
      url: string;
    };
    logout: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
     url: "/",
    // src: "https://www.yourwebsite.com/logo.svg",
    // alt: "Logo",
    title: "TaskManager",
  },
  auth = {
    login: { title: "Login", url: "/login" },
    register: { title: "Register", url: "/register" },
    logout: { title: "Logout", url: "/login" },
  },
}: NavbarProps) => {

const { isLoggedIn, logout } = useAuth();
// console.log(isLoggedIn)
  const handleLogout = () => {
    logout();
  };

 
 // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  
//   useEffect(() => {
//     // Simulate a check from a global state or authentication context
//     const user = localStorage.getItem("user"); // Example check
//     if (user) {
//       setIsLoggedIn(true);
//     } else {
//       setIsLoggedIn(false);
//     }
//   }, []);

//   useEffect(() => {
//   const checkLogin = () => {
//     const user = localStorage.getItem("user");
//     setIsLoggedIn(!!user);
//   };

//   checkLogin(); // Check once on mount

//   // Add a listener for storage change (in case login/logout occurs in another tab)
//   window.addEventListener("storage", checkLogin);

//   return () => {
//     window.removeEventListener("storage", checkLogin);
//   };
// }, []);



//   const handleLogout = () => {
//     localStorage.removeItem("user"); // Clear user data on log out
//     setIsLoggedIn(false);
//   };

  return (
    <section className="p-4 rounded-b-xl backdrop-blur-md bg-white/10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-lg">
        <div className="flex justify-center items-center flex-row w-full ">
      <div className="container flex justify-evenly items-center">
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-4">
          <a href={logo.url} className="flex items-center gap-2">
            {/* <img src={logo.src} className="max-h-8" alt={logo.alt} /> */}
            <span className="text-xl font-semibold tracking-tighter">{logo.title}</span>
          </a>
        </div>

        {/* Middle: Create Task, Dashboard, and Search (Desktop) */}
        <div className="hidden  lg:flex items-center gap-10 mx-auto">
          
          <a
            href="/dashboard"
            className="text-md sm:text-lg font-medium text-gray-700 hover:text-blue-600"
          >
            Dashboard
          </a>
          <a
            href="/users"
            className="text-md sm:text-lg font-medium text-gray-700 hover:text-blue-600"
          >
            All Users
          </a>
          {/* <div className="relative">

            
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 bg-white/30"
            />
            <span className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              🔍
            </span>
          </div> */}
        </div>

        {/* Right: Conditional Buttons (Login, Sign Up, Logout) */}
        <div className="hidden lg:flex gap-4">
          {isLoggedIn ? (
            <Button asChild  size="sm" onClick={handleLogout}>
              <a href={auth.logout.url}>{auth.logout.title}</a>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <a href={auth.login.url}>{auth.login.title}</a>
              </Button>
              <Button asChild size="sm">
                <a href={auth.register.url}>{auth.register.title}</a>
              </Button>
            </>
          )}
        </div>

        
        </div>

        {/* Mobile View (Sheet for Hamburger Menu) */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <a href={logo.url} className="flex items-center gap-2">
                    {/* <img src={logo.src} className="max-h-8" alt={logo.alt} /> */}
                  </a>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 p-4">
                {/* Mobile Menu Items */}
                
                <a
                  href="/dashboard"
                  className="text-md font-medium text-gray-700 hover:text-blue-600"
                >
                  Dashboard
                </a>
                <a
            href="/users"
            className="text-md font-medium text-gray-700 hover:text-blue-600"
          >
            All Users
          </a>
                {/* <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    🔍
                  </span>
                </div> */}
                {/* Login and Signup Links Inside the Sheet (Mobile) */}
                 {isLoggedIn ? (
            <Button asChild  size="sm" onClick={handleLogout}>
              <a href={auth.logout.url}>{auth.logout.title}</a>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <a href={auth.login.url}>{auth.login.title}</a>
              </Button>
              <Button asChild size="sm">
                <a href={auth.register.url}>{auth.register.title}</a>
              </Button>
            </>
          )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
};

export { Navbar };



