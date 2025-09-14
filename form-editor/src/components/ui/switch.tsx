"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const [isChecked, setIsChecked] = React.useState(false);

  React.useEffect(() => {
    if (props.checked !== undefined) {
      setIsChecked(props.checked);
    }
  }, [props.checked]);

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{
        backgroundColor: isChecked ? '#000000' : '#d1d5db', // 黒またはグレー
      }}
      onCheckedChange={(checked) => {
        setIsChecked(checked);
        props.onCheckedChange?.(checked);
      }}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-all duration-200 ease-in-out",
          "dark:bg-gray-100"
        )}
        style={{
          transform: isChecked ? 'translateX(20px)' : 'translateX(0px)',
          boxShadow: isChecked ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        }}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
