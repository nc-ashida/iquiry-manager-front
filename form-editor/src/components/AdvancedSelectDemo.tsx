"use client"

import { useState } from "react"
import { AdvancedSelect, type SelectOption } from "@/components/ui/advanced-select"
import { AdvancedSelectDark } from "@/components/ui/advanced-select-dark"
import { User, CreditCard, Eye, Code, Crown } from "lucide-react"

const roleOptions: SelectOption[] = [
    {
        value: "viewer",
        label: "Viewer",
        description: "Can view and comment.",
        icon: <Eye className="h-4 w-4" />
    },
    {
        value: "developer",
        label: "Developer",
        description: "Can view, comment and edit.",
        icon: <Code className="h-4 w-4" />
    },
    {
        value: "billing",
        label: "Billing",
        description: "Can view, comment and manage billing.",
        icon: <CreditCard className="h-4 w-4" />
    },
    {
        value: "owner",
        label: "Owner",
        description: "Admin-level access to all resources.",
        icon: <Crown className="h-4 w-4" />
    }
]

const userOptions: SelectOption[] = [
    {
        value: "sofia",
        label: "Sofia Davis",
        description: "sofia@example.com",
        icon: <User className="h-4 w-4" />
    },
    {
        value: "jackson",
        label: "Jackson Le",
        description: "jackson@example.com",
        icon: <User className="h-4 w-4" />
    },
    {
        value: "isabella",
        label: "Isabella Ng",
        description: "isabella@example.com",
        icon: <User className="h-4 w-4" />
    }
]

export default function AdvancedSelectDemo() {
    const [selectedRole, setSelectedRole] = useState<string>("")
    const [selectedUser, setSelectedUser] = useState<string>("")
    const [isDarkMode, setIsDarkMode] = useState(false)

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">高度なドロップダウンデモ</h1>
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-none border border-black transition-colors"
                >
                    {isDarkMode ? "ライトモード" : "ダークモード"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ライトモード */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">ライトモード</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ユーザー役割を選択
                            </label>
                            <AdvancedSelect
                                options={roleOptions}
                                value={selectedRole}
                                onValueChange={setSelectedRole}
                                placeholder="役割を選択してください"
                                searchPlaceholder="役割を検索..."
                                size="default"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ユーザーを選択
                            </label>
                            <AdvancedSelect
                                options={userOptions}
                                value={selectedUser}
                                onValueChange={setSelectedUser}
                                placeholder="ユーザーを選択してください"
                                searchPlaceholder="ユーザーを検索..."
                                size="default"
                            />
                        </div>
                    </div>
                </div>

                {/* ダークモード */}
                <div className="space-y-6 bg-gray-900 p-6 rounded-none">
                    <h2 className="text-xl font-semibold text-white">ダークモード</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                ユーザー役割を選択
                            </label>
                            <AdvancedSelectDark
                                options={roleOptions}
                                value={selectedRole}
                                onValueChange={setSelectedRole}
                                placeholder="役割を選択してください"
                                searchPlaceholder="役割を検索..."
                                size="default"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                ユーザーを選択
                            </label>
                            <AdvancedSelectDark
                                options={userOptions}
                                value={selectedUser}
                                onValueChange={setSelectedUser}
                                placeholder="ユーザーを選択してください"
                                searchPlaceholder="ユーザーを検索..."
                                size="default"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 選択結果の表示 */}
            <div className="bg-gray-50 p-6 rounded-none border-2 border-gray-300">
                <h3 className="text-lg font-semibold mb-4">選択結果</h3>
                <div className="space-y-2">
                    <p><strong>選択された役割:</strong> {selectedRole || "未選択"}</p>
                    <p><strong>選択されたユーザー:</strong> {selectedUser || "未選択"}</p>
                </div>
            </div>
        </div>
    )
}
