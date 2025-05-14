// "use client";

// import React from "react";
// import TaskCard from "./TaskCard";
// import { Task } from "@/types/task";

// type TaskListProps = {
//   tasks: Task[];
//   deleteTaskId?: string;
//   editData?: { id: string; data: Task };
//   assignId?: string;
//   completeTaskId?: string;
// };

// const TaskList: React.FC<TaskListProps> = ({
//   tasks,
//   deleteTaskId,
//   editData,
//   assignId,
//   completeTaskId,
// }) => {
//   return (
//     <div className="task-list grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//       {tasks.length === 0 ? (
//         <p>No tasks available</p>
//       ) : (
//         tasks.map((task) => (
//           <TaskCard
//             key={task.id}
//             task={task}
//             deleteId={deleteTaskId}
//             editData={editData}
//             assignId={assignId}
//             completeId={completeTaskId}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default TaskList;











// import React from "react";
// import TaskCard from "./TaskCard"; // Import your TaskCard component
// import { Task } from "@/types/task";
// import API from "@/services/api";
// import { toast } from "sonner";
// import { useAuth } from "@/contexts/AuthContext";

// type TaskListProps = {
//   tasks: Task[];
//   // currentUserId: string;
//   // currentUserRole: "admin" | "manager" | "user";
//   mutate: () => void;
// };

// const TaskList: React.FC<TaskListProps> = ({ tasks, mutate }) => {

//   const { user } = useAuth();
//   const onDelete = async (id: string) => {
//     try {
//       await API.delete(`/tasks/${id}`);
//       toast.success("Task deleted");
//       mutate();
//     } catch (err) {
//       toast.error("Failed to delete task");
//     }
//   };

//   const onAssign = async (id: string, assigneeId: string) => {
//     try {
//       await API.put(`/tasks/${id}/assign`, { assigneeId });
//       toast.success("Task assigned successfully");
//       mutate();
//     } catch (err) {
//       toast.error("Failed to assign task");
//     }
//   };

//   const onComplete = async (id: string) => {
//     try {
//       await API.put(`/tasks/${id}/complete`);
//       toast.success("Task marked as completed");
//       mutate();
//     } catch (err) {
//       toast.error("Failed to complete task");
//     }
//   };

//   return (
//     <div className="task-list grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//       {tasks.length === 0 ? (
//         <p>No tasks available</p>
//       ) : (
//         tasks.map((task) => (
//           <TaskCard
//             key={task.id}
//             task={task}
//             currentUserId={user._id}
//             currentUserRole={user.role}
//             onEdit={() => {}}  
//             onDelete={onDelete}
//             onAssign={onAssign}
//             onComplete={onComplete}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default TaskList;

















// "use client";

// import useSWR from "swr";
// import fetcher from "@/services/fetcher";
// import TaskCard from "./TaskCard";
// import { useAuth } from "@/contexts/AuthContext";
// import { toast } from "sonner";
// import API from "@/services/api";
// import ClipLoader from "react-spinners/ClipLoader";
// import { useState } from "react";
// import { Task } from "@/types/task";
// import TaskFormCard from "./TaskFormCard";

// type TaskListProps = {
//   tasks: Task[]
//   onEdit?: (task: Task) => void; // Optional external edit handler
// };

// export default function TaskList({ onEdit }: TaskListProps) {
//   const { user } = useAuth();
//   const { data: tasks, error, isLoading, mutate } = useSWR("/tasks", fetcher);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [showForm, setShowForm] = useState(false);

//   const handleEdit = (task: Task) => {
//     if (onEdit) {
//       onEdit(task); // Delegate to external handler (e.g., DashboardPage)
//     } else {
//       setSelectedTask(task); // Use internal form
//       setShowForm(true);
//     }
//   };

//   if (isLoading) return <p><ClipLoader color="#3b82f6" size={35} /></p>;
//   if (error) {
//     toast.error("Error loading tasks.");
//     return null;
//   }

