import { Button } from "~/app/_components/ui/button";
import { Pencil, Check, X } from "lucide-react";

import { cn } from "~/lib/utils";

export function IconButton({
  className,
  type,
  onClick,
  icon,
  children,
}: {
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      className={cn("p-0 hover:bg-transparent", className)}
      type={type}
      onClick={onClick}
    >
      {icon}
      {children}
    </Button>
  );
}

export function EditButton({ onClick }: { onClick?: () => void }) {
  return (
    <IconButton
      onClick={onClick}
      icon={<Pencil style={{ width: "70%", height: "70%" }} />}
    />
  );
}

export function DeleteButton({ onClick }: { onClick?: () => void }) {
  return (
    <IconButton
      onClick={onClick}
      icon={<X style={{ width: "70%", height: "70%" }} />}
    />
  );
}

export function ConfirmButton({ onClick }: { onClick?: () => void }) {
  return (
    <IconButton
      onClick={onClick}
      icon={<Check style={{ width: "70%", height: "70%" }} />}
    />
  );
}
