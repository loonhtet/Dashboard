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
import CategoryUpdateForm from "./CategoryUpdateForm";
import { Badge } from "../ui/badge";
import { deleteCategory, getAllCategories } from "@/app/category/action";
import CategoryDeleteForm from "./CategoryDeleteForm";

const CategoryHome = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);

  const fetchCategories = async (search = "") => {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await getAllCategories(search);
      console.log(response);
      if (response.success) {
        setCategories(response.data);
      } else {
        toast.error(response.message);
        setIsError(true);
      }
    } catch (error) {
      toast.error(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (data) => {
    const id = data.get("id");
    if (!id) {
      toast.error("Could not find category to delete.");
      return;
    }

    setDeletingId(id);

    try {
      const res = await deleteCategory(id, currentUser);
      if (res.success) {
        toast.success("Category deleted successfully!");
        fetchCategories();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <header className="mb-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchCategories(searchQuery);
          }}
          className="flex w-full max-w-sm gap-2"
        >
          <Input
            name="search"
            type="text"
            placeholder="Search by name"
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
            <TableHead className="w-[100px]">No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Creation Date</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <LoadingTableResult col={6} />
        ) : isError || categories.length === 0 ? (
          <EmptyTableResult col={6} />
        ) : (
          <TableBody>
            {categories.map((category, idx) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  {format(
                    new Date(category.created_at),
                    "dd MMM yyyy, hh:mm a",
                  )}
                </TableCell>
                <TableCell>
                  {format(
                    new Date(category.updated_at),
                    "dd MMM yyyy, hh:mm a",
                  )}
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <DialogBox
                    text={"Update"}
                    variant={"secondary"}
                    content={
                      <CategoryUpdateForm
                        title={`Updating ${category.name}`}
                        datas={category}
                        action={fetchCategories}
                        currentUser={currentUser}
                      />
                    }
                  />
                  <DialogBox
                    text={"Delete"}
                    variant={"destructive"}
                    content={
                      <CategoryDeleteForm
                        title={`Deleting ${category.name}`}
                        description={
                          "This action cannot be undone. This will permanently delete the post and remove data from server."
                        }
                        action={handleDeleteCategory}
                        value={category.id}
                        text={"Delete"}
                        variant={"destructive"}
                        loading={deletingId === category.id}
                      />
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {/* End Table */}
    </>
  );
};

export default CategoryHome;
