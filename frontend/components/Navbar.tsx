// import { Menu, Users,  Settings, LogOut, ClipboardList } from "lucide-react";

// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Button } from "@/components/ui/button";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";

// interface MenuItem {
//   title: string;
//   url: string;
//   description?: string;
//   icon?: React.ReactNode;
//   items?: MenuItem[];
// }

// interface NavbarProps {
//   logo?: {
//     url: string;
//     src: string;
//     alt: string;
//     title: string;
//   };
//   menu?: MenuItem[];
//   auth?: {
//     login: {
//       title: string;
//       url: string;
//     };
//     signup: {
//       title: string;
//       url: string;
//     };
//   };
// }

// const Navbar = ({
//   logo = {
//     url: "https://www.yourwebsite.com",
//     src: "https://www.yourwebsite.com/logo.svg",
//     alt: "Logo",
//     title: "TaskManager",
//   },
//   menu = [
//     { title: "Dashboard", url: "/dashboard", icon: <ClipboardList className="size-5" /> }, 
//     {
//       title: "Tasks",
//       url: "/tasks",
//       icon: <ClipboardList className="size-5" />,
//     },
//     {
//       title: "Team",
//       url: "/team",
//       icon: <Users className="size-5" />,
//     },
//     {
//       title: "Profile",
//       url: "/profile",
//       icon: <Settings className="size-5" />,
//     },
//   ],
//   auth = {
//     login: { title: "Login", url: "/login" },
//     signup: { title: "Sign Up", url: "/signup" },
//   },
// }: NavbarProps) => {
//   return (
//     <section className="py-4">
//       <div className="container">
//         {/* Desktop Menu */}
//         <nav className="hidden justify-between lg:flex">
//           <div className="flex items-center gap-6">
//             {/* Logo */}
//             <a href={logo.url} className="flex items-center gap-2">
//               <img src={logo.src} className="max-h-8" alt={logo.alt} />
//               <span className="text-lg font-semibold tracking-tighter">
//                 {logo.title}
//               </span>
//             </a>
//             <div className="flex items-center">
//               <NavigationMenu>
//                 <NavigationMenuList>
//                   {menu.map((item) => renderMenuItem(item))}
//                 </NavigationMenuList>
//               </NavigationMenu>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <Button asChild variant="outline" size="sm">
//               <a href={auth.login.url}>{auth.login.title}</a>
//             </Button>
//             <Button asChild size="sm">
//               <a href={auth.signup.url}>{auth.signup.title}</a>
//             </Button>
//           </div>
//         </nav>

//         {/* Mobile Menu */}
//         <div className="block lg:hidden">
//           <div className="flex items-center justify-between">
//             {/* Logo */}
//             <a href={logo.url} className="flex items-center gap-2">
//               <img src={logo.src} className="max-h-8" alt={logo.alt} />
//             </a>
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button variant="outline" size="icon">
//                   <Menu className="size-4" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent className="overflow-y-auto">
//                 <SheetHeader>
//                   <SheetTitle>
//                     <a href={logo.url} className="flex items-center gap-2">
//                       <img src={logo.src} className="max-h-8" alt={logo.alt} />
//                     </a>
//                   </SheetTitle>
//                 </SheetHeader>
//                 <div className="flex flex-col gap-6 p-4">
//                   <Accordion
//                     type="single"
//                     collapsible
//                     className="flex w-full flex-col gap-4"
//                   >
//                     {menu.map((item) => renderMobileMenuItem(item))}
//                   </Accordion>

//                   <div className="flex flex-col gap-3">
//                     <Button asChild variant="outline">
//                       <a href={auth.login.url}>{auth.login.title}</a>
//                     </Button>
//                     <Button asChild>
//                       <a href={auth.signup.url}>{auth.signup.title}</a>
//                     </Button>
//                   </div>
//                 </div>
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// const renderMenuItem = (item: MenuItem) => {
//   if (item.items) {
//     return (
//       <NavigationMenuItem key={item.title}>
//         <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
//         <NavigationMenuContent className="bg-popover text-popover-foreground">
//           {item.items.map((subItem) => (
//             <NavigationMenuLink asChild key={subItem.title} className="w-80">
//               <SubMenuLink item={subItem} />
//             </NavigationMenuLink>
//           ))}
//         </NavigationMenuContent>
//       </NavigationMenuItem>
//     );
//   }

