"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function HomePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleCreateTask = () => {
    if (!token) {
      toast.error("Please login to create tasks");
      router.push("/login");
    } else {
      router.push("/tasks/create");
    }
  };

  return (
    <main className="flex flex-col min-h-screen px-4 py-8 items-center justify-center bg-gradient-to-b from-blue-100 to-white text-center">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
          Welcome to Task Manager
        </h1>
        <p className="text-lg sm:text-xl text-gray-600">
          Organize your tasks, stay productive, and keep everything under control.
        </p>

        <div className="flex flex-col sm:flex-row sm:justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/register")}
            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Register
          </button>
          <button
            onClick={handleCreateTask}
            className="px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
          >
            Create Task
          </button>
        </div>

        <section className="mt-12 text-left bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Create and manage tasks</li>
            <li>Update progress anytime</li>
            <li>Stay organized across devices</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

