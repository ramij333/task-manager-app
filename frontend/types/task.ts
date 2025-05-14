export type Priority = "low" | "medium" | "high";
export type Status = "pending" | "completed";
export type RecurringType = "daily" | "weekly" | "monthly";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  creatorId: string;
  assigneeId?: string;
  recurring: boolean;
  recurringType?: RecurringType;
  completedDates: string[];
  completedThisCycle: boolean
}


