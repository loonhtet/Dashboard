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
import BlogDeleteForm from "./BlogDeleteForm";
import DialogBox from "../ui/DialogBlox";
import { deleteBlog, getAllBlogs, updateBlogStatus } from "@/app/blog/action";
import Link from "next/link";
import { Switch } from "../ui/switch";

const BlogHome = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async (search = "") => {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await getAllBlogs(search);
      setBlogs(response.data);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlog = async (data) => {
    const id = data.get("id");
    if (!id) {
      toast.error("Could not find blog to delete.");
      return;
    }

    setDeletingId(id);

    try {
      const response = await deleteBlog(id, currentUser);
      fetchBlogs();
      toast.success(response.message);
    } catch (error) {
      toast.error(response.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (blogId, isPublished) => {
    try {
      const res = await updateBlogStatus(blogId, isPublished);
      if (res.success) {
        toast.success(res.message);
        setBlogs((prev) =>
          prev.map((b) =>
            b.id === blogId ? { ...b, published: isPublished } : b,
          ),
        );
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <header className="mb-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchBlogs(searchQuery);
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
            <TableHead className="w-[100px]">No.</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Creation Date</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <LoadingTableResult col={8} />
        ) : isError ? (
          <EmptyTableResult col={8} />
        ) : blogs.length === 0 ? (
          <EmptyTableResult col={6} />
        ) : (
          <TableBody>
            {blogs.map((blog, idx) => (
              <TableRow key={blog.id}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.category?.name || "N/A"}</TableCell>
                <TableCell>
                  <Switch
                    checked={blog.published}
                    onCheckedChange={(checked) =>
                      handleStatusChange(blog.id, checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(blog.created_at), "dd MMM yyyy, hh:mm a")}
                </TableCell>
                <TableCell>
                  {format(new Date(blog.updated_at), "dd MMM yyyy, hh:mm a")}
                </TableCell>

                <TableCell className="space-x-2 text-right">
                  <Link href={`/blog/${blog.slug}/update-blog`}>
                    <Button variant={"secondary"}>Update</Button>
                  </Link>

                  <DialogBox
                    text={"Delete"}
                    variant={"destructive"}
                    content={
                      <BlogDeleteForm
                        title={`Deleting ${blog.title}`}
                        description={
                          "This action cannot be undone. This will permanently delete the blog and remove data from server."
                        }
                        action={handleDeleteBlog}
                        value={blog.id}
                        text={"Delete"}
                        variant={"destructive"}
                        loading={deletingId === blog.id}
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

export default BlogHome;
