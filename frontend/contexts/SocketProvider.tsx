"use client";

import { useEffect } from "react";
import socket from "@/services/socket";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const SocketProvider = () => {
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!user?.id || !isLoggedIn) return;

    socket.emit("join", user.id);

    // Named handlers
    const handleTaskAssigned = (data:any) => {
      toast.info("New Task Assigned", {
        description: `You were assigned: "${data.title}" by ${data.assignedBy}`,
      });
    };

    const handleTaskUpdated = (data:any) => {
      toast("Task Updated", {
        description: `${data.updatedBy || "Someone"} updated "${data.title}"`,
      });
    };

    const handleTaskCompleted = (data:any) => {
      toast("Task Completed", {
        description: `"${data.title}" task has been complete by ${data.completedBy}.`,
        action: {
          label: "View",
          onClick: () => (window.location.href = "/dashboard"),
        },
      });
    };

    // const handleTaskCreated = (data:any) => {
    //   toast("Task created from socket", {
    //     description: "this task is to test socket.",
    //     action: {
    //       label: "View",
    //       onClick: () => (window.location.href = "/dashboard"),
    //     },
    //   });
    // };

    // Register listeners
    socket.on("task-assigned", handleTaskAssigned);
    socket.on("task-updated", handleTaskUpdated);
    socket.on("task-completed", handleTaskCompleted);
    //socket.on("task-created", handleTaskCreated);

    // Cleanup on unmount or deps change
    return () => {
      socket.off("task-assigned", handleTaskAssigned);
      socket.off("task-updated", handleTaskUpdated);
      socket.off("task-completed", handleTaskCompleted);
     // socket.off("task-created", handleTaskCreated);
    };
  }, [user, isLoggedIn]);

  return null;
};











// "use client";

// import { useEffect } from "react";
// import socket from "@/services/socket"
// import { toast } from "sonner";
// import { useAuth } from "@/contexts/AuthContext"; 

// export const SocketProvider = () => {
//   const { user, isLoggedIn } = useAuth();

//   useEffect(() => {
//     if (!user?.id || !isLoggedIn) return;

//     // Join personal room
//     socket.emit("join", user.id);

//     // Listen for events
//     socket.on("task-assigned", (data) => {
//       toast.info("New Task Assigned", {
//         description: `You were assigned: "${data.taskTitle}" by ${data.assignedBy}`,
//       });
//     });

//     socket.on("task-updated", (data) => {
//       toast.success("Task Updated", {
//         description: `${data.updatedByName || "Someone"} updated "${data.taskTitle}"`,
//       });
//     });

//     socket.on("task-completed", (data) => {
//       toast("Task Completed", {
//         description: `"${data.taskTitle}" has been marked as complete by ${data.completedBy}.`,
//         action: {
//           label: "View",
//           onClick: () => window.location.href = "/dashboard", // Optional
//         },
//       });
//     });

//     socket.on("task-created", (data) => {
//         toast("Task created from socket", {
//         description: "this task is to test socket.",
//         action: {
//           label: "View",
//           onClick: () => window.location.href = "/dashboard", // Optional
//         },
//       });
//     })

//     // Clean up
//     return () => {
//       socket.off("task-assigned");
//       socket.off("task-updated");
//       socket.off("task-completed");
//     };
//   }, [user, isLoggedIn]);

//   return null;
// };

