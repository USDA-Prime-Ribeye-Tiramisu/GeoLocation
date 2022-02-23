import React, { useRef, useState } from "react";
import CSVReader from "react-csv-reader";
import axios from "axios";
import { CSVLink, CSVDownload } from "react-csv";

import { CircularProgress, Button } from "@mui/material";

const BatchProccesor = () => {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const [loading, setLoading] = useState(true);
  const [uploaded, setUploaded] = useState(false);
  const [endOutput, setData] = useState([]);
  let output = [];

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().replace(/\W/g, "_"),
  };

  const handleForce = (file, fileInfo) => {
    setUploaded(true);

    Promise.all(
      file.map(async (row) => {
        const geocoding = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${row.address}.json?access_token=pk.eyJ1IjoiaW5kZWVwOTkiLCJhIjoiY2toMmRidHg0MTU0dzJycm54YjVoMWR3ZSJ9.6ozAIR2hzVIUtEvS8tk6Wg`
        );

        const coordinates = {
          longitude: geocoding.data.features[0].center[0],
          latitude: geocoding.data.features[0].center[1],
        };
        row = { ...row, ...coordinates };

        await delay(5000);
        const backendRequest = axios.get(
          `https://dallas-application.herokuapp.com/dallas/nearest/${geocoding.data.features[0].center[0]}/${geocoding.data.features[0].center[1]}`
        );

        const rent = {
          mls1: null,
          rent1: null,
          mls2: null,
          rent2: null,
          mls3: null,
          rent3: null,
        };

        for (let i = 0; i < (await backendRequest).data.length; i++) {
          if (i == 0) {
            rent.mls1 = (await backendRequest).data[i].mls;
            rent.rent1 = (await backendRequest).data[i].rent;
          } else if (i == 1) {
            rent.mls2 = (await backendRequest).data[i].mls;
            rent.rent2 = (await backendRequest).data[i].rent;
          } else if (i == 2) {
            rent.mls3 = (await backendRequest).data[i].mls;
            rent.rent3 = (await backendRequest).data[i].rent;
          }
        }
        row = { ...row, ...rent };
        output.push(row);
      })
    ).then(() => {
      setLoading(false);
      setUploaded(false);
      output.sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
      setData(output);
    });
  };

  return (
    <>
      <div className="container">
        <label
          style={{
            cursor: "pointer",
            borderLeft: "0px",
            border: "1px solid #000000",
            padding: "6px 12px",
          }}
        >
          <CSVReader
            inputStyle={{ display: "none" }}
            cssClass="react-csv-input"
            onFileLoaded={handleForce}
            parserOptions={papaparseOptions}
          />
          Upload File
        </label>
      </div>

      {uploaded && (
        <div style={{ marginTop: 20 }}>
          <CircularProgress />
        </div>
      )}

      {!loading && (
        <div style={{ marginTop: 20 }}>
          <CSVLink
            data={endOutput}
            asyncOnClick={true}
            filename={"batch_output"}
          >
            <Button variant="contained" color="success" style={{textDecoration: "none"}}>
              Download
            </Button>
          </CSVLink>
        </div>
      )}
    </>
  );
};

export default BatchProccesor;
