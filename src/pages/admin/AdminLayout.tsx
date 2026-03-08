import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import {
  SidebarProvider, SidebarTrigger, Sidebar, SidebarContent,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarHeader, SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard, Users, Newspaper, FileText, Home,
  Image, Video, BarChart3, MessageSquare, Settings, LogOut, Vote, Calendar, ClipboardList, Shield
} from 'lucide-react';
import logo from '@/assets/logo.png';

const menuItems = [
  { title: 'الرئيسية', url: '/admin', icon: LayoutDashboard },
  { title: 'إدارة المرشحين', url: '/admin/candidates', icon: Users },
  { title: 'إدارة الأخبار', url: '/admin/news', icon: Newspaper },
  { title: 'البرنامج الانتخابي', url: '/admin/program', icon: FileText },
  { title: 'الصفحة الرئيسية', url: '/admin/homepage', icon: Home },
  { title: 'مكتبة الصور', url: '/admin/media', icon: Image },
  { title: 'الفيديوهات', url: '/admin/videos', icon: Video },
  { title: 'استطلاعات الرأي', url: '/admin/polls', icon: Vote },
  { title: 'الفعاليات', url: '/admin/events', icon: Calendar },
  { title: 'الرسائل والاقتراحات', url: '/admin/messages', icon: MessageSquare },
  { title: 'الإحصائيات', url: '/admin/stats', icon: BarChart3 },
  { title: 'إدارة المشرفين', url: '/admin/users', icon: Shield },
  { title: 'سجل العمليات', url: '/admin/audit', icon: ClipboardList },
  { title: 'الإعدادات', url: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const { isAuthenticated, logout, user } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div dir="rtl">
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full">
          <Sidebar side="right" collapsible="icon">
            <SidebarHeader className="border-b p-4">
              <Link to="/admin" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center overflow-hidden shrink-0">
                  <img src={logo} alt="شعار" className="w-8 h-8 object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="font-heading font-bold text-sm truncate">لوحة التحكم</p>
                  <p className="text-xs text-muted-foreground truncate">عهد الشباب</p>
                </div>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>القائمة</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map(item => (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                          <Link to={item.url}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{user?.username}</span>
                <Button variant="ghost" size="icon" onClick={() => { logout(); navigate('/admin/login'); }} title="تسجيل الخروج">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>

          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 flex items-center border-b bg-card px-4 gap-3 shrink-0">
              <SidebarTrigger />
              <h1 className="font-heading font-bold text-lg truncate">
                {menuItems.find(i => i.url === location.pathname)?.title || 'لوحة التحكم'}
              </h1>
              <div className="mr-auto">
                <Link to="/" className="text-xs text-muted-foreground hover:text-primary">
                  ← العودة للموقع
                </Link>
              </div>
            </header>
            <main className="flex-1 p-4 md:p-6 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
