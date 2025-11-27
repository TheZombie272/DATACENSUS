import * as React from "react";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface InfoTagProps {
  content: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  ariaLabel?: string;
}

export const InfoTag = ({
  content,
  title,
  className,
  size = "md",
  ariaLabel = "Información",
}: InfoTagProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  } as const;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className={cn(
            "inline-flex items-center justify-center rounded-full border border-transparent bg-transparent p-0 text-muted-foreground hover:bg-accent/5 focus:outline-none",
            className,
          )}
        >
          <Info className={sizeClasses[size]} />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          {title && <div className="text-sm font-semibold">{title}</div>}
          <div className="text-sm text-muted-foreground">{content}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InfoTag;
