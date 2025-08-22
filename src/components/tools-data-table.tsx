
"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Pen, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateTool } from "@/services/tool-service";
import type { Tool } from "@/lib/demo-data";
import { ToolDialog } from "./tool-dialog";

type ToolsDataTableProps = {
  initialTools: Tool[];
};

export default function ToolsDataTable({ initialTools }: ToolsDataTableProps) {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [filter, setFilter] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setTools(initialTools);
  }, [initialTools]);

  const handleToggle = async (tool: Tool) => {
    const originalStatus = tool.enabled;
    // Optimistic UI update
    setTools(tools.map(t => t.id === tool.id ? { ...t, enabled: !t.enabled } : t));

    const result = await updateTool(tool.id, { enabled: !tool.enabled });

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Error updating tool",
        description: result.message,
      });
      // Revert on failure
      setTools(tools.map(t => t.id === tool.id ? { ...t, enabled: originalStatus } : t));
    }
  };
  
  const handleEdit = (tool: Tool) => {
      setEditingTool(tool);
      setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
      setEditingTool(null);
      setIsDialogOpen(true);
  }

  const handleDialogSave = (savedTool: Tool) => {
      if (editingTool) {
          // Update existing tool
          setTools(tools.map(t => t.id === savedTool.id ? savedTool : t));
      } else {
          // Add new tool
          setTools([...tools, savedTool]);
      }
      setIsDialogOpen(false);
  }

  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(filter.toLowerCase()) ||
    tool.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Filter tools by name or category..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAdd}>
            <PlusCircle className="mr-2"/>
            Add New Tool
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tool</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell className="font-medium">{tool.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{tool.category}</Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={tool.enabled}
                    onCheckedChange={() => handleToggle(tool)}
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(tool)}>
                        <Pen className="mr-2 h-4 w-4"/>
                        Edit
                      </DropdownMenuItem>
                       <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                         <Trash className="mr-2 h-4 w-4"/>
                         Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ToolDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        tool={editingTool}
        onSave={handleDialogSave}
      />
    </div>
  );
}
