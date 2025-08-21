
import { getAllUsers } from "@/services/user-service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import UserRoleUpdater from "@/components/user-role-updater";

export default async function UsersPage() {
    const users = await getAllUsers();
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Admin: User Management</h1>
                <p className="text-muted-foreground">
                    View and manage all users in the system.
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>
                        A list of all registered users. You can change their roles here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Credits</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.profile_image} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            {user.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.credits}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">Active</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <UserRoleUpdater userId={user.id} currentRole={user.role} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
