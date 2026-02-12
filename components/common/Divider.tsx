import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
}

const Divider = ({ className }: DividerProps) => {
  return <div className={cn("h-[1px] bg-slate-200", className)} />;
};

export default Divider;
