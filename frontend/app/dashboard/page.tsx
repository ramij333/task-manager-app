

"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { Task } from "@/types/task";
import TaskCard from "@/components/TaskCard";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import API from "@/services/api";
import TaskFormCard from "@/components/TaskFormCard";
import Protected from "@/components/Protected";
import TaskSearchBar from "@/components/TaskSearchBar";
import { useRouter } from "next/navigation"; 


type TaskFormData = {
  title: string;
  description: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  recurring: boolean;
  recurringType?: "daily" | "weekly" | "monthly";
};

export default function Dashboard() {

    const [editId, setEditId] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string>("");
  const [completeId, setCompleteId] = useState<string>("");
 const [showForm, setShowForm] = useState<boolean>(false);
 const [searchQuery, setSearchQuery] = useState<string>("");
const [filters, setFilters] = useState<any>(null); 
  const router = useRouter();
  const { user } = useAuth();
 
  const currentUserId = user?.id;

  const getKey = () => {
  const params = new URLSearchParams();

  if (searchQuery) params.append("search", searchQuery);
  if (filters?.priority) params.append("priority", filters.priority);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.dueDate) params.append("dueDate", filters.dueDate); 

  return `/tasks?${params.toString()}`;
};

const { data, error, isLoading, mutate } = useSWR<Task[]>(getKey(), (url: string) =>
  API.get(url).then((res) => res.data)
);

 useEffect(() => {
    if (!user) {
      router.push("/login"); 
    }
  }, [user, router]);

useEffect(() => {
  if (showForm) {
    
    document.body.style.overflow = "hidden";
  } else {
    
    document.body.style.overflow = "";
  }
  return () => {
    document.body.style.overflow = "";
  };
}, [showForm]);


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

  const handleEdit = (id: string) => {
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



const handleSearch = (query: string, filters: any) => {
  setSearchQuery(query);
  setFilters(filters);
};

const handleClearSearch = () => {
  setSearchQuery("");
  setFilters(null);
};





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
      console.log(error)
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
      <div className="flex justify-center items-center w-full mx-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full ">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="self-start">
            <TaskCard
              key={task.id}
              task={task}
              editId={editId}
              deleteId={deleteId}
              completeId={completeId}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onComplete={handleComplete}
            /></div>
          ))
        ) : (
          <div className="text-sm text-gray-500 col-span-full">No tasks.</div>
        )}
      </div></div>
    </div>
  );
   


  return (
  <Protected>
    <div className="pt-10 min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-white
 md:pb-10 pb-20">
       <TaskSearchBar onSearch={handleSearch} onClear={handleClearSearch} />
      <div className="space-y-10 text-center w-full p-4 md:px-10">
        
        {(searchQuery || filters) ? (
          renderSection("Search Results", data)
        ) : (
          <>
            {renderSection("Created Tasks", createdTasks)}
            {renderSection("Overdue Tasks", overdueTasks)}
            {renderSection("Assigned Tasks", assignedTasks)}
            {renderSection("Completed Tasks", completedTasks)}
          </>
        )}

        {/* Floating Create Task Button */}
        {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 md:bottom-20 md:right-20 bg-orange-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg z-50"
        >
          <Plus className="w-6 h-6" />
        </button>)}

        {/* Create Task Modal */}
        {showForm && (
          <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
          {/* <div className="fixed mx-4 md:mx-auto inset-0 z-40 bg-black/50 flex items-center justify-center"> */}
           <div className="mx-4 w-full max-w-xl">
            <TaskFormCard
              onSubmit={handleCreateTask}
              onCancel={() => setShowForm(false)}
            />
          </div></div>
        )}
      </div>
    </div>
  </Protected>
);

}
























