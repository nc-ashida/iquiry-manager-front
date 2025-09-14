"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CheckboxDemo() {
    return (
        <div className="flex flex-col gap-6">
            {/* 基本的なチェックボックス */}
            <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>

            {/* 説明付きチェックボックス */}
            <div className="flex items-start gap-3">
                <Checkbox id="terms-2" defaultChecked />
                <div className="grid gap-2">
                    <Label htmlFor="terms-2">Accept terms and conditions</Label>
                    <p className="text-muted-foreground text-sm">
                        By clicking this checkbox, you agree to the terms and conditions.
                    </p>
                </div>
            </div>

            {/* 無効化されたチェックボックス */}
            <div className="flex items-start gap-3">
                <Checkbox id="toggle" disabled />
                <Label htmlFor="toggle" className="text-muted-foreground">Enable notifications</Label>
            </div>

            {/* 画像のデザインに合わせたチェックボックス */}
            <div className="flex items-start gap-3">
                <Checkbox
                    id="email-confirmation"
                    defaultChecked
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                />
                <div className="grid gap-1.5">
                    <Label htmlFor="email-confirmation" className="text-sm font-medium text-gray-800">
                        送信控えメールを自動送信する
                    </Label>
                    <p className="text-muted-foreground text-sm">
                        チェックを入れると、フォーム送信時に自動で
                    </p>
                </div>
            </div>
        </div>
    )
}
