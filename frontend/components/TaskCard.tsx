"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Task, Priority } from "@/types/task";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import TaskFormCard from "./TaskFormCard";
import { AssignTaskFormCard } from "./AssignTaskFormCard";
import API from "@/services/api";

interface TaskCardProps {
  task: Task;
  editId?: string;
  deleteId?: string;
  completeId?: string;
  onEdit: (id: string, data: Task) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

const priorityColor: Record<Priority, string> = {
  high: "bg-red-700",
  medium: "bg-orange-500",
  low: "bg-green-500",
};

const priorityStyles: Record<Priority, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-orange-100 text-orange-800",
  low: "bg-green-100 text-green-800",
};

export default function TaskCard({
  task,
  editId,
  deleteId,
  completeId,
  onEdit,
  onDelete,
  onComplete,
}: TaskCardProps) {
  const { user } = useAuth();
  const currentUserId = user.id;
  const currentUserRole = user.role;

  const {
    id,
    title,
    description,
    dueDate,
    priority,
    status,
    creatorId,
    assigneeId,
    recurring,
    completedThisCycle,
  } = task;

  const isCreator = currentUserId === creatorId;
  const isAssignee = currentUserId === assigneeId;
  const isAdmin = currentUserRole === "admin";
  const isManager = currentUserRole === "manager";
  const isCompleted = status === "completed";

 
  const showComplete =
    !isCompleted &&
    (isAdmin || isManager || isAssignee || isCreator) &&
    (!recurring || (recurring && !completedThisCycle));
  
  const showAssign = (isAdmin || isManager) && !assigneeId;
  const showEdit = isCreator && !isCompleted;
  const showDelete = 
  isAdmin || 
  (isManager && isCreator) || 
  (currentUserRole === "user" && isCreator && !assigneeId);
  const showMenu = showAssign || showEdit || showDelete;
 

  // const showAssign = (isAdmin || isManager) && !assigneeId && showComplete;
//  const showEdit =
//   (isAdmin || isManager) &&
//   (
//     !isCompleted || 
//     (isCompleted && recurring && !!assigneeId) // 
//   ) ||
//   (currentUserRole === "user" && isCreator && !assigneeId && !isCompleted);
  // const showDelete = isAdmin || isManager || (isCreator && !assigneeId);
  //  const showMenu =
  //   (isAdmin ||
  //   isManager ||
  //   (currentUserRole === "user" && isCreator && !assigneeId)) && (showAssign || showEdit || showDelete);

  

  const isEditing = editId === id;
  const isDeleting = deleteId === id;
  const isCompleting = completeId === id;
  const [showEditForm, setShowEditForm] = useState(false);
  // Handle deletion side-effect
  useEffect(() => {
    if (isDeleting) {
      API.delete(`/tasks/${id}`)
        .then(() => toast.success("Task deleted"))
        .catch(() => toast.error("Failed to delete task"));
    }
  }, [isDeleting, id]);

  // Handle completion side-effect
  useEffect(() => {
    if (isCompleting) {
      API.put(`/tasks/${id}/complete`)
        .then((res) => {
          if (res.data && res.data.task) {
            toast.success("Task marked as complete");
          } else {
            toast.error("You are not authorized to complete this task");
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 403) {
            toast.error("Forbidden: You can't complete this task");
          } else {
            toast.error("Failed to mark complete");
          }
        });
    }
  }, [isCompleting, id]);

  useEffect(() => {
    if (isEditing) {
      setShowEditForm(true);
    }
  }, [isEditing]);

  // Handle form submission for edit
  const handleEditSubmit = async (data: any) => {
    try {
      await API.put(`/tasks/${id}`, data);
      toast.success("Task updated");
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Failed to update task: ", err);
    }
    setShowEditForm(false);
  };

  const [showAssignForm, setShowAssignForm] = useState(false);

  const formattedInitialData = {
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
  };

  const [assigneeName, setAssigneeName] = useState("");
  const [creatorName, setCreatorName] = useState("");

  useEffect(() => {
    const fetchNames = async () => {
      try {
        if (assigneeId) {
          const res = await API.get(`/users/${assigneeId}`);
          setAssigneeName(res.data.name);
        }
        if (isAssignee && creatorId) {
          const res = await API.get(`/users/${creatorId}`);
          setCreatorName(res.data.name);
        }
      } catch (err) {
        console.error("Failed to fetch user names");
        console.error("Failed to fetch user names: ", err);
      }
    };

    fetchNames();
  }, [assigneeId, creatorId, isAssignee]);

  return (
    <>
      <Card className="rounded-xl shadow-md bg-white hover:shadow-lg transition-all">
        {showEditForm ? (
          <div className="fixed inset-0 z-30 bg-black/50 flex items-center justify-center">
            <div className="w-full max-w-md">
              <TaskFormCard
                initialValues={formattedInitialData}
                onSubmit={handleEditSubmit}
                onCancel={() => {
                  onEdit("", task);
                  setShowEditForm(false);
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-3 w-3 rounded-full",
                    priorityColor[priority]
                  )}
                ></span>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              </div>
              {showMenu && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {showEdit && (
                      <DropdownMenuItem onClick={() => onEdit(id, task)}>
                        Edit
                      </DropdownMenuItem>
                    )}
                    {showDelete && (
                      <DropdownMenuItem onClick={() => onDelete(id)}>
                        Delete
                      </DropdownMenuItem>
                    )}
                    {showAssign && (
                      <DropdownMenuItem
                        onClick={() => {
                          setShowAssignForm(true);
                        }}
                      >
                        Assign
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardHeader>

            <CardContent className="space-y-4 flex flex-col justify-start items-start">
              <p className="text-md text-gray-800">{description}</p>
              <div className="text-sm text-muted-foreground">
                Due: {new Date(dueDate).toLocaleDateString()}
              </div>
              {assigneeId &&
                currentUserId === creatorId &&
                assigneeId !== creatorId && (
                  <div className="text-sm font-medium capitalize">
                    Assigned to:{" "}
                    <span className="text-gray-700">{assigneeName}</span>
                  </div>
                )}

              {currentUserId === assigneeId && creatorId !== assigneeId && (
                <div className="text-sm font-medium capitalize">
                  Assigned by:{" "}
                  <span className="text-gray-700">{creatorName}</span>
                </div>
              )}

              <div className="text-sm font-medium capitalize">
                Priority:{" "}
                <span
                  className={cn(
                    "px-2 py-1 rounded-full",
                    priorityStyles[priority]
                  )}
                >
                  {priority}
                </span>
              </div>
              <div className="flex flex-row justify-center items-center gap-3">
                <div className="text-sm font-medium capitalize">
                  Status:{" "}
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full",
                      status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    )}
                  >
                    {status}
                  </span>{" "}
                  {recurring && (
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full",
                        "bg-purple-100 text-purple-700"
                      )}
                    >
                      {" "}
                      Recucrring{" "}
                    </span>
                  )}
                </div>
              </div>
              {showComplete && (
                <div className="w-full flex justify-center items-center">
                  <Button
                    variant="default"
                    size="sm"
                    className="mt-2"
                    onClick={() => onComplete(id)}
                  >
                    Mark as Complete
                  </Button>
                </div>
              )}
            </CardContent>
          </>
        )}
      </Card>

      {showAssignForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <AssignTaskFormCard
            taskId={task.id}
            onClose={() => setShowAssignForm(false)}
          />
        </div>
      )}
    </>
  );
}

// "use client";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { MoreVertical } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { cn } from "@/lib/utils";
// import { Task, Priority } from "@/types/task";

// interface TaskCardProps {
//   task: Task;
//   currentUserId: string;
//   currentUserRole: "admin" | "manager" | "user";
//   onEdit: (task: Task) => void;
//   onDelete: (id: string) => void;
//   onAssign: (id: string, assigneeId: any) => void;
//   onComplete: (id: string) => void;
// }

// // Priority color styles
// const priorityColor: Record<Priority, string> = {
//   high: "bg-red-700",
//   medium: "bg-orange-500",
//   low: "bg-green-500",
// };

// const priorityStyles: Record<Priority, string> = {
//   high: "bg-red-100 text-red-800",
//   medium: "bg-orange-100 text-orange-800",
//   low: "bg-green-100 text-green-800",
// };

// export default function TaskCard({
//   task,
//   currentUserId,
//   currentUserRole,
//   onEdit,
//   onDelete,
//   onAssign,
//   onComplete,
// }: TaskCardProps) {
//   const {
//     id,
//     title,
//     description,
//     dueDate,
//     priority,
//     status,
//     creatorId,
//     assigneeId,
//   } = task;

//   const isCreator = currentUserId === creatorId;
//   const isAssignee = currentUserId === assigneeId;
//   const isAdmin = currentUserRole === "admin";
//   const isManager = currentUserRole === "manager";

//   const isCompleted = status === "completed";

//   const showMenu =
//     isAdmin || isManager || (currentUserRole === "user" && isCreator && !assigneeId);

//   const showAssign = (isAdmin || isManager) && !assigneeId;
//   const showComplete = !isCompleted && (isAdmin || isManager || isAssignee || isCreator);

//   return (
//     <Card className="rounded-xl shadow-md bg-white hover:shadow-lg transition-all">
//       <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
//         <div className="flex items-center gap-2">
//           <span className={cn("h-3 w-3 rounded-full", priorityColor[priority])}></span>
//           <CardTitle className="text-lg font-semibold">{title}</CardTitle>
//         </div>
//         {showMenu && (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon" className="h-8 w-8">
//                 <MoreVertical className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => onEdit(task)}>
//                 Edit
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => onDelete(id)}>
//                 Delete
//               </DropdownMenuItem>
//               {showAssign && (
//                 <DropdownMenuItem onClick={() => onAssign(id, assigneeId)}>
//                   Assign
//                 </DropdownMenuItem>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         )}
//       </CardHeader>

