

"use client";

import useSWR from "swr";
import { useState } from "react";
import { Task } from "@/types/task";
import TaskCard from "@/components/TaskCard";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import API from "@/services/api";
import TaskFormCard from "@/components/TaskFormCard";
import Protected from "@/components/Protected";


type TaskFormData = {
  title: string;
  description: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  recurring: boolean;
  recurringType?: "daily" | "weekly" | "monthly";
};

export default function Dashboard() {
  const { user } = useAuth();
 
  const currentUserId = user?.id;
 

  const { data , error, isLoading, mutate } = useSWR<Task[]>("/tasks", (url: string) =>
  API.get(url).then(res => res.data)
);



  const [editId, setEditId] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string>("");
  const [assignId, setAssignId] = useState<string>("")
  const [completeId, setCompleteId] = useState<string>("");
 const [showForm, setShowForm] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load tasks.
      </div>
    );
  }

  const handleEdit = (id: string, updatedData?: Task) => {
    if (id) {
      setEditId(id);
    } else {
      setEditId("");
      mutate();
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setTimeout(() => {
      mutate();
      setDeleteId("");
    }, 800);
  };

  const handleComplete = (id: string) => {
    setCompleteId(id);
    setTimeout(() => {
      mutate();
      setCompleteId("");
    }, 800);
  };

  const handleAssign = (id: string) => {
    setAssignId(id);
    setTimeout(() => {
      mutate();
      setCompleteId("");
    }, 800);
  }

const handleCreateTask = async (data: TaskFormData) => {
    try {
      await API.post("/tasks", {
        ...data,
        status: 'pending',
        creatorId: currentUserId,
      });
      toast.success("Task created");
      mutate();
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

 // Normalize today to midnight
const today = new Date();
today.setHours(0, 0, 0, 0);

// 1. Overdue Tasks
const overdueTasks = data?.filter((task) => {
  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  return (
    dueDate < today &&
    (
      (!task.recurring && task.status !== "completed") ||
      (task.recurring && task.completedThisCycle === false)
    )
  );
});

// 2. Created Tasks (not overdue, not completed)
const createdTasks = data?.filter((task) => {
  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  const isFutureOrToday = dueDate >= today;

  return (
    task.creatorId === currentUserId &&
    task.assigneeId !== currentUserId &&
    isFutureOrToday &&
    (
      (!task.recurring && task.status !== "completed") ||
      (task.recurring && task.completedThisCycle === false)
    )
  );
});



  const assignedTasks = data?.filter(
    (task) =>
      task.assigneeId === currentUserId &&
      task.status !== "completed"
  );
  const completedTasks = data?.filter(
    (task) => ((task.recurring === false && task.status === "completed") || (task.recurring === true  && task.completedThisCycle === true)) &&
      (task.creatorId === currentUserId || task.assigneeId === currentUserId)
  );

  const renderSection = (title: string, tasks?: Task[]) => (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              editId={editId}
              deleteId={deleteId}
              completeId={completeId}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onComplete={handleComplete}
            />
          ))
        ) : (
          <div className="text-sm text-gray-500 col-span-full">No tasks.</div>
        )}
      </div>
    </div>
  );

  return (
    <Protected>
   <div className=" space-y-10 text-center w-full h-full grid grid-cols-1 p-4 md:px-10 pt-20">
      
      {renderSection("Created Tasks", createdTasks)}
      {renderSection("Overdue Tasks", overdueTasks)}
      {renderSection("Assigned Tasks", assignedTasks)}
      {renderSection("Completed Tasks", completedTasks)}

     
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 md:bottom-20 md:right-20 bg-orange-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg z-50"
      >
        <Plus className="w-6 h-6" />
      </button>

      
      {showForm && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
          <TaskFormCard
            onSubmit={handleCreateTask}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div></Protected>
  );
}









// "use client";


// import TaskCard from "@/components/TaskCard";
// import { useState } from "react";


// // Example user context (replace with actual auth context if available)
// const currentUser = {
//   id: "user-123",
//   role: "manager" as "admin" | "manager" | "user",
// };

// // Example mock tasks
// const mockTasks = [
//   {
//     id: "1",
//     title: "Prepare meeting notes",
//     description: "Summarize last week's meeting",
//     dueDate: "2025-05-15",
//     priority: "high" as const,
//     status: "pending" as const,
//     creatorId: "user-123",
//     assigneeId: "user-456",
//   },
//   {
//     id: "2",
//     title: "Design homepage",
//     description: "Create a draft for the homepage redesign",
//     dueDate: "2025-05-18",
//     priority: "medium" as const,
//     status: "completed" as const,
//     creatorId: "user-789",
//     assigneeId: "user-123",
//   },
//   {
//     id: "3",
//     title: "Backend API setup",
//     description: "Set up Express routes and controllers",
//     dueDate: "2025-05-20",
//     priority: "low" as const,
//     status: "pending" as const,
//     creatorId: "user-123",
//     assigneeId: "",
//   },
// ];


// export default function DashboardPage() {
//   const [tasks, setTasks] = useState(mockTasks);

//   const handleUpdate = (id: string) => {
//     alert(`Update task ${id}`);
//   };

//   const handleDelete = (id: string) => {
//     setTasks((prev) => prev.filter((task) => task.id !== id));
//   };

//   const handleAssign = (id: string) => {
//     alert(`Assign task ${id}`);
//   };

// // const handleComplete = (id: string) => {
// //   setTasks((prev) =>
// //     prev.map((task) =>
// //       task.id === id ? { ...task, status: "completed" as Status } : task
// //     )
// //   );
// // };

// const handleComplete = () => {}




//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         {tasks.map((task) => (
//           <TaskCard
//             key={task.id}
//             task={task}
//             currentUserId={currentUser.id}
//             currentUserRole={currentUser.role}
//             onUpdate={handleUpdate}
//             onDelete={handleDelete}
//             onAssign={handleAssign}
//             onComplete={handleComplete}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }


