'use client';

import {
    Calendar,
    GraduationCap,
    Home,
    LayoutDashboard,
    Settings,
    Users,
    Wallet,
    FileText,
    LogOut
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { deleteCookie } from 'cookies-next';

// Menu items.
const items = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Academic',
        url: '/dashboard/academic',
        icon: Calendar,
    },
    {
        title: 'Students',
        url: '/dashboard/students',
        icon: Users,
    },
    {
        title: 'Fees & Finance',
        url: '/dashboard/fees',
        icon: Wallet,
    },
    {
        title: 'Reports',
        url: '/dashboard/reports',
        icon: FileText,
    },
    {
        title: 'Settings',
        url: '/dashboard/settings',
        icon: Settings,
    },
];

export function AppSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const { logout, user } = useAuthStore();

    const handleLogout = () => {
        logout();
        deleteCookie('token');
        router.push('/login');
    };

    const isSuperAdmin = user?.role === 'super_admin';

    const sidebarItems = isSuperAdmin
        ? [
            {
                title: 'Dashboard',
                url: '/super-admin',
                icon: LayoutDashboard,
            },
            {
                title: 'Schools',
                url: '/super-admin/schools',
                icon: GraduationCap,
            },
            // Add other Super Admin items (Revenue, Plans) here
        ]
        : items;

    return (
        <Sidebar>
            <SidebarHeader className="p-4 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    EduERP
                </h2>
                {user && <p className="text-xs text-muted-foreground">Welcome, {user.name}</p>}
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname?.startsWith(item.url)}
                                        onClick={() => router.push(item.url)}
                                    >
                                        <button>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-sidebar-border">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-sidebar-foreground/50 px-2 font-medium uppercase tracking-wider">Settings</span>
                    <ThemeToggle />
                </div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 group">
                            <LogOut className="group-hover:translate-x-1 transition-transform" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
