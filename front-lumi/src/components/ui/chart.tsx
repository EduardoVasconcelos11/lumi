import React from "react"
import { cn } from "../../lib/utils"

const Chart = React.forwardRef(({ className, ...props }, ref) => {
  return <div className={cn("relative", className)} ref={ref} {...props} />
})
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef(({ className, ...props }, ref) => {
  return <div className={cn("h-full w-full", className)} ref={ref} {...props} />
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      className={cn("pointer-events-none absolute z-50 rounded-md border bg-popover p-2 text-sm shadow-md", className)}
      ref={ref}
      {...props}
    />
  )
})
ChartTooltip.displayName = "ChartTooltip"

function ChartTooltipContent({ items, className }) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-xs">{item.label}:</span>
          <span className="font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  )
}
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = React.forwardRef(({ className, ...props }, ref) => {
  return <div className={cn("flex items-center space-x-2", className)} ref={ref} {...props} />
})
ChartLegend.displayName = "ChartLegend"

function ChartLegendItem({ name, color }) {
  return (
    <div className="flex items-center space-x-1 text-sm">
      <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{name}</span>
    </div>
  )
}
ChartLegendItem.displayName = "ChartLegendItem"

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem }

