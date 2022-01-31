import React from "react";
import { useSelector } from "react-redux";
import {Table} from "react-bootstrap"

const HouseTable = () => {
  const propertySelector = useSelector((state) => state.houses.properties);

  return (
    <>
      <Table style={{ margin: "100px", border: "1px solid black" }}>
        <thead>
          <tr>
            <th>mls</th>
            <th>rent</th>
          </tr>
        </thead>

        <tbody>
          {propertySelector &&
            propertySelector.map((data, index) => {
              return (
                <tr key={data.mls}>
                  <td>{data.mls}</td>
                  <td>{data.rent}</td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </>
  );
};

export default HouseTable;