//       <CardContent className="space-y-4">
//         <p className="text-md text-gray-800">{description}</p>
//         <div className="text-sm text-muted-foreground">
//           Due: {new Date(dueDate).toLocaleDateString()}
//         </div>
//         <div className="text-sm font-medium capitalize">
//           Priority:{" "}
//           <span className={cn("px-2 py-1 rounded-full", priorityStyles[priority])}>
//             {priority}
//           </span>
//         </div>
//         <div className="text-sm font-medium capitalize">
//           Status:{" "}
//           <span
//             className={cn(
//               "px-2 py-1 rounded-full",
//               status === "completed"
//                 ? "bg-green-100 text-green-700"
//                 : "bg-yellow-100 text-yellow-700"
//             )}
//           >
//             {status}
//           </span>
//         </div>
//         {showComplete && (
//           <div className="w-full flex justify-center">
//             <Button
//               variant="default"
//               size="sm"
//               className="mt-2"
//               onClick={() => onComplete(id)}
//             >
//               Mark as Complete
//             </Button>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// "use client";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { MoreVertical } from "lucide-react";
// import { useState } from "react";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { cn } from "@/lib/utils";

// type Priority = "high" | "medium" | "low";
// type Status = "pending" | "completed";

// interface TaskCardProps {
//   task: {
//     id: string;
//     title: string;
//     description: string;
//     dueDate: string;
//     priority: Priority;
//     status: Status;
//     creatorId: string;
//     assigneeId?: string;
//   };
//   currentUserId: string;
//   currentUserRole: "admin" | "manager" | "user";
//   onUpdate: (id: string, updatedData: any) => void;
//   onDelete: (id: string) => void;
//   onAssign: (id: string, assigneeId: any) => void;
//   onComplete: (id: string) => void;
// }

// export default function TaskCard({
//   task,
//   currentUserId,
//   currentUserRole,
//   onUpdate,
//   onDelete,
//   onAssign,
//   onComplete,
// }: TaskCardProps) {
//   const {
//     id,
//     title,
//     description,
//     dueDate,
//     priority,
//     status,
//     creatorId,
//     assigneeId,
//   } = task;

//   const isCreator = currentUserId === creatorId;
//   const isAssignee = currentUserId === assigneeId;
//   const isAdmin = currentUserRole === "admin";
//   const isManager = currentUserRole === "manager";

//   const isCompleted = status === "completed";

//   const showMenu =
//     (isAdmin || isManager) ||
//     (currentUserRole === "user" && isCreator && !assigneeId);

//   const showAssign = (isAdmin || isManager) && !assigneeId;

//   const showComplete = !isCompleted && (isAdmin || isManager || isAssignee || isCreator);

//   const priorityColor = {
//     high: "bg-red-700",
//     medium: "bg-orange-500",
//     low: "bg-green-500",
//   }[priority];

//   const priorityStyles: Record<Priority, string> = {
//   high: "bg-red-100 text-red-800",
//   medium: "bg-orange-100 text-orange-800",
//   low: "bg-green-100 text-green-800",
// };

//   return (
//     <Card className="rounded-xl shadow-md bg-white hover:shadow-lg transition-all">
//       <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
//         <div className="flex items-center gap-2">
//           <span className={cn("h-3 w-3 rounded-full", priorityColor)}></span>
//           <CardTitle className="text-lg font-semibold">{title}</CardTitle>
//         </div>
//         {showMenu && (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon" className="h-8 w-8">
//                 <MoreVertical className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => onUpdate(id, task)}>
//                 Update
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => onDelete(id)}>
//                 Delete
//               </DropdownMenuItem>
//               {showAssign && (
//                 <DropdownMenuItem onClick={() => onAssign(id, assigneeId)}>
//                   Assign
//                 </DropdownMenuItem>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         )}
//       </CardHeader>

//       <CardContent className="space-y-4">
//         <p className="text-md text-gray-800">{description}</p>
//         <div className="text-sm text-muted-foreground">
//           Due: {new Date(dueDate).toLocaleDateString()}
//         </div>
//          <div className="text-sm font-medium capitalize">
//           Priority:{" "}
//           <span
//             className={cn(
//               "px-2 py-1 rounded-full",
//               priorityStyles[task.priority]
//             )}
//           >
//             {task.priority}
//           </span>
//         </div>
//         <div className="text-sm font-medium capitalize">
//           Status:{" "}
//           <span
//             className={cn(
//               "px-2 py-1 rounded-full",
//               status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
//             )}
//           >
//             {status}
//           </span>
//         </div>
//         <div className="w-full flex justify-center items-center">
//         {showComplete && (
//           <Button
//             variant="default"
//             size="sm"
//             className="mt-2"
//             onClick={() => onComplete(id)}
//           >
//             Mark as Complete
//           </Button>
//         )}</div>
//       </CardContent>
//     </Card>
//   );
// }
