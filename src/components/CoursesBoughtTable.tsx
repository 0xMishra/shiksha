"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { MarkAsCompleteCourseActionButton } from "./MarkAsCompleteCourseActionButton";

type CoursesBought = {
  id: string;
  name: string;
  chapters: {
    id: number;
  }[];
  creator: {
    name: string | null;
  };
  isCompleted?: boolean;
};

export const CoursesBoughtTable = ({
  courses,
  coursesCompleted,
}: {
  courses: CoursesBought[];
  coursesCompleted: { id: string }[];
}) => {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isOpen, setIsOpen] = React.useState(false);
  const [courseId, setCourseId] = React.useState<string>("");

  const columns: ColumnDef<CoursesBought>[] = [
    {
      accessorKey: "id",
      header: () => <div className="text-right">Id</div>,
      cell: ({ row }) => {
        //@ts-ignore
        const id = row.getValue("id") as string;
        return (
          <div>
            <div className="text-right font-medium md:hidden">
              {id.slice(0, 5) + "..."}
            </div>
            <div className="hidden text-right font-medium md:flex lg:hidden">
              {id.slice(0, 8) + "..."}
            </div>
            <div className="hidden text-right font-medium lg:flex xl:hidden">
              {id.slice(0, 15) + "..."}
            </div>
            <div className="hidden text-right font-medium xl:flex">{id}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const courseId = row.getValue("id");
        {
          let name = row.getValue("name") as string;
          return (
            <div>
              <Link
                href={`/courses/${courseId}`}
                className="hidden pl-2 font-semibold lowercase md:flex"
              >
                {name}
              </Link>
              {/* @ts-ignore */}
              <Link
                href={`/courses/${courseId}`}
                className="pl-2 font-semibold lowercase md:hidden"
              >
                {name.slice(0, 10) + "..."}
              </Link>
            </div>
          );
        }
      },
    },
    {
      accessorKey: "chapters",
      header: () => <div className="text-right">Chapters</div>,
      cell: ({ row }) => {
        //@ts-ignore
        const chap = row.getValue("chapters")?.length!;
        return <div className="text-right font-medium">{chap}</div>;
      },
    },
    {
      accessorKey: "creator",
      header: () => <div className="text-right">Creator</div>,
      cell: ({ row }) => {
        //@ts-ignore
        const creator = row.getValue("creator").name;
        //@ts-ignore
        return <div className="text-right font-medium">{creator}</div>;
      },
    },
    {
      accessorKey: "isCompleted",
      header: () => <div className="text-right">Completed</div>,
      cell: ({ row }) => {
        const courseId = row.getValue("id") as string;
        const user = coursesCompleted.find((course) => course.id === courseId);
        let isCompleted = user ? "TRUE" : "FALSE";

        return (
          <div>
            {isCompleted === "TRUE" ? (
              <div className="text-right font-semibold text-green-500">
                {isCompleted}
              </div>
            ) : (
              <div className="text-right font-semibold text-red-500">
                {isCompleted}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const course = row.original;
        const courseId = row.getValue("id") as string;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer bg-blue-800 font-semibold text-white">
                <div
                  onClick={() => {
                    setIsOpen(true);
                    setCourseId(courseId);
                  }}
                  className="w-[100%] cursor-pointer font-semibold text-white"
                >
                  MARK AS COMPLETE
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: courses,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div
      className="w-full rounded-[1rem] p-4 text-gray-300"
      style={{ background: "#171717", color: "rgb(209 213 219) " }}
    >
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Courses..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <AlertDialog
        isOpen={isOpen}
        courseId={courseId}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

function AlertDialog({
  isOpen,
  onClose,
  courseId,
}: {
  isOpen: boolean;
  courseId: string;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div
        className="w-96 rounded-lg p-6 shadow-lg"
        style={{ background: "#171717", color: "rgb(209 213 219)" }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the dialog
      >
        <h2 className="mb-4 text-lg font-semibold">Mark as complete</h2>
        <p className="mb-1">
          Are you sure you want to mark this course as complete?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            className="rounded-[0.5rem] bg-gray-700 px-4 py-2 text-gray-300 hover:bg-gray-600"
            onClick={onClose}
          >
            Close
          </button>
          <MarkAsCompleteCourseActionButton courseId={courseId} />
        </div>
      </div>
    </div>
  );
}
