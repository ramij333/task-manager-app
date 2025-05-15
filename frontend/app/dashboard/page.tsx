

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
import TaskSearchBar from "@/components/TaskSearchBar";


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



const handleSearch = (query: string, filters: any) => {
  setSearchQuery(query);
  setFilters(filters);
};

const handleClearSearch = () => {
  setSearchQuery("");
  setFilters(null);
};


const filteredTasks = data?.filter((task) => {
  const matchesQuery = searchQuery
    ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    : true;

  const matchesFilters = filters ? (
    (!filters.priority || task.priority === filters.priority) &&
    (!filters.status || task.status === filters.status) &&
    (!filters.dueDate || new Date(task.dueDate).toDateString() === new Date(filters.dueDate).toDateString())
  ) : true;

  return matchesQuery && matchesFilters;
});



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
      <div className="flex justify-center items-center w-full mx-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full ">
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
      </div></div>
    </div>
  );

  return (
  <Protected>
    <div className="pt-10">
       <TaskSearchBar onSearch={handleSearch} onClear={handleClearSearch} />
      <div className="space-y-10 text-center w-full h-full grid grid-cols-1 p-4 md:px-10">
        
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
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 md:bottom-20 md:right-20 bg-orange-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg z-50"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Create Task Modal */}
        {showForm && (
          <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
            <TaskFormCard
              onSubmit={handleCreateTask}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
      </div>
    </div>
  </Protected>
);

}












// "use client";

// import useSWR from "swr";
// import { useState } from "react";
// import { Task } from "@/types/task";
// import TaskCard from "@/components/TaskCard";
// import { useAuth } from "@/contexts/AuthContext";
// import { toast } from "sonner";
// import { Loader2, Plus, Filter, Search } from "lucide-react";
// import API from "@/services/api";
// import TaskFormCard from "@/components/TaskFormCard";
// import Protected from "@/components/Protected";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { format } from "date-fns";

// type TaskFormData = {
//   title: string;
//   description: string;
//   dueDate: Date;
//   priority: "low" | "medium" | "high";
//   recurring: boolean;
//   recurringType?: "daily" | "weekly" | "monthly";
// };

// export default function Dashboard() {
//   const { user } = useAuth();
//   const currentUserId = user?.id;

//   const { data, error, isLoading, mutate } = useSWR<Task[]>("/tasks", (url: string) =>
//     API.get(url).then(res => res.data)
//   );

//   const [editId, setEditId] = useState("");
//   const [deleteId, setDeleteId] = useState("");
//   const [completeId, setCompleteId] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filters, setFilters] = useState<any>({
//     priority: "",
//     status: "",
//     dueDate: null,
//   });
//   const [filterOpen, setFilterOpen] = useState(false);

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const handleEdit = (id: string) => setEditId(id);
//   const handleDelete = (id: string) => {
//     setDeleteId(id);
//     setTimeout(() => {
//       mutate();
//       setDeleteId("");
//     }, 800);
//   };
//   const handleComplete = (id: string) => {
//     setCompleteId(id);
//     setTimeout(() => {
//       mutate();
//       setCompleteId("");
//     }, 800);
//   };

//   const handleSearch = () => {}; // All logic is inside filteredTasks

//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setFilters({ priority: "", status: "", dueDate: null });
//   };

//   const filteredTasks = data?.filter(task => {
//     const matchesQuery = searchQuery
//       ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         task.description.toLowerCase().includes(searchQuery.toLowerCase())
//       : true;

//     const matchesFilters =
//       (!filters.priority || task.priority === filters.priority) &&
//       (!filters.status || task.status === filters.status) &&
//       (!filters.dueDate ||
//         new Date(task.dueDate).toDateString() === new Date(filters.dueDate).toDateString());

//     return matchesQuery && matchesFilters;
//   });

//   const overdueTasks = data?.filter(task => {
//     const dueDate = new Date(task.dueDate);
//     dueDate.setHours(0, 0, 0, 0);
//     return (
//       dueDate < today &&
//       ((!task.recurring && task.status !== "completed") ||
//         (task.recurring && !task.completedThisCycle))
//     );
//   });

//   const createdTasks = data?.filter(task => {
//     const dueDate = new Date(task.dueDate);
//     dueDate.setHours(0, 0, 0, 0);
//     const isFutureOrToday = dueDate >= today;
//     return (
//       task.creatorId === currentUserId &&
//       task.assigneeId !== currentUserId &&
//       isFutureOrToday &&
//       ((!task.recurring && task.status !== "completed") ||
//         (task.recurring && !task.completedThisCycle))
//     );
//   });

//   const assignedTasks = data?.filter(
//     task => task.assigneeId === currentUserId && task.status !== "completed"
//   );

//   const completedTasks = data?.filter(
//     task =>
//       ((task.recurring === false && task.status === "completed") ||
//         (task.recurring === true && task.completedThisCycle === true)) &&
//       (task.creatorId === currentUserId || task.assigneeId === currentUserId)
//   );

//   const handleCreateTask = async (data: TaskFormData) => {
//     try {
//       await API.post("/tasks", {
//         ...data,
//         status: "pending",
//         creatorId: currentUserId,
//       });
//       toast.success("Task created");
//       mutate();
//       setShowForm(false);
//     } catch (error) {
//       toast.error("Failed to create task");
//     }
//   };

//   const renderSection = (title: string, tasks?: Task[]) => (
//     <div className="mb-6">
//       <h2 className="text-xl font-semibold mb-3">{title}</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {tasks && tasks.length > 0 ? (
//           tasks.map(task => (
//             <TaskCard
//               key={task.id}
//               task={task}
//               editId={editId}
//               deleteId={deleteId}
//               completeId={completeId}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//               onComplete={handleComplete}
//             />
//           ))
//         ) : (
//           <div className="text-sm text-gray-500 col-span-full">No tasks.</div>
//         )}
//       </div>
//     </div>
//   );

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-40">
//         <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-center text-red-500">Failed to load tasks.</div>;
//   }

//   return (
//     <Protected>
//       <div className="pt-20 px-4 md:px-10 space-y-10">
//         {/* 🔍 Search + Filter Bar */}
//         <div className="flex gap-2 items-center flex-wrap justify-between">
//           <Input
//             placeholder="Search tasks..."
//             value={searchQuery}
//             onChange={e => setSearchQuery(e.target.value)}
//             className="max-w-md"
//           />
//           <div className="flex gap-2">
//             <Button onClick={handleSearch}>
//               <Search className="mr-2 h-4 w-4" />
//               Search
//             </Button>

//             <Popover open={filterOpen} onOpenChange={setFilterOpen}>
//               <PopoverTrigger asChild>
//                 <Button variant="outline">
//                   <Filter className="mr-2 h-4 w-4" />
//                   Filter
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="space-y-4 w-72">
//                 <div>
//                   <label className="block text-sm mb-1">Priority</label>
//                   <Select
//                     value={filters.priority}
//                     onValueChange={val => setFilters(prev => ({ ...prev, priority: val }))}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select priority" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="low">Low</SelectItem>
//                       <SelectItem value="medium">Medium</SelectItem>
//                       <SelectItem value="high">High</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <label className="block text-sm mb-1">Status</label>
//                   <Select
//                     value={filters.status}
//                     onValueChange={val => setFilters(prev => ({ ...prev, status: val }))}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="pending">Pending</SelectItem>
//                       <SelectItem value="completed">Completed</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <label className="block text-sm mb-1">Due Date</label>
//                   <Calendar
//                     mode="single"
//                     selected={filters.dueDate}
//                     onSelect={date => setFilters(prev => ({ ...prev, dueDate: date }))}
//                   />
//                 </div>
//               </PopoverContent>
//             </Popover>

//             <Button variant="ghost" onClick={handleClearSearch}>
//               Clear
//             </Button>
//           </div>
//         </div>

//         {/* Filtered View or Normal Sections */}
//         {(searchQuery || filters.priority || filters.status || filters.dueDate) ? (
//           <>
//             <h2 className="text-xl font-bold">Search Results</h2>
//             {renderSection("Filtered Tasks", filteredTasks)}
//           </>
//         ) : (
//           <>
//             {renderSection("Created Tasks", createdTasks)}
//             {renderSection("Overdue Tasks", overdueTasks)}
//             {renderSection("Assigned Tasks", assignedTasks)}
//             {renderSection("Completed Tasks", completedTasks)}
//           </>
//         )}

//         {/* FAB + Form */}
//         <button
//           onClick={() => setShowForm(true)}
//           className="fixed bottom-6 right-6 md:bottom-20 md:right-20 bg-orange-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg z-50"
//         >
//           <Plus className="w-6 h-6" />
//         </button>

//         {showForm && (
//           <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
//             <TaskFormCard onSubmit={handleCreateTask} onCancel={() => setShowForm(false)} />
//           </div>
//         )}
//       </div>
//     </Protected>
//   );
// }











// "use client";

// import useSWR from "swr";
// import { useState } from "react";
// import { Task } from "@/types/task";
// import TaskCard from "@/components/TaskCard";
// import { useAuth } from "@/contexts/AuthContext";
// import { toast } from "sonner";
// import { Loader2, Plus } from "lucide-react";
// import API from "@/services/api";
// import TaskFormCard from "@/components/TaskFormCard";
// import Protected from "@/components/Protected";
// import TaskSearchBar from "@/components/TaskSearchBar";


// type TaskFormData = {
//   title: string;
//   description: string;
//   dueDate: Date;
//   priority: "low" | "medium" | "high";
//   recurring: boolean;
//   recurringType?: "daily" | "weekly" | "monthly";
// };

// export default function Dashboard() {
//   const { user } = useAuth();
 
//   const currentUserId = user?.id;
 

//   const { data , error, isLoading, mutate } = useSWR<Task[]>("/tasks", (url: string) =>
//   API.get(url).then(res => res.data)
// );



//   const [editId, setEditId] = useState<string>("");
//   const [deleteId, setDeleteId] = useState<string>("");
//   const [assignId, setAssignId] = useState<string>("")
//   const [completeId, setCompleteId] = useState<string>("");
//  const [showForm, setShowForm] = useState<boolean>(false);
//  const [searchQuery, setSearchQuery] = useState<string>("");
// const [filters, setFilters] = useState<any>(null); 

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-40">
//         <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center text-red-500">
//         Failed to load tasks.
//       </div>
//     );
//   }

//   const handleEdit = (id: string, updatedData?: Task) => {
//     if (id) {
//       setEditId(id);
//     } else {
//       setEditId("");
//       mutate();
//     }
//   };

//   const handleDelete = (id: string) => {
//     setDeleteId(id);
//     setTimeout(() => {
//       mutate();
//       setDeleteId("");
//     }, 800);
//   };

//   const handleComplete = (id: string) => {
//     setCompleteId(id);
//     setTimeout(() => {
//       mutate();
//       setCompleteId("");
//     }, 800);
//   };



// const handleSearch = (query: string, filters: any) => {
//   setSearchQuery(query);
//   setFilters(filters);
// };

// const handleClearSearch = () => {
//   setSearchQuery("");
//   setFilters(null);
// };

// const filteredTasks = data?.filter((task) => {
//   const matchesQuery = searchQuery
//     ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       task.description.toLowerCase().includes(searchQuery.toLowerCase())
//     : true;

//   const matchesFilters = filters ? (
//     (!filters.priority || task.priority === filters.priority) &&
//     (!filters.status || task.status === filters.status) &&
//     (!filters.dueDate || new Date(task.dueDate).toDateString() === new Date(filters.dueDate).toDateString())
//   ) : true;

//   return matchesQuery && matchesFilters;
// });



// const handleCreateTask = async (data: TaskFormData) => {
//     try {
//       await API.post("/tasks", {
//         ...data,
//         status: 'pending',
//         creatorId: currentUserId,
//       });
//       toast.success("Task created");
//       mutate();
//       setShowForm(false);
//     } catch (error) {
//       toast.error("Failed to create task");
//     }
//   };

//  // Normalize today to midnight
// const today = new Date();
// today.setHours(0, 0, 0, 0);

// // 1. Overdue Tasks
// const overdueTasks = data?.filter((task) => {
//   const dueDate = new Date(task.dueDate);
//   dueDate.setHours(0, 0, 0, 0);

//   return (
//     dueDate < today &&
//     (
//       (!task.recurring && task.status !== "completed") ||
//       (task.recurring && task.completedThisCycle === false)
//     )
//   );
// });

// // 2. Created Tasks (not overdue, not completed)
// const createdTasks = data?.filter((task) => {
//   const dueDate = new Date(task.dueDate);
//   dueDate.setHours(0, 0, 0, 0);

//   const isFutureOrToday = dueDate >= today;

//   return (
//     task.creatorId === currentUserId &&
//     task.assigneeId !== currentUserId &&
//     isFutureOrToday &&
//     (
//       (!task.recurring && task.status !== "completed") ||
//       (task.recurring && task.completedThisCycle === false)
//     )
//   );
// });



//   const assignedTasks = data?.filter(
//     (task) =>
//       task.assigneeId === currentUserId &&
//       task.status !== "completed"
//   );
//   const completedTasks = data?.filter(
//     (task) => ((task.recurring === false && task.status === "completed") || (task.recurring === true  && task.completedThisCycle === true)) &&
//       (task.creatorId === currentUserId || task.assigneeId === currentUserId)
//   );

//   const renderSection = (title: string, tasks?: Task[]) => (
//     <div className="mb-6">
//       <h2 className="text-xl font-semibold mb-3">{title}</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {tasks && tasks.length > 0 ? (
//           tasks.map((task) => (
//             <TaskCard
//               key={task.id}
//               task={task}
//               editId={editId}
//               deleteId={deleteId}
//               completeId={completeId}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//               onComplete={handleComplete}
//             />
//           ))
//         ) : (
//           <div className="text-sm text-gray-500 col-span-full">No tasks.</div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <Protected>
//       <div className="pt-20">
      

      
//    <div className=" space-y-10 text-center w-full h-full grid grid-cols-1 p-4 md:px-10 ">
      
//       {(searchQuery || filters) ? (
//   renderSection("Search Results", filteredTasks)
// ) : (
//   <>
//     {renderSection("Created Tasks", createdTasks)}
//     {renderSection("Overdue Tasks", overdueTasks)}
//     {renderSection("Assigned Tasks", assignedTasks)}
//     {renderSection("Completed Tasks", completedTasks)}
//   </>
// )}

     
//       <button
//         onClick={() => setShowForm(true)}
//         className="fixed bottom-6 right-6 md:bottom-20 md:right-20 bg-orange-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg z-50"
//       >
//         <Plus className="w-6 h-6" />
//       </button>

      
//       {showForm && (
//         <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
//           <TaskFormCard
//             onSubmit={handleCreateTask}
//             onCancel={() => setShowForm(false)}
//           />
//         </div>
//       )}
//     </div></div></Protected>
//   );
// }











