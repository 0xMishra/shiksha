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
import { useRouter } from "next/navigation";

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
  chaptersCompleted,
}: {
  courses: CoursesBought[];
  chaptersCompleted: { id: number }[];
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
        const allChapters = row.getValue("chapters");
        // @ts-ignore
        // if has user set all the chapters of a particular course to be completed = true then that particular course should also be completed = true
        const user = allChapters.every((ch2) =>
          chaptersCompleted.some((ch1) => ch1.id === ch2.id),
        );
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
        const courseId = row.getValue("id") as string;

        const allChapters = row.getValue("chapters");
        // @ts-ignore
        // if has user set all the chapters of a particular course to be completed = true then that particular course should also be completed = true
        const user = allChapters.every((ch2) =>
          chaptersCompleted.some((ch1) => ch1.id === ch2.id),
        );
        let isCompleted = user ? true : false;

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
                    router.push(`/courses/${courseId}`);
                  }}
                  className="w-[100%] cursor-pointer font-semibold text-white"
                >
                  VIEW COURSE
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
    </div>
  );
};
