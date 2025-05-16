"use client";

//import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();
  // const [token, setToken] = useState<string | null>(null);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //   const storedToken = localStorage.getItem("token");
  //   setToken(storedToken);
  // }
  // }, []);

  // const handleCreateTask = () => {
  //   if (!token) {
  //     toast.error("Please login to create tasks");
  //     router.push("/login");
  //   } else {
  //     router.push("/tasks/create");
  //   }
  // };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 px-4 py-10 flex flex-col items-center">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mb-16">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 leading-tight">
          Boost Your Team&apos;s Productivity
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-600">
          Assign tasks, track progress, and get things done—fast.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg"
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => router.push("/register")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-lg"
            variant="secondary"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Task Assignment</h3>
          <p className="text-gray-600">
            Managers can assign tasks to individuals or teams with just a few clicks.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Live Dashboard</h3>
          <p className="text-gray-600">
            See what’s assigned, what’s overdue, and what’s completed—at a glance.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Recurring Tasks</h3>
          <p className="text-gray-600">
            Set up daily, weekly, or monthly recurring tasks to streamline productivity.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Role-Based Access</h3>
          <p className="text-gray-600">
            Admins, Managers, and Users—each with tailored permissions and access.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Real-Time Collaboration</h3>
          <p className="text-gray-600">
            Instant task updates and socket-powered notifications keep everyone in sync.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Cross-Device Sync</h3>
          <p className="text-gray-600">
            Access and manage your tasks seamlessly on mobile, tablet, or desktop.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} Task Manager App — Stay focused, stay productive.
      </footer>
    </main>
  );
}

