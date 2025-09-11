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
import { Search } from "lucide-react";
import { format } from "date-fns";
import EmptyTableResult from "../ui/EmptySearchResult";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import LoadingTableResult from "../ui/LoadingTableResult";

import DialogBox from "../ui/DialogBlox";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { deleteService, getAllServices } from "@/app/services/action";
import ServicesDeleteForm from "./ServicesDeleteForm";

const ServicesHome = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState([]);

  const fetchServices = async (search = "") => {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await getAllServices(search);
      setServices(response?.data ?? []);
    } catch (error) {
      toast.error(error.message);
      setIsError(true);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteServices = async (data) => {
    const id = data.get("id");
    if (!id) {
      toast.error("Could not find services to delete.");
      return;
    }

    setDeletingId(id);

    try {
      await deleteService(id, currentUser);
      fetchServices();
      toast.success("Service deleted successfully!");
    } catch (error) {
      console.error("Failed to delete Service:", error);
      toast.error("Failed to delete Service. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <>
      <header className="mb-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <h1 className="text-2xl font-bold">Services</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchServices(searchQuery);
          }}
          className="flex w-full max-w-sm gap-2"
        >
          <Input
            name="search"
            type="text"
            placeholder="Search by title"
            className="mt-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="outline">
            <Search />
          </Button>
        </form>
      </header>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Creation Date</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <LoadingTableResult col={8} />
        ) : isError ? (
          <EmptyTableResult col={8} />
        ) : (services?.length ?? 0) === 0 ? (
          <EmptyTableResult col={6} />
        ) : (
          <TableBody>
            {services.map((service, idx) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>{service.title}</TableCell>
                <TableCell>{service.description || "N/A"}</TableCell>
                <TableCell>{service.image_url || "N/A"} images</TableCell>
                <TableCell>
                  {format(new Date(service.created_at), "dd MMM yyyy, hh:mm a")}
                </TableCell>
                <TableCell>
                  {format(new Date(service.updated_at), "dd MMM yyyy, hh:mm a")}
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <Link href={`/app/services/${service.slug}/update`}>
                    <Button variant="secondary">Update</Button>
                  </Link>

                  <DialogBox
                    text="Delete"
                    variant="destructive"
                    content={
                      <ServicesDeleteForm
                        title={`Deleting ${service.title}`}
                        description="This action cannot be undone. This will permanently delete the service and remove data from the server."
                        action={handleDeleteServices}
                        value={service.id}
                        text="Delete"
                        variant="destructive"
                        loading={deletingId === service.id}
                      />
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </>
  );
};

export default ServicesHome;
