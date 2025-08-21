"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import LoadingTableResult from "../ui/LoadingTableResult";
import EmptyTableResult from "../ui/EmptySearchResult";
import { useState } from "react";
import Link from "next/link";
import {
  Book,
  CircleChevronRight,
  ClipboardList,
  Globe,
  Lock,
} from "lucide-react";
import quickLinks from "@/constant/QuickLinks.json";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import SecretDialogForm from "./SecretDialogForm";
import { toast } from "sonner";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [admins, setAdmins] = useState([]);

  const fetchAdmins = async (search = "") => {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await getAllAdmins(search);
      setAdmins(response.data);
    } catch (error) {
      toast.error(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <section className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Website Traffic
            </CardTitle>
            <Globe className="text-blue-500" size={24} />
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="mb-1 text-4xl font-bold">12,345</div>
            <p className="text-muted-foreground text-xs">
              Trending up this month
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <ClipboardList className="text-indigo-500" size={24} />
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="mb-1 text-4xl font-bold">534</div>
            <p className="text-muted-foreground text-xs">Up 8% this period</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <Book className="text-teal-500" size={24} />
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="mb-1 text-4xl font-bold">48</div>
            <p className="text-muted-foreground text-xs">Updated weekly</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/30 flex flex-col items-center justify-center p-6 transition-all duration-300">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="bg-primary/10 rounded-full p-3">
              <Lock className="text-primary h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">Sensitive Credentials</p>
              <p className="text-muted-foreground text-xs">
                Requires password confirmation
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full">
                  Unlock & View Secrets
                </Button>
              </DialogTrigger>
              <SecretDialogForm
                title="View Secrets"
                description="Enter your account password to view secrets."
                action={() => {}}
                value=""
                text="Confirm"
                variant=""
              />
            </Dialog>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        <div className="col-span-3">
          <h6 className="mb-2 text-lg font-bold">Booking Mail List</h6>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Email Verify</TableHead>
                <TableHead>Creation Date</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {isLoading ? (
              <>
                <LoadingTableResult col={7} />
              </>
            ) : isError ? (
              <EmptyTableResult col={7} />
            ) : (
              <TableBody>
                {admins.map((admin, idx) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.email_verified ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      {format(new Date(admin.created_at), "dd MMM, hh:mm a")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(admin.updated_at), "dd MMM, hh:mm a")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>

        <div>
          <div>
            {/* <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">No</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>

              {isLoading ? (
                <LoadingTableResult col={6} />
              ) : isError ? (
                <EmptyTableResult col={6} />
              ) : auditLogs.length === 0 ? (
                <EmptyTableResult col={6} />
              ) : (
                <TableBody>
                  {auditLogs.map((log, idx) => (
                    <TableRow key={log.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        {log.user_name && log.user_email ? (
                          <>
                            <div className="font-medium">{log.user_name}</div>
                            <div className="text-muted-foreground text-xs">
                              {log.user_email}
                            </div>
                          </>
                        ) : (
                          <span className="text-muted-foreground">Unknown</span>
                        )}
                      </TableCell>
                      <TableCell className="uppercase">
                        <Badge
                          className={`text-xs ${
                            log.action_type === "CREATE"
                              ? "bg-blue-600 text-white"
                              : log.action_type === "UPDATE"
                                ? "bg-green-600 text-white"
                                : log.action_type === "DELETE"
                                  ? "bg-red-600 text-white"
                                  : "bg-gray-600 text-white"
                          }`}
                        >
                          {log.action_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="uppercase">
                        {log.target_type}
                      </TableCell>
                      <TableCell>{log.description}</TableCell>
                      <TableCell className="text-right">
                        {format(
                          new Date(log.timestamp),
                          "dd MMM yyyy, hh:mm:ss a",
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>*/}
          </div>
          <div>
            <h6 className="mb-3 text-lg font-bold">Quick Links</h6>
            <div className="space-y-2">
              {quickLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="group border-border bg-accent/40 hover:bg-accent flex items-center justify-between rounded-xl border px-4 py-3 transition-all hover:scale-[1.02] hover:shadow-md"
                >
                  <span className="text-foreground group-hover:text-primary font-medium transition-colors">
                    {link.label}
                  </span>
                  <CircleChevronRight
                    size={18}
                    className="text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