//   return (
//     <>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {tasks?.map((task: Task) => (
//           <TaskCard
//             key={task.id || task.id}
//             task={{ ...task, id: task.id || task.id }}
//             currentUserId={user._id}
//             currentUserRole={user.role}
//             onEdit={handleEdit}
//             onDelete={async (id) => {
//               try {
//                 await API.delete(`/tasks/${id}`);
//                 toast.success("Task deleted");
//                 mutate();
//               } catch (err) {
//                 toast.error("Failed to delete task");
//               }
//             }}
//             onAssign={async (id, assigneeId) => {
//               try {
//                 await API.put(`/tasks/${id}/assign`, { assigneeId });
//                 toast.success("Task assigned successfully");
//                 mutate();
//               } catch (err) {
//                 toast.error("Failed to assign task");
//               }
//             }}
//             onComplete={async (id) => {
//               try {
//                 await API.put(`/tasks/${id}/complete`);
//                 toast.success("Task marked as completed");
//                 mutate();
//               } catch (err) {
//                 toast.error("Failed to complete task");
//               }
//             }}
//           />
//         ))}
//       </div>

//       {!onEdit && showForm && (
//         <TaskFormCard
//           initialValues={
//             selectedTask
//               ? {
//                   title: selectedTask.title,
//                   description: selectedTask.description,
//                   dueDate: new Date(selectedTask.dueDate),
//                   priority: selectedTask.priority,
//                   recurring: selectedTask.recurring,
//                   recurringType: selectedTask.recurringType,
//                 }
//               : undefined
//           }
//           onCancel={() => {
//             setShowForm(false);
//             setSelectedTask(null);
//           }}
//           onSubmit={async (values) => {
//             try {
//               if (selectedTask) {
//                 await API.put(`/tasks/${selectedTask.id}`, values);
//                 toast.success("Task updated");
//               } else {
//                 await API.post("/tasks", values);
//                 toast.success("Task created");
//               }
//               setShowForm(false);
//               setSelectedTask(null);
//               mutate();
//             } catch (err) {
//               toast.error("Failed to save task");
//             }
//           }}
//         />
//       )}
//     </>
//   );
// }











// "use client";

// import useSWR from "swr";
// import fetcher from "@/services/fetcher";
// import TaskCard from "./TaskCard";
// import { useAuth } from "@/contexts/AuthContext";
// import { toast } from "sonner";
// import API from "@/services/api";
// import ClipLoader from "react-spinners/ClipLoader";



// export default function TaskList() {

  
//   const { user } = useAuth();
//   const { data: tasks, error, isLoading, mutate } = useSWR("/tasks", fetcher);

//   if (isLoading) return <p><ClipLoader color="#3b82f6" size={35} loading={true} /></p>;
//   if (error) return toast.error("Error loading tasks.");

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {tasks?.map((task: any) => (
//         <TaskCard
//   key={task._id}
//   task={{ ...task, id: task._id }}
//   currentUserId={user._id}
//   currentUserRole={user.role}
//   onUpdate={async (id, updatedData) => {
//     try {
//       await API.put(`/tasks/${id}`, updatedData);
// //       await fetch(`http://localhost:5000/api/tasks/${id}`, {
// //   method: "PUT",
// //   headers: {
// //     "Content-Type": "application/json",
// //   },
// //   credentials: "include",
// //   body: JSON.stringify(updatedData),
// // });

//       toast.success("Task updated successfully");
//       mutate();
//     } catch (err) {
//       toast.error( "Failed to update task" );
//     }
//   }}
//   onAssign={async (id, assigneeId) => {
//     try {
//       await API.put(`/tasks/${id}/assign`, { assigneeId });
// //       await fetch(`http://localhost:5000/api/tasks/${id}/assign`, {
// //   method: "PUT",
// //   headers: {
// //     "Content-Type": "application/json",
// //   },
// //   credentials: "include",
// //   body: JSON.stringify({ assigneeId }),
// // });

//       toast.success( "Task assigned successfully" );
//       mutate();
//     } catch (err) {
//       toast.error( "Failed to assign task" );
//     }
//   }}
//   onDelete={async (id) => {
//     try {
//       await API.delete(`/tasks/${id}`);
// //       await fetch(`http://localhost:5000/api/tasks/${id}`, {
// //   method: "DELETE",
// //   credentials: "include",
// // });

//       toast.success( "Task deleted" );
//       mutate();
//     } catch (err) {
//        toast.error( "Failed to delete task" );
//     }
//   }}
//   onComplete={async (id) => {
//     try {
//       await API.put(`/tasks/${id}/complete`);
// //       await fetch(`http://localhost:5000/api/tasks/${id}/complete`, {
// //   method: "PUT",
// //   credentials: "include",
// // });

//       toast.success( "Task marked as completed" );
//       mutate();
//     } catch (err) {
//       toast.error( "Failed to complete task" );
//     }
//   }}
// />

//       ))}
//     </div>
//   );
// }
