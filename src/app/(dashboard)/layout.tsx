import Sidebar             from "@/components/layout/Sidebar";
import Header              from "@/components/layout/Header";
import ChatBot             from "@/components/chatbot";
import NavigationProgress  from "@/components/layout/NavigationProgress";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <NavigationProgress />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <ChatBot />
    </div>
  );
}
