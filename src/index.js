"use strict";
import React, { Fragment, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { JsonForms } from "@jsonforms/react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./App.css";
import axios from "axios";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((_theme) => ({
  container: {
    padding: "1em",
    width: "100%",
  },
  title: {
    textAlign: "center",
    padding: "0.25em",
  },
  dataContent: {
    display: "flex",
    justifyContent: "center",
    borderRadius: "0.25em",
    backgroundColor: "#cecece",
    marginBottom: "1rem",
  },
  resetButton: {
    margin: "auto",
    display: "block",
  },
  demoform: {
    margin: "auto",
    padding: "1rem",
  },
}));

const renderers = [
  ...materialRenderers,
  //register custom renderers
];
function App() {
  const classes = useStyles();
  const [displayDataAsString, setDisplayDataAsString] = useState("");
  const [initialData, setInitialData] = useState({});
  const [jsonformsData, setJsonformsData] = useState({});
  const [schema, setSchema] = useState({});
  const [uiSchema, setUiSchema] = useState({});
  useEffect(() => {
    setDisplayDataAsString(JSON.stringify(jsonformsData, null, 2));

    console.log(jsonformsData);
  }, [jsonformsData]);
  useEffect(() => {
    const getTemplate = () => {
      axios
        .get(
          "https://mtmstaging.mywebtoolkit.com/api/v1/mtm-forms/proforma?id=1&username=ascott",
          {
            headers: {
              Authorization: "Token a0f4e04feb4091725c00379dbed9fafb2d69500b",
            },
          }
        )
        .then(
          ({
            data: {
              formProforma: {
                formSchemas: { schema, uiSchema },
              },
            },
          }) => {
            setSchema(schema);
            setUiSchema(uiSchema);
          }
        )
        .catch((err) => console.log(err));
    };
    getTemplate();
  }, []);

  const clearData = () => {
    setJsonformsData({});
  };
  const handleSubmit = () => {
    console.log(jsonformsData);
  };
  const handleChange = ({ errors, data }) => {
    console.log(data);
    setJsonformsData(data);
  };
  return (
    <Fragment>
      <Grid
        container
        justify={"center"}
        spacing={1}
        className={classes.container}
      >
        <Grid item sm={12}>
          <Typography variant={"h3"} className={classes.title}>
            Rendered form
          </Typography>
          <div className={classes.demoform}>
            <JsonForms
              schema={schema}
              uischema={uiSchema}
              data={initialData}
              renderers={renderers}
              cells={materialCells}
              onChange={handleChange}
            />
          </div>
          <Button onClick={handleSubmit}>Submit</Button>
        </Grid>
      </Grid>
    </Fragment>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
