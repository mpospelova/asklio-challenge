import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RequestOverviewRows from "./RequestOverviewRows";

function RequestOverview() {
  return (
    <div className="m-4 rounded-lg bg-white pb-5 shadow-md">
      <Table>
        <TableCaption>A list of current requests.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Vendor Name</TableHead>
            <TableHead>Requestor Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <RequestOverviewRows />
      </Table>
    </div>
  );
}

export default RequestOverview;
