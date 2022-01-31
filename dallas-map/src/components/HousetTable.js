import React from "react";
import { useSelector } from "react-redux";
import {
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const HouseTable = () => {
  const propertySelector = useSelector((state) => state.houses.properties);

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 300 }}>
        <Table sx={{ maxWidth: 300 }}>
          <TableHead>
            <TableRow>
              <TableCell>mls</TableCell>
              <TableCell>Rent (USD)</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {propertySelector &&
              propertySelector.map((data, index) => {
                return (
                  <TableRow key={data.mls}>
                    <TableCell>{data.mls}</TableCell>
                    <TableCell>{data.rent}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default HouseTable;
