'use client';

import { FileText, Home, HelpCircle, PenTool, Inbox, Send } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter
} from '@/components/ui/sidebar';

// Menu items
const items = [
  {
    title: "フォーム管理",
    url: "/",
    icon: Home,
  },
  {
    title: "署名管理",
    url: "/signatures",
    icon: PenTool,
  },
];

const mailItems = [
  {
    title: "受信",
    url: "/mail/inbox",
    icon: Inbox,
  },
  {
    title: "送信",
    url: "/mail/sent",
    icon: Send,
  },
];

const settingsItems = [
  {
    title: "ヘルプ",
    url: "/help",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-900">フォームエディタ</span>
            <span className="text-xs text-gray-500">v1.0.0</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-gray-600">FORM</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-gray-600">MAIL</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mailItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-gray-600">Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2 text-xs text-gray-500">
          © 2024 Form Editor
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
