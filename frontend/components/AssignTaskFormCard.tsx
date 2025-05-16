'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import API from '@/services/api';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

type AssignTaskFormValues = z.infer<typeof formSchema>;

interface AssignTaskFormCardProps {
  taskId: string;
  onClose: () => void;
}

export const AssignTaskFormCard: React.FC<AssignTaskFormCardProps> = ({
  taskId,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<AssignTaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: AssignTaskFormValues) => {
  setLoading(true);
  try {
    await API.put(`/tasks/${taskId}/assign`, {
      assigneeEmail: data.email,
    });

    toast.success(`Task successfully assigned to ${data.email}`);
    onClose();
  } catch (error: any) {
    console.error("Failed to assign task: ", error)
    toast.error("Failed to assign task");
  } finally {
    setLoading(false);
  }
};


  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Assign Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter user email"
            {...form.register('email')}
            disabled={loading}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
