import React, { useState } from "react";
import CSVReader from "react-csv-reader";
import dallasService from "../service/dallasService";
import axios from "axios";

const BatchProccesor = () => {
  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().replace(/\W/g, "_"),
  };

  const handleForce = (data, fileInfo) => {
    data.map((row) => {
      axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${row.address}.json?access_token=pk.eyJ1IjoiaW5kZWVwOTkiLCJhIjoiY2toMmRidHg0MTU0dzJycm54YjVoMWR3ZSJ9.6ozAIR2hzVIUtEvS8tk6Wg`
        )
        .then((response) => {
          const coordinates = {longitude: response.data.features[0].center[0], latitude: response.data.features[0].center[1]}   
          row = {...row, ...coordinates}
          console.log(row)
        //   console.log(response.data.features[0].center);
        });
      //   const value = dallasService.findGeocodes();
      //   console.log(value);
    });
  };

  //   const [csvFile, setCsvFile] = useState();
  //   const [csvArray, setCsvArray] = useState([]);

  //   const processCSV = (str, delim = ",") => {
  //     const headers = str.slice(0, str.indexOf("\n")).split(delim);
  //     const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  //     const newArray = rows.map((row) => {
  //         // const values = row.split(delim);
  //         const values = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
  //     //   const values = row.split(',(?=(?:[^"]*"[^"]*")*[^"]*$)');

  //       console.log(values);
  //       //   const values = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

  //       const eachObject = headers.reduce((obj, header, i) => {
  //         if (values != null) {
  //           obj[header] = values[i];
  //         }

  //         return obj;
  //       }, {});
  //       return eachObject;
  //     });

  //     setCsvArray(newArray);
  //   };

  //   const submit = () => {
  //     const file = csvFile;
  //     const reader = new FileReader();

  //     reader.onload = function (e) {
  //       const text = e.target.result;
  //       processCSV(text);
  //     };

  //     reader.readAsText(file);
  //   };

  return (
    <div className="container">
      <CSVReader
        cssClass="react-csv-input"
        label="Select CSV"
        onFileLoaded={handleForce}
        parserOptions={papaparseOptions}
      />
      <p>and then open the console</p>
    </div>
    // <form id="csv-form">
    //   <input
    //     type="file"
    //     accept=".csv"
    //     id="csvFile"
    //     onChange={(e) => {
    //       setCsvFile(e.target.files[0]);
    //     }}
    //   ></input>
    //   <br />
    //   <button
    //     onClick={(e) => {
    //       e.preventDefault();
    //       if (csvFile) submit();
    //     }}
    //   >
    //     Submit
    //   </button>
    //   <br />
    //   <br />
    //   {csvArray.length > 0 ? (
    //     <>
    //       <table>
    //         <thead>
    //           <th>ID</th>
    //           <th>Address</th>
    //           <th>City</th>
    //         </thead>
    //         <tbody>
    //           {csvArray.map((item, i) => (
    //             <tr key={i}>
    //               <td>{item.ID}</td>
    //               <td>{item.unit_address_as_provided}</td>
    //               <td>{item.city}</td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </>
    //   ) : null}
    // </form>
  );
};

export default BatchProccesor;
