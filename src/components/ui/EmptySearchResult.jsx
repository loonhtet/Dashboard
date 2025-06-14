import { TableBody, TableCell, TableRow } from "./table";

const EmptyTableResult = ({ col }) => {
  return (
    <>
      <TableBody>
        <TableRow>
          <TableCell colSpan={col} className="h-24 text-center">
            No results found.
          </TableCell>
        </TableRow>
      </TableBody>
    </>
  );
};

export default EmptyTableResult;
