import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/SideBar";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { getCurrentUser } from "@/app/action";

const WebLayout = async ({ children }) => {
  const user = await getCurrentUser();

  return (
    <SidebarProvider>
      <AppSidebar name={user?.name} />
      <main className="w-full lg:w-[83.3%]">
        <SidebarTrigger />
        <DashboardLayout>{children}</DashboardLayout>
      </main>
    </SidebarProvider>
  );
};

export default WebLayout;
