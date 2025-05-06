// components/ProductOptionSelector.tsx
import React from "react"
import { Control, UseFormSetValue } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Icons } from "@/components/icons"
import { Separator } from "./ui/separator"

type Option = {
  id: string
  label: string
}

type ProductOptionSelectorProps = {
  control: Control<any>
  setValue: UseFormSetValue<any>
  name: string
  label: string
  description?: string
  options: Option[]
  currentValue: string
  disabled?: boolean
  onValueChange?: (value: string) => void
}

export function ProductOptionSelector({
  control,
  setValue,
  name,
  label,
  description,
  options,
  currentValue,
  disabled = false,
  onValueChange,
}: ProductOptionSelectorProps) {
  const handleSelect = (optionId: string) => {
    if (disabled) return
    setValue(name, optionId, { shouldValidate: true })
    if (onValueChange) {
      onValueChange(optionId)
    }
  }

  return (
    <div className={`w-full space-y-2 ${disabled ? "opacity-50" : ""}`}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>{label}</FormLabel>
            {description && (
              <p className="pb-4 text-xs text-muted-foreground">
                {description}
              </p>
            )}
            <FormControl>
              <div className="grid w-full grid-cols-2 gap-2 lg:grid-cols-3">
                {options.map((option) => (
                  <div
                    key={option.id}
                    className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border p-2 ${
                      currentValue === option.id
                        ? "border-primary bg-primary/10"
                        : ""
                    } ${disabled ? "cursor-not-allowed" : "hover:bg-muted/20"}`}
                    onClick={() => handleSelect(option.id)}
                    aria-disabled={disabled}
                  >
                    <p className="text-sm tracking-tighter text-primary">
                      {option.label}
                    </p>
                    <Icons.file
                      strokeWidth={1}
                      className="h-4 w-4 fill-gray-200 stroke-gray-300"
                    />
                  </div>
                ))}
                {options.length === 0 && !disabled && (
                  <p className="col-span-full text-sm text-muted-foreground">
                    No options available based on previous selections.
                  </p>
                )}
                {options.length === 0 && disabled && (
                  <p className="col-span-full text-sm text-muted-foreground">
                    Please make a selection in the previous step.
                  </p>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator className="my-4" />
    </div>
  )
}
