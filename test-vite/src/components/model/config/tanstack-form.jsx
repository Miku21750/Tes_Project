import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function FormItem({ className, ...props }) {
  return <div className={cn("space-y-1", className)} {...props} />
}

export function FormLabel({
  className,
  required,
  children,
  ...props
}) {
  return (
    <Label className={cn("text-sm font-medium", className)} {...props}>
      {children}
      {required ? <span className="text-red-600"> *</span> : null}
    </Label>
  )
}

export function FormMessage({ field }) {
  const errors = field.state.meta.errors
  if (!errors?.length) return null
  return <p className="text-sm text-red-600">{String(errors[0])}</p>
}
