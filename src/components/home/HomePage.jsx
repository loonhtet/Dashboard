"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, HelpCircle, Loader2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Book,
  CircleChevronRight,
  ClipboardList,
  Globe,
  Lock,
} from "lucide-react";
import quickLinks from "@/constant/QuickLinks.json";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import SecretDialogForm from "./SecretDialogForm";
import { getBookingsByMonth } from "@/app/action";
import { Separator } from "../ui/separator";

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "var(--chart-1)",
  },
};

const HomePage = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getBookingsByMonth();
      setChartData(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <main>
      {/* Top Cards */}
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

      {/* Booking Bar Chart + Quick Links */}
      <section className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Bookings Per Month</CardTitle>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="text-primary mx-auto animate-spin" />
                </div>
              ) : (
                <ChartContainer config={chartConfig}>
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                      dataKey="bookings"
                      fill="var(--color-bookings)"
                      radius={8}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>

            <div className="flex-col items-start gap-2 p-4 text-sm">
              <div className="flex gap-2 leading-none font-medium">
                Customer Booking Insights <Calendar className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground mt-2 leading-none">
                Visualizing monthly booking counts for better planning
              </div>
            </div>
          </Card>
        </div>

        <div>
          <h6 className="mb-3 text-lg font-bold">Quick Links</h6>
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-1">
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
          <Separator className="my-4" />
          <div
            href="/help"
            className="border-border bg-primary-foreground mt-4 flex items-center justify-between rounded-xl border px-6 py-5"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              {/* Leading Icon */}
              <HelpCircle
                size={24}
                className="text-primary group-hover:text-primary/80 transition-colors"
              />
              <p className="text-foreground text-lg font-semibold">
                Help & Support
              </p>
              <p className="text-muted-foreground text-center text-sm">
                Get guidance on using the dashboard
              </p>
              <Link href="/help">
                <Button>View</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
