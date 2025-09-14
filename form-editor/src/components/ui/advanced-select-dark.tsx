"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectOption {
    value: string
    label: string
    description?: string
    icon?: React.ReactNode
}

interface AdvancedSelectDarkProps {
    options: SelectOption[]
    value?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    searchPlaceholder?: string
    className?: string
    disabled?: boolean
    size?: "sm" | "default" | "lg"
}

function AdvancedSelectDark({
    options,
    value,
    onValueChange,
    placeholder = "選択してください",
    searchPlaceholder = "検索...",
    className,
    disabled = false,
    size = "default"
}: AdvancedSelectDarkProps) {
    const [open, setOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [selectedOption, setSelectedOption] = React.useState<SelectOption | undefined>(
        options.find(option => option.value === value)
    )

    const filteredOptions = React.useMemo(() => {
        if (!searchTerm) return options
        return options.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            option.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [options, searchTerm])

    const handleValueChange = (newValue: string) => {
        const option = options.find(opt => opt.value === newValue)
        setSelectedOption(option)
        onValueChange?.(newValue)
        setOpen(false)
        setSearchTerm("")
    }

    const sizeClasses = {
        sm: "h-10 px-3 py-2 text-sm",
        default: "h-12 px-4 py-3 text-base",
        lg: "h-14 px-5 py-4 text-lg"
    }

    return (
        <SelectPrimitive.Root open={open} onOpenChange={setOpen}>
            <SelectPrimitive.Trigger
                className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-none border-2 border-gray-600 bg-gray-800 text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-gray-700 hover:border-gray-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-50",
                    sizeClasses[size],
                    className
                )}
                disabled={disabled}
            >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    {selectedOption?.icon && (
                        <div className="flex-shrink-0 text-gray-300">
                            {selectedOption.icon}
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">
                            {selectedOption?.label || placeholder}
                        </div>
                        {selectedOption?.description && (
                            <div className="text-sm text-gray-400 truncate">
                                {selectedOption.description}
                            </div>
                        )}
                    </div>
                </div>
                <ChevronDownIcon
                    className={cn(
                        "h-5 w-5 text-gray-300 transition-transform duration-200 flex-shrink-0",
                        open && "rotate-180"
                    )}
                />
            </SelectPrimitive.Trigger>

            <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                    className={cn(
                        "relative z-50 max-h-96 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-none border-2 border-gray-600 bg-gray-800 shadow-2xl",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
                        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                    )}
                    position="popper"
                    sideOffset={4}
                >
                    {/* 検索バー */}
                    <div className="border-b border-gray-600 p-3">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-none border border-gray-600 bg-gray-700 px-10 py-2 text-sm text-white placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                            />
                        </div>
                    </div>

                    <SelectPrimitive.Viewport className="p-1">
                        {filteredOptions.length === 0 ? (
                            <div className="py-6 text-center text-sm text-gray-400">
                                検索結果が見つかりません
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <SelectPrimitive.Item
                                    key={option.value}
                                    value={option.value}
                                    className={cn(
                                        "relative flex cursor-pointer items-center gap-3 rounded-none px-4 py-3 text-sm outline-none transition-colors duration-150 ease-in-out",
                                        "hover:bg-gray-700 focus:bg-blue-900/30 focus:text-blue-300",
                                        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    )}
                                    onSelect={() => handleValueChange(option.value)}
                                >
                                    {option.icon && (
                                        <div className="flex-shrink-0 text-gray-300">
                                            {option.icon}
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="font-medium">{option.label}</div>
                                        {option.description && (
                                            <div className="text-sm text-gray-400">{option.description}</div>
                                        )}
                                    </div>
                                    <SelectPrimitive.ItemIndicator className="flex-shrink-0">
                                        <CheckIcon className="h-5 w-5 text-blue-400" />
                                    </SelectPrimitive.ItemIndicator>
                                </SelectPrimitive.Item>
                            ))
                        )}
                    </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    )
}

export { AdvancedSelectDark, type SelectOption }
