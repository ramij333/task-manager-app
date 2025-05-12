"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Priority = "high" | "medium" | "low";
type Status = "pending" | "completed";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: Priority;
    status: Status;
    creatorId: string;
    assigneeId?: string;
  };
  currentUserId: string;
  currentUserRole: "admin" | "manager" | "user";
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
  onAssign: (id: string) => void;
  onComplete: (id: string) => void;
}

export default function TaskCard({
  task,
  currentUserId,
  currentUserRole,
  onUpdate,
  onDelete,
  onAssign,
  onComplete,
}: TaskCardProps) {
  const {
    id,
    title,
    description,
    dueDate,
    priority,
    status,
    creatorId,
    assigneeId,
  } = task;

  const isCreator = currentUserId === creatorId;
  const isAssignee = currentUserId === assigneeId;
  const isAdmin = currentUserRole === "admin";
  const isManager = currentUserRole === "manager";

  const isCompleted = status === "completed";

  const showMenu =
    (isAdmin || isManager) ||
    (currentUserRole === "user" && isCreator && !assigneeId);

  const showAssign = (isAdmin || isManager) && !assigneeId;

  const showComplete = !isCompleted && (isAdmin || isManager || isAssignee || isCreator);

  const priorityColor = {
    high: "bg-red-700",
    medium: "bg-orange-500",
    low: "bg-green-500",
  }[priority];

  const priorityStyles: Record<Priority, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-orange-100 text-orange-800",
  low: "bg-green-100 text-green-800",
};

  return (
    <Card className="rounded-xl shadow-md bg-white hover:shadow-lg transition-all">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <span className={cn("h-3 w-3 rounded-full", priorityColor)}></span>
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
              <DropdownMenuItem onClick={() => onUpdate(id)}>
                Update
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(id)}>
                Delete
              </DropdownMenuItem>
              {showAssign && (
                <DropdownMenuItem onClick={() => onAssign(id)}>
                  Assign
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-md text-gray-800">{description}</p>
        <div className="text-sm text-muted-foreground">
          Due: {new Date(dueDate).toLocaleDateString()}
        </div>
         <div className="text-sm font-medium capitalize">
          Priority:{" "}
          <span
            className={cn(
              "px-2 py-1 rounded-full",
              priorityStyles[task.priority]
            )}
          >
            {task.priority}
          </span>
        </div>
        <div className="text-sm font-medium capitalize">
          Status:{" "}
          <span
            className={cn(
              "px-2 py-1 rounded-full",
              status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            )}
          >
            {status}
          </span>
        </div>
        <div className="w-full flex justify-center items-center">
        {showComplete && (
          <Button
            variant="default"
            size="sm"
            className="mt-2"
            onClick={() => onComplete(id)}
          >
            Mark as Complete
          </Button>
        )}</div>
      </CardContent>
    </Card>
  );
}

