import { toast as sonnerToast } from 'sonner'

interface ToastProps {
  description: string
  duration?: number
  variant?: "default" | "destructive"
}

export function useToast() {
  const toast = ({ description, duration = 2000, variant = "default" }: ToastProps) => {
    if (variant === "destructive") {
      sonnerToast.error(description, {
        duration,
      })
    } else {
      sonnerToast.success(description, {
        duration,
      })
    }
  }

  return { toast }
} 