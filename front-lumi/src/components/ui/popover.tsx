"use client"

import React, { createContext, useContext, useState } from "react"
import { cn } from "../../lib/utils"

const PopoverContext = createContext({})

function Popover({ children }) {
  const [open, setOpen] = useState(false)
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative">{children}</div>
    </PopoverContext.Provider>
  )
}

const PopoverTrigger = React.forwardRef(({ asChild, children, ...props }, ref) => {
  const { open, setOpen } = useContext(PopoverContext)
  const Comp = asChild ? (
    React.cloneElement(children, {
      ref,
      onClick: (e) => {
        setOpen(!open)
        children.props.onClick?.(e)
      },
      ...props,
    })
  ) : (
    <button ref={ref} onClick={() => setOpen(!open)} {...props}>
      {children}
    </button>
  )

  return Comp
})
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open } = useContext(PopoverContext)

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }

