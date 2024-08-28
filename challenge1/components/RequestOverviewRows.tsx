"use client";

import React, { useContext } from "react";
import { TableBody, TableCell, TableRow } from "./ui/table";
import { ProcurementRequestsContext } from "@/context/RequestsProvider";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExtractedInformationContext } from "@/context/ExtractedInformationProvider";
import { Edit2Icon, Trash2Icon } from "lucide-react";

function RequestOverviewRows() {
  const { requests, changeState, deleteRequest } = useContext(
    ProcurementRequestsContext
  );
  const { addExtractedInformation } = useContext(ExtractedInformationContext);

  return (
    <TableBody>
      {requests.map((request, index) => (
        <TableRow>
          <TableCell className="font-medium">
            {request.extractedInformation.title}
          </TableCell>

          <TableCell className="font-medium">
            {request.extractedInformation.vendorName}
          </TableCell>

          <TableCell className="font-medium">
            {request.extractedInformation.requestorName}
          </TableCell>

          <TableCell className="font-medium">
            <Select onValueChange={(value) => changeState(request.id, value)}>
              <SelectTrigger>
                <SelectValue placeholder={request.state} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">open</SelectItem>
                <SelectItem value="inProgress">in Progress</SelectItem>
                <SelectItem value="closed">closed</SelectItem>
              </SelectContent>
            </Select>
          </TableCell>

          <TableCell className="font-medium">
            {request.createdAt.toDateString()}
          </TableCell>

          <TableCell>
            <Button
              className="border-none"
              disabled={request.state === "closed"}
              asChild
              variant="outline"
              onClick={() => {
                changeState(request.id, "In Progress");
                addExtractedInformation(request.extractedInformation);
              }}
            >
              <Link href={`/form?action=edit&id=${request.id}`}>
                <Edit2Icon className="w-4" />
              </Link>
            </Button>
          </TableCell>
          <TableCell>
            <Button
              className="border-none"
              variant="destructive"
              onClick={() => {
                deleteRequest(request.id);
              }}
            >
              <Trash2Icon className="w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

export default RequestOverviewRows;
