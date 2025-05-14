// "use client";
// import fetcher from "@/services/fetcher";
// import { useState } from "react";
// import { Plus } from "lucide-react";
// import TaskList from "@/components/TaskList";
// import TaskFormCard from "./TaskFormCard";
// import { Button } from "@/components/ui/button";
// import Protected from "@/components/Protected";
// import { useAuth } from "@/contexts/AuthContext";
// import { Task } from "@/types/task";

// export default function DashboardPage() {
//   const [showForm, setShowForm] = useState(false);
//   const [editTask, setEditTask] = useState<Task | null>(null);

//   const { user } = useAuth();

//   const handleCreateClick = () => {
//     setEditTask(null);
//     setShowForm(true);
//   };

//   const handleEdit = (task: any) => {
//     setEditTask(task);
//     setShowForm(true);
//   };

//   const closeForm = () => {
//     setEditTask(null);
//     setShowForm(false);
//   };

//   // Import your fetcher to handle API calls

//   const handleSubmit = async (data: any) => {
//     try {
//       const url = editTask ? `/tasks/${editTask.id}` : "/tasks"; // Determine the URL
//       const method = editTask ? "PUT" : "POST"; // Determine the HTTP method

//       // Call fetcher with method, URL, and data (task data)
//       await fetcher({
//         method,
//         url,
//         data,
//       });

//       closeForm(); // Close the form after submission
//     } catch (error) {
//       console.error("Error submitting task:", error);
//       // Optionally, you can show an error message to the user
//     }
//   };

//   return (
//     <Protected>
//       <main className="relative p-6 max-w-7xl mx-auto space-y-8">
//         <h1 className="text-3xl font-bold text-gray-900">Your Tasks</h1>

        

//         {showForm && (
//           <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//               <TaskFormCard
//                 initialValues={
//                   editTask
//                     ? {
//                         ...editTask,
//                         dueDate: new Date(editTask.dueDate), // Convert to Date if it's a string
//                       }
//                     : {
//                         title: "",
//                         description: "",
//                         dueDate: new Date(),
//                         priority: "medium",
//                         recurring: false,
//                         recurringType: undefined,
//                       }
//                 }
//                 onSubmit={handleSubmit}
//                 onCancel={closeForm}
//               />
//             </div>
//           </div>
//         )}

//         <Button
//           onClick={handleCreateClick}
//           className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 z-30"
//         >
//           <Plus className="h-6 w-6" />
//         </Button>
//       </main>
//     </Protected>
//   );
// }













// "use client";
// import fetcher from "@/services/fetcher";
// import { useState } from "react";
// import { Plus } from "lucide-react";
// import TaskList from "@/components/TaskList";
// import TaskFormCard from "./TaskFormCard";
// import { Button } from "@/components/ui/button";
// import Protected from "@/components/Protected";
// import { useAuth } from "@/contexts/AuthContext";
// import { Task } from "@/types/task";

// export default function DashboardPage() {
//   const [showForm, setShowForm] = useState(false);
//   const [editTask, setEditTask] = useState<Task | null>(null);

//   const { user } = useAuth();

//   const handleCreateClick = () => {
//     setEditTask(null);
//     setShowForm(true);
//   };

//   const handleEdit = (task: any) => {
//     setEditTask(task);
//     setShowForm(true);
//   };

//   const closeForm = () => {
//     setEditTask(null);
//     setShowForm(false);
//   };

//   // Import your fetcher to handle API calls

//   const handleSubmit = async (data: any) => {
//     try {
//       const url = editTask ? `/tasks/${editTask.id}` : "/tasks"; // Determine the URL
//       const method = editTask ? "PUT" : "POST"; // Determine the HTTP method

//       // Call fetcher with method, URL, and data (task data)
//       await fetcher({
//         method,
//         url,
//         data,
//       });

//       closeForm(); // Close the form after submission
//     } catch (error) {
//       console.error("Error submitting task:", error);
//       // Optionally, you can show an error message to the user
//     }
//   };

//   return (
//     <Protected>
//       <main className="relative p-6 max-w-7xl mx-auto space-y-8">
//         <h1 className="text-3xl font-bold text-gray-900">Your Tasks</h1>

        

//         {showForm && (
//           <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//               <TaskFormCard
//                 initialValues={
//                   editTask
//                     ? {
//                         ...editTask,
//                         dueDate: new Date(editTask.dueDate), // Convert to Date if it's a string
//                       }
//                     : {
//                         title: "",
//                         description: "",
//                         dueDate: new Date(),
//                         priority: "medium",
//                         recurring: false,
//                         recurringType: undefined,
//                       }
//                 }
//                 onSubmit={handleSubmit}
//                 onCancel={closeForm}
//               />
//             </div>
//           </div>
//         )}

//         <Button
//           onClick={handleCreateClick}
//           className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 z-30"
//         >
//           <Plus className="h-6 w-6" />
//         </Button>
//       </main>
//     </Protected>
//   );
// }
