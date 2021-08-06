import { Fragment, useState, useEffect } from "react";
import { JsonForms } from "@jsonforms/react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import logo from "./logo.svg";
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

const initialContactForm = {
  schema: {
    type: "object",
    title: "Initial Contact",
    properties: {
      improveConfidence: {
        type: "boolean",
      },
      improveMentalWellbeing: {
        type: "boolean",
      },
      improvePhysicalWellbeing: {
        type: "boolean",
      },
      haveSomeoneToChatWith: {
        type: "boolean",
      },
      goalFocus: {
        type: "string",
      },
      physicalHealthRating: {
        type: "number",
        maximum: 10,
        minimum: 1,
        description:
          "With 1 being poor and 10 being excellent on a 1-10 scale, how would you rate your overall physical health?",
      },
      lifeSatisfactionRating: {
        type: "number",
        maximum: 10,
        minimum: 1,
        description:
          "With 1 being not at all and 10 being completely on a 1-10 scale, how would you rate how satisfied you are with your life?",
      },
      notes: {
        type: "string",
      },
    },
  },
  uischema: {
    type: "Group",
    elements: [
      {
        type: "Group",
        elements: [
          {
            type: "Control",
            scope: "#/properties/improveMentalWellbeing",
          },
          {
            type: "Control",
            scope: "#/properties/improvePhysicalWellbeing",
          },
          {
            type: "Control",
            scope: "#/properties/haveSomeoneToChatWith",
          },
          {
            type: "Control",
            scope: "#/properties/improveConfidence",
          },
        ],
        label:
          "What interests you about going out for a walk with a Move Mate?",
      },
      {
        type: "Group",
        elements: [
          {
            type: "Control",
            scope: "#/properties/goalFocus",
            options: {
              multi: true,
            },
          },
        ],
        label:
          "What would you like to focus on getting out of your walks over the next few months?",
      },
      {
        type: "Group",
        elements: [
          {
            type: "Control",
            scope: "#/properties/physicalHealthRating",
          },
          {
            type: "Control",
            scope: "#/properties/lifeSatisfactionRating",
          },
        ],
        label:
          "The next few questions will ask about how you feel at the moment. This is so that we can understand if there are any changes for you as a result of being part of the Move Mates project.",
      },
      {
        type: "Group",
        elements: [
          {
            type: "Control",
            scope: "#/properties/notes",
            options: {
              multi: true,
            },
          },
        ],
      },
    ],
    label: "Initial Contact",
  },
};
const data = {
  improveMentalWellbeing: true,
};

const Home = () => {
  const classes = useStyles();
  const [displayDataAsString, setDisplayDataAsString] = useState("");
  const [initialData, setInitialData] = useState(data);
  const [jsonformsData, setJsonformsData] = useState(data);

  const getInitialData = async () => {
    try {
      const { data } = await axios.get("api");
      setInitialData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setInitialData(axios.get("api") || {});
    setDisplayDataAsString(JSON.stringify(jsonformsData, null, 2));
  }, [jsonformsData]);

  const clearData = () => {
    setJsonformsData({});
  };
  const handleSubmit = () => {
    if (Object.keys(initialData).length > 0) {
      axios.put("api", {
        ...jsonformsData,
        uischema: initialContactForm["uischema"],
      });
    } else {
      axios.post("api", jsonformsData);
    }
  };
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
              schema={initialContactForm["schema"]}
              uischema={initialContactForm["uischema"]}
              data={jsonformsData}
              renderers={renderers}
              cells={materialCells}
              onChange={({ errors, data }) => setJsonformsData(data)}
            />
          </div>
          <Button onChange={handleSubmit}>
            {Object.values(initialData).length > 0 ? "Update" : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Home;
