import * as React from "react"
import { FormItem, FormLabel, FormMessage } from "./tanstack-form"

export function TField({ label, required, field, children }) {
  return (
    <FormItem>
      <FormLabel required={required}>{label}</FormLabel>
      {children({
        value: field.state.value,
        onChange: field.handleChange,
        onBlur: field.handleBlur,
        name: field.name,
      })}
      <FormMessage field={field} />
    </FormItem>
  )
}