//   return (
//     <NavigationMenuItem key={item.title}>
//       <NavigationMenuLink
//         href={item.url}
//         className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
//       >
//         {item.icon && <span className="mr-2">{item.icon}</span>}
//         {item.title}
//       </NavigationMenuLink>
//     </NavigationMenuItem>
//   );
// };

// const renderMobileMenuItem = (item: MenuItem) => {
//   if (item.items) {
//     return (
//       <AccordionItem key={item.title} value={item.title} className="border-b-0">
//         <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
//           {item.title}
//         </AccordionTrigger>
//         <AccordionContent className="mt-2">
//           {item.items.map((subItem) => (
//             <SubMenuLink key={subItem.title} item={subItem} />
//           ))}
//         </AccordionContent>
//       </AccordionItem>
//     );
//   }

//   return (
//     <a key={item.title} href={item.url} className="text-md font-semibold">
//       {item.title}
//     </a>
//   );
// };

// const SubMenuLink = ({ item }: { item: MenuItem }) => {
//   return (
//     <a
//       className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
//       href={item.url}
//     >
//       <div className="text-foreground">{item.icon}</div>
//       <div>
//         <div className="text-sm font-semibold">{item.title}</div>
//         {item.description && (
//           <p className="text-sm leading-snug text-muted-foreground">
//             {item.description}
//           </p>
//         )}
//       </div>
//     </a>
//   );
// };

// export {Navbar};




"use client"

import { useState, useEffect } from "react";
import { Menu, Users, Settings, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";  // Assuming you have a custom Input component for the search
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
    signup: {
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
    signup: { title: "Sign Up", url: "/signup" },
    logout: { title: "Logout", url: "/logout" },
  },
}: NavbarProps) => {
  // Step 1: Track the authentication status
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Step 2: Simulate checking authentication status (you can replace this with actual auth logic)
  useEffect(() => {
    // Simulate a check from a global state or authentication context
    const user = localStorage.getItem("user"); // Example check
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Step 3: Handle log out
  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data on log out
    setIsLoggedIn(false);
  };

  return (
    <section className="p-4 rounded-xl backdrop-blur-md bg-white/10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-lg">
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
            href="/create-task"
            className="text-md sm:text-lg font-medium text-gray-700 hover:text-blue-600"
          >
            Create Task
          </a>
          <a
            href="/dashboard"
            className="text-md sm:text-lg font-medium text-gray-700 hover:text-blue-600"
          >
            Dashboard
          </a>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 bg-white/30"
            />
            <span className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              🔍
            </span>
          </div>
        </div>

        {/* Right: Conditional Buttons (Login, Sign Up, Logout) */}
        <div className="hidden lg:flex gap-4">
          {isLoggedIn ? (
            <Button asChild variant="outline" size="sm" onClick={handleLogout}>
              <a href={auth.logout.url}>{auth.logout.title}</a>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <a href={auth.login.url}>{auth.login.title}</a>
              </Button>
              <Button asChild size="sm">
                <a href={auth.signup.url}>{auth.signup.title}</a>
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
                  href="/create-task"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Create Task
                </a>
                <a
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Dashboard
                </a>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    🔍
                  </span>
                </div>
                {/* Login and Signup Links Inside the Sheet (Mobile) */}
                {isLoggedIn ? (
                  <a
                    href={auth.logout.url}
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                    onClick={handleLogout}
                  >
                    {auth.logout.title}
                  </a>
                ) : (
                  <>
                    <a
                      href={auth.login.url}
                      className="text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      {auth.login.title}
                    </a>
                    <a
                      href={auth.signup.url}
                      className="text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      {auth.signup.title}
                    </a>
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



