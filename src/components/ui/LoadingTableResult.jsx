import { Loader2 } from "lucide-react";
import { TableBody, TableCell, TableRow } from "./table";

const LoadingTableResult = ({ col }) => {
  return (
    <>
      <TableBody>
        <TableRow>
          <TableCell colSpan={col} className="h-24">
            <Loader2 className="mx-auto animate-spin" />
          </TableCell>
        </TableRow>
      </TableBody>
    </>
  );
};

export default LoadingTableResult;
