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
import GalleryDeleteForm from "./GalleryDeleteForm";
import DialogBox from "../ui/DialogBlox";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { deleteGallery, getAllGallery } from "@/app/gallery/action";

const GalleryHome = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [gallery, setGallery] = useState([]);

  const fetchGallery = async (search = "") => {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await getAllGallery(search);
      setGallery(response.data);
    } catch (error) {
      toast.error(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGallery = async (data) => {
    const id = data.get("id");
    if (!id) {
      toast.error("Could not find gallery to delete.");
      return;
    }

    setDeletingId(id);

    try {
      await deleteGallery(id, currentUser);
      fetchGallery();
      toast.success("Gallery deleted successfully!");
    } catch (error) {
      console.error("Failed to delete Gallery:", error);
      toast.error("Failed to delete Gallery. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  return (
    <>
      <header className="mb-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchGallery(searchQuery);
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
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Services</TableHead>
            <TableHead>Creation Date</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <LoadingTableResult col={8} />
        ) : isError ? (
          <EmptyTableResult col={8} />
        ) : gallery.length === 0 ? (
          <EmptyTableResult col={6} />
        ) : (
          <TableBody>
            {gallery.map((gallery, idx) => (
              <TableRow key={gallery.id}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>{gallery.image_url || "N/A"} images</TableCell>
                <TableCell>{gallery.title || "N/A"}</TableCell>
                <TableCell>{gallery.description || "N/A"}</TableCell>
                <TableCell>{gallery.services}</TableCell>
                <TableCell>
                  {format(new Date(gallery.created_at), "dd MMM yyyy, hh:mm a")}
                </TableCell>
                <TableCell>
                  {format(new Date(gallery.updated_at), "dd MMM yyyy, hh:mm a")}
                </TableCell>

                <TableCell className="space-x-2 text-right">
                  <Link href={`/app/gallery/${gallery.slug}/update`}>
                    <Button variant={"secondary"}>Update</Button>
                  </Link>

                  <DialogBox
                    text={"Delete"}
                    variant={"destructive"}
                    content={
                      <GalleryDeleteForm
                        title={`Deleting ${gallery.title}`}
                        description={
                          "This action cannot be undone. This will permanently delete the gallery and remove data from server."
                        }
                        action={handleDeleteGallery}
                        value={gallery.id}
                        text={"Delete"}
                        variant={"destructive"}
                        loading={deletingId === gallery.id}
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

export default GalleryHome;
