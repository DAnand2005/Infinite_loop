
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
    icon: LucideIcon;
    title: string;
    description: string;
    children?: ReactNode;
    className?: string;
}

export function EmptyState({ icon: Icon, title, description, children, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg bg-muted/50", className)}>
            <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold font-headline">{title}</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">{description}</p>
            {children && <div className="mt-6">{children}</div>}
        </div>
    )
}
