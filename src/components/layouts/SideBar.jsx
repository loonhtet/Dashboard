"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
  House,
  User2,
  ChevronDown,
  ChevronsUp,
  ShieldUser,
  FileClock,
  Loader2,
  MessageCircle,
  BadgeInfo,
  FileText,
  Layers2,
  CalendarCheck2,
} from "lucide-react";

const icons = {
  FileClock: FileClock,
  ShieldUser: ShieldUser,
  BadgeInfo: BadgeInfo,
  House: House,
  User2: User2,
  ChevronDown: ChevronDown,
  ChevronsUp: ChevronsUp,
  MessageCircle: MessageCircle,
  FileText: FileText,
  Layers2: Layers2,
  CalendarCheck2: CalendarCheck2,
};

import Link from "next/link";

import items from "@/constant/SideBar.json";
import { changePassword, signOut } from "@/app/action";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import InputBox from "../ui/InputBox";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function AppSidebar({ name }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await changePassword(data);
      toast.success(response.message);
      setOpenDialog(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.collapsible ? (
                  <Collapsible key={item.title} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex w-full items-center justify-between px-3 py-5.5">
                          <div className="flex items-center gap-2">
                            {item.icon &&
                              (() => {
                                const Icon = icons[item.icon];
                                return Icon ? (
                                  <Icon className="h-4 w-4" />
                                ) : null;
                              })()}
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children?.map((sub) => (
                            <SidebarMenuSubItem key={sub.title} asChild>
                              <Link href={sub.url} className="w-full">
                                <SidebarMenuButton className="cursor-pointer px-3 py-5.5">
                                  {sub.title}
                                </SidebarMenuButton>
                              </Link>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className="flex items-center gap-2 px-3 py-5.5"
                      >
                        {item.icon &&
                          (() => {
                            const Icon = icons[item.icon];
                            return Icon ? <Icon className="h-4 w-4" /> : null;
                          })()}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <User2 /> {name}
                  <ChevronsUp className="ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[230px]">
                <DropdownMenuItem>
                  <form action={signOut} className="w-full">
                    <button
                      type="submit"
                      className="w-full cursor-pointer text-left text-sm"
                    >
                      Sign Out
                    </button>
                  </form>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setOpenDialog(true);
                  }}
                >
                  <button className="w-full cursor-pointer text-left text-sm">
                    Change Password
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
              open={openDialog}
              onOpenChange={(open) => {
                setOpenDialog(open);
                if (!open) reset();
              }}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                  <InputBox
                    label="Current Password"
                    name="currentpassword"
                    type="password"
                    register={register}
                    errors={errors}
                    validation={{ required: "Current password is required" }}
                  />
                  <InputBox
                    label="New Password"
                    name="newpassword"
                    type="password"
                    register={register}
                    errors={errors}
                    validation={{ required: "New password is required" }}
                  />
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="animate-spin" />}
                    Change
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
