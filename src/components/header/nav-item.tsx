import { cn } from "@/utils";

export default function NavItem({
  children,
  className,
  childClassName
}: {
  children: React.ReactNode,
  className?: string,
  childClassName?: string,
}) {
  return (
    <span className={cn("group relative text-zinc-600 group-hover:text-violet-600 transition-all duration-300 flex items-center gap-1", className)}>
      {children}
      <span className={cn("absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300", childClassName)}></span>
    </span>
  )
}