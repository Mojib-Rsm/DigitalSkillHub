
'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { updateUserRole } from '@/app/dashboard/admin/users/actions';
import { useToast } from '@/hooks/use-toast';
import { Check, ChevronsUpDown } from 'lucide-react';

type UserRoleUpdaterProps = {
  userId: string;
  currentRole: 'user' | 'admin';
};

export default function UserRoleUpdater({ userId, currentRole }: UserRoleUpdaterProps) {
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRoleChange = async () => {
    if (selectedRole === currentRole) return;

    setIsLoading(true);
    const result = await updateUserRole(userId, selectedRole);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Success',
        description: result.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
      // Revert the selection on failure
      setSelectedRole(currentRole);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'user' | 'admin')}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={handleRoleChange}
        disabled={isLoading || selectedRole === currentRole}
        size="sm"
        variant="ghost"
      >
        {isLoading ? 'Saving...' : <Check className='w-4 h-4'/>}
      </Button>
    </div>
  );
}
