import { HTMLAttributes } from "react"

// REST types

export type Category = "Health" | "All" | "Education" | "E-commerce"

export type Template = {
  name: string
  created: string
  category: (Category)[]
  description: string
  link: string
}

// loader props
export type LoaderComponent = {
  type?: "spinner" | "pulse"
  customIcon?: any
  width?: string
  height?: string
  iconSize?: number
  color?: string
  size?: string
  withBackground?: boolean
} & HTMLAttributes<HTMLDivElement>
// end

// Input Props
export type InputProps = {
  id?: string
  label?: string
  placeholder?: string
  defaultValue?: string
  corners?: "rounded" | "box"
  disabled?: boolean
  icon?: string
  clearButton?: boolean
  background?: string
  iconRight?: boolean
  iconBorder?: boolean
  color?: string
  onError?: () => any
  validate?: "alpha" | "email" | "number"
  type?: "email" | "text" | "password" | "number" | "date"
  size?: "xs" | "sm" | "md" | "lg"
  successMessage?: string
  errorMessage?: string
  onInputChange?: (value: string) => any
} & HTMLAttributes<HTMLInputElement>
// end

// select props
export type SelectComponent = {
  id?: string
  label?: string
  placeholder?: string
  defaultSelected?: string
  disabled?: boolean
  options?: string[]
  color?: string
  corners?: "box" | "rounded"
  validate?: "alpha" | "email" | "number"
  size?: "sm" | "md" | "lg"
  onInputSelect?: (value: string) => any
} & HTMLAttributes<HTMLInputElement>

// loader props
