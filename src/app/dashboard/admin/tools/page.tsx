
import { getTools } from "@/services/tool-service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import ToolsDataTable from "@/components/tools-data-table";

export default async function ToolsPage() {
    const tools = await getTools();
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Admin: Tool Management</h1>
                <p className="text-muted-foreground">
                    Add, edit, and manage all AI tools available in the application.
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>All Tools</CardTitle>
                    <CardDescription>
                        A list of all AI tools. You can enable, disable, or edit them here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <ToolsDataTable initialTools={tools} />
                </CardContent>
            </Card>
        </div>
    )
}

    