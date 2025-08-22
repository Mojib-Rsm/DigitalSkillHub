"use client";

import ToolAuthGuard from "@/components/tool-auth-guard";

export default function AiToolsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ToolAuthGuard>{children}</ToolAuthGuard>;
}
