import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, BookOpen, Layers, MessageSquare, LogOut, Menu, Languages } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const { profile, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'lessons', label: 'Bài học AI', icon: BookOpen },
    { id: 'translation', label: 'Dịch thuật', icon: Languages },
    { id: 'vocabulary', label: 'Từ vựng', icon: Layers },
    { id: 'tutor', label: 'Gia sư AI', icon: MessageSquare },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full py-6">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center rotate-3">
          <span className="text-white font-bold">D</span>
        </div>
        <span className="font-bold text-xl tracking-tight">Deutsch Meister</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                activeTab === item.id
                  ? 'bg-zinc-100 text-zinc-900 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 mt-auto">
        <div className="bg-zinc-50 p-4 rounded-3xl mb-4 border border-zinc-100">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.photoURL} />
              <AvatarFallback>{profile?.displayName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{profile?.displayName}</p>
              <p className="text-xs text-zinc-500">Trình độ {profile?.level}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => logout()}
            className="w-full justify-start text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
          >
            <LogOut size={16} className="mr-2" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:block w-72 border-r border-zinc-100">
        <NavContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="lg:hidden h-16 border-bottom border-zinc-100 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
            <span className="font-bold">Deutsch Meister</span>
          </div>
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon"><Menu /></Button>} />
            <SheetContent side="left" className="p-0 w-72">
              <NavContent />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-y-auto bg-zinc-50/30 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
