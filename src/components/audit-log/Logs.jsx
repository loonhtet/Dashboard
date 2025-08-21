"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "../ui/button";
import { CalendarIcon, ListFilter, RotateCcw, Undo, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuditLogs } from "@/app/audit-log/action";
import { toast } from "sonner";
import LoadingTableResult from "../ui/LoadingTableResult";
import EmptyTableResult from "../ui/EmptySearchResult";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const Logs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);

  const [date, setDate] = useState();
  const [actionType, setActionType] = useState("");

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await getAuditLogs({
        date,
        actionType: actionType || null,
      });
      setAuditLogs(response.data || []);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setDate(null);
    setActionType("");
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [date, actionType]);

  return (
    <>
      {/* Start Header */}
      <header className="mb-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <div className="flex w-fit gap-2">
          <Select value={actionType} onValueChange={setActionType}>
            <SelectTrigger
              className={`w-[180px] ${
                actionType ? "text-white" : "text-muted-foreground"
              }`}
            >
              <ListFilter
                className={actionType ? "text-white" : "text-muted-foreground"}
              />
              <SelectValue placeholder="Select an action" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Actions</SelectLabel>
                <SelectItem value="CREATE">CREATE</SelectItem>
                <SelectItem value="UPDATE">UPDATE</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-fit justify-start text-left font-normal ${
                  date ? "text-white" : "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleResetFilters}>
                <RotateCcw />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset Filter</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
      {/* End Header */}

      {/* Start Table  */}
      <Table>
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
                <TableCell className="uppercase">{log.target_type}</TableCell>
                <TableCell>{log.description}</TableCell>
                <TableCell className="text-right">
                  {format(new Date(log.timestamp), "dd MMM yyyy, hh:mm:ss a")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {/* End Table  */}
    </>
  );
};

export default Logs;
1;
