"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function Select({ children, value, onValueChange, placeholder }: any) {
  return (
    <div className="relative">
      <select
        className="w-full rounded-xl border p-2 focus:ring-2 focus:ring-primary"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
    </div>
  )
}

export function SelectItem({ value, children }: any) {
  return <option value={value}>{children}</option>
}
