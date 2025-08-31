"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search, Trash } from "lucide-react";
import { format } from "date-fns";
import {
  getAllBookings,
  deleteBooking,
  deleteOldBookings,
} from "@/app/booking/action";
import EmptyTableResult from "../ui/EmptySearchResult";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import LoadingTableResult from "../ui/LoadingTableResult";
import DialogBox from "../ui/DialogBlox";
import BookingDeleteForm from "@/components/booking/BookingDeleteForm";
import BookingDetailModal from "@/components/booking/BookingDetailModal";
import { Badge } from "../ui/badge";
import { Pagination } from "@/components/ui/pagination"; // Shadcn Pagination
import PagePagination from "../ui/PagePagination";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const BookingHome = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
  });

  const fetchBookings = async (search = "", page = 1) => {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await getAllBookings(search, page, pagination.pageSize);
      setBookings(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      toast.error(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBooking = async (data) => {
    const id = data.get("id");
    if (!id) {
      toast.error("Could not find booking to delete.");
      return;
    }

    setDeletingId(id);

    try {
      await deleteBooking(id, currentUser);
      fetchBookings(searchQuery, pagination.currentPage); // Refresh current page
      toast.success("Booking deleted successfully!");
    } catch (error) {
      console.error("Failed to delete booking:", error);
      toast.error("Failed to delete booking. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteOldBookings = async () => {
    setIsLoading(true);
    try {
      const response = await deleteOldBookings(currentUser);
      toast.success(response.message);
      fetchBookings(searchQuery, pagination.currentPage);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete old bookings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <header className="mb-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <div className="flex w-full max-w-sm gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchBookings(searchQuery);
            }}
            className="flex flex-1 gap-2"
          >
            <Input
              name="search"
              type="text"
              placeholder="Search by name, phone, or service"
              className="mt-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="outline">
              <Search />
            </Button>
          </form>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteOldBookings}
              >
                <Trash />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete all bookings older than one month</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>

      <div className="scrollbar scrollbar-thumb-sky-700 scrollbar-track-sky-300 w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <LoadingTableResult col={9} />
          ) : isError ? (
            <EmptyTableResult col={9} />
          ) : (
            <TableBody>
              {bookings.map((booking, idx) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {(pagination.currentPage - 1) * pagination.pageSize +
                      idx +
                      1}
                  </TableCell>
                  <TableCell>{booking.full_name}</TableCell>
                  <TableCell>{booking.email_address}</TableCell>
                  <TableCell>{booking.phone_number}</TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {booking.note || "-"}
                  </TableCell>
                  <TableCell>
                    {format(
                      new Date(booking.created_at),
                      "dd MMM yyyy, hh:mm a",
                    )}
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <DialogBox
                      text={"Details"}
                      variant={"secondary"}
                      content={
                        <BookingDetailModal
                          title={`Booking Details`}
                          datas={booking}
                        />
                      }
                    />
                    <DialogBox
                      text={"Delete"}
                      variant={"destructive"}
                      content={
                        <BookingDeleteForm
                          title={`Deleting ${booking.full_name}`}
                          description="This action cannot be undone. This will permanently delete booking data."
                          action={handleDeleteBooking}
                          value={booking.id}
                          text={"Delete"}
                          variant={"destructive"}
                          loading={deletingId === booking.id}
                        />
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <PagePagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(page) => fetchBookings(searchQuery, page)}
          />
        </div>
      )}
    </>
  );
};

export default BookingHome;
