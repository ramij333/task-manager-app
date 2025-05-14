"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import API from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import Protected from "@/components/Protected"

type User = {
  _id: string
  name: string
  email: string
  role: "admin" | "manager" | "user"
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const { user } = useAuth()

  const currentUserRole = user?.role

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users")
      setUsers(res.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleRoleUpdate = async (userId: string, role: "user" | "manager") => {
    try {
      const res = await API.put(`/admin/${userId}/role`, { role })
      toast.success(`${res.data.user.name} is now a ${res.data.user.role}`)
      fetchUsers() // Refresh the list
    } catch (error: any) {
      toast.error( "Something went wrong")
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <Protected>
    <div className="max-w-5xl mx-auto p-6 space-y-8 pt-20">
      <h1 className="text-3xl font-bold text-center">All Users</h1>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                {currentUserRole === "admin" && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  {currentUserRole === "admin" && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">Assign Role</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleRoleUpdate(user._id, "user")}>
                            User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleUpdate(user._id, "manager")}>
                            Manager
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-muted/50 border-dashed border-2">
        <CardHeader>
          <CardTitle className="text-lg">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside text-sm">
            <li><strong>Admin</strong> can assign roles to users: Manager, or Normal User. Admin can also assign task to any Users.</li>
            <li><strong>Manager</strong> can assign tasks to Users only.</li>
          </ul>
          <div className="bg-white p-4 rounded-md border text-sm">
            <p><strong>Try as Manager:</strong></p>
            <p><strong>Email:</strong> manager123@gmail.com</p>
            <p><strong>Password:</strong> Password@123</p>
          </div>
        </CardContent>
      </Card>
    </div></Protected>
  )
}


