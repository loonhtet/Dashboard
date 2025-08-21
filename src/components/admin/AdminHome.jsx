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
import { deleteAdmin, getAllAdmins } from "@/app/admin/action";
import EmptyTableResult from "../ui/EmptySearchResult";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import LoadingTableResult from "../ui/LoadingTableResult";
import AdminDeleteForm from "./AdminDeleteForm";
import DialogBox from "../ui/DialogBlox";
import AdminUpdateForm from "./AdminUpdateForm";
import { Badge } from "../ui/badge";

const AdminHome = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

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

  const handleDeleteAdmin = async (data) => {
    const id = data.get("id");
    if (!id) {
      toast.error("Could not find admin to delete.");
      return;
    }

    setDeletingId(id);

    try {
      await deleteAdmin(id, currentUser);
      fetchAdmins();
      toast.success("Admin deleted successfully!");
    } catch (error) {
      console.error("Failed to delete admin:", error);
      toast.error("Failed to delete admin. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <>
      {/* Start Header */}
      <header className="mb-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <h1 className="text-2xl font-bold">Admins</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchAdmins(searchQuery);
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
      {/* End Header */}

      {/* Start Table */}
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
                <TableCell>
                  {admin.email_verified ? (
                    <Badge className="bg-green-500 text-white">Yes</Badge>
                  ) : (
                    <Badge className="bg-red-500 text-white">No</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(admin.created_at), "dd MMM yyyy, hh:mm a")}
                </TableCell>
                <TableCell>
                  {format(new Date(admin.updated_at), "dd MMM yyyy, hh:mm a")}
                </TableCell>

                <TableCell className="space-x-2 text-right">
                  {/* Start Update Dialog */}
                  <DialogBox
                    text={"Update"}
                    variant={"secondary"}
                    content={
                      <AdminUpdateForm
                        title={`Updating ${admin.name}`}
                        datas={admin}
                        action={fetchAdmins}
                        currentUser={currentUser}
                      />
                    }
                  />
                  {/* End Update Dialog */}

                  {/* Start Delete Dialog */}
                  <DialogBox
                    text={"Delete"}
                    variant={"destructive"}
                    content={
                      <AdminDeleteForm
                        title={`Deleting ${admin.name}`}
                        description={
                          "This action cannot be undone. This will permanently delete account and remove data from server."
                        }
                        action={handleDeleteAdmin}
                        value={admin.id}
                        text={"Delete"}
                        variant={"destructive"}
                        loading={deletingId === admin.id}
                      />
                    }
                  />

                  {/* End Delete Dialog */}
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

export default AdminHome;
