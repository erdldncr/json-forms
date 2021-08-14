import { Fragment, useState, useEffect } from "react";
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

const Home = () => {
  const classes = useStyles();
  const [displayDataAsString, setDisplayDataAsString] = useState("");
  const [initialData, setInitialData] = useState({});
  const [jsonformsData, setJsonformsData] = useState({});
  const [schema, setSchema] = useState({});
  const [uiSchema, setUiSchema] = useState({});

  useEffect(() => {
    const getTemplate = () => {
      axios
        .get(
          "https://cors-anywhere.herokuapp.com/https://mtmstaging.mywebtoolkit.com/api/v1/my-details?username=ascott",
          {
            headers: {
              Authorization: "Token a0f4e04feb4091725c00379dbed9fafb2d69500b",
            },
          }
        )
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => console.log(err));
    };
    getTemplate();
    // setInitialData(axios.get("api") || {});
    setDisplayDataAsString(JSON.stringify(jsonformsData, null, 2));
  }, []);

  const clearData = () => {
    setJsonformsData({});
  };
  const handleSubmit = () => {};
  return (
    <Fragment>
      <Grid
        container
        justify={"center"}
        spacing={1}
        className={classes.container}
      >
        <Grid item sm={6}>
          <Typography variant={"h3"} className={classes.title}>
            Bound data
          </Typography>
          <div className={classes.dataContent}>
            <pre id="boundData">{displayDataAsString}</pre>
          </div>
          <Button
            className={classes.resetButton}
            onClick={clearData}
            color="primary"
            variant="contained"
          >
            Clear data
          </Button>
        </Grid>
        <Grid item sm={6}>
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
              onChange={({ errors, data }) => setJsonformsData(data)}
            />
          </div>
          <Button onChange={handleSubmit}>Submit</Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Home;
