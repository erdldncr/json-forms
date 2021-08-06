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
import { FormGroup, Input } from "@material-ui/core";
import { Add, Label, PlusOne } from "@material-ui/icons";

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
const schema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 3,
      description: "Please enter your name",
    },
    vegetarian: {
      type: "boolean",
    },
    birthDate: {
      type: "string",
      format: "date",
    },
    nationality: {
      type: "string",
      enum: ["DE", "IT", "JP", "US", "RU", "Other"],
    },
    personalData: {
      type: "object",
      properties: {
        age: {
          type: "integer",
          description: "Please enter your age.",
        },
        height: {
          type: "number",
        },
        drivingSkill: {
          type: "number",
          maximum: 10,
          minimum: 1,
          default: 7,
        },
      },
      required: ["age", "height"],
    },
    occupation: {
      type: "string",
    },
    postalCode: {
      type: "string",
      maxLength: 5,
    },
  },
  required: ["occupation", "nationality"],
};
const uischema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "HorizontalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/name",
        },
        {
          type: "Control",
          scope: "#/properties/personalData/properties/age",
        },
        {
          type: "Control",
          scope: "#/properties/birthDate",
        },
      ],
    },
    {
      type: "Label",
      text: "Additional Information",
    },
    {
      type: "HorizontalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/personalData/properties/height",
        },
        {
          type: "Control",
          scope: "#/properties/nationality",
        },
        {
          type: "Control",
          scope: "#/properties/occupation",
          suggestion: [
            "Accountant",
            "Engineer",
            "Freelancer",
            "Journalism",
            "Physician",
            "Student",
            "Teacher",
            "Other",
          ],
        },
      ],
    },
  ],
};
const data = {
  name: "John Doe",
  vegetarian: false,
  birthDate: "1985-06-02",
  personalData: {
    age: 34,
  },
  postalCode: "12345",
};

const Dynamic = () => {
  const classes = useStyles();
  const [jsonformsData, setJsonformsData] = useState(data);
  const [formGroupSchema, setFormGroupSchema] = useState({});
  const [formGroup, setFormGroup] = useState({});
  const [formGroupIntpus, setFormGroupInputs] = useState({});
  const [show, setShow] = useState(true);
  const handleChange = (e) => {
    setFormGroup({
      ...formGroup,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    setFormGroupSchema({});
  }, [formGroup]);
  const handleFormGroupKeysChange = (e) => {
    setFormGroupInputs({
      ...formGroupIntpus,
      [e.target.name]: {
        ...formGroupIntpus[e.target.name],
        types: e.target.value,
      },
    });
  };
  const handleFormGroupTypesChange = (e) => {
    setFormGroupInputs({
      ...formGroupIntpus,
      [e.target.name]: {
        types: e.target.value,
      },
    });
  };
  console.log(formGroupIntpus);
  return (
    <Fragment>
      <Grid
        container
        justify={"center"}
        spacing={1}
        className={classes.container}
      >
        <Grid item sm={6}>
          {show && (
            <Typography variant={"h3"} className={classes.title}>
              To Add new form click here <Add onClick={() => setShow(false)} />
            </Typography>
          )}
          <form>
            <label htmlFor="nameOfTheForm">Name of The Form?</label>
            <br />
            <input
              type="text"
              name="formName"
              value={formGroup["nameOfTheForm"]}
              onChange={handleChange}
            />
            <br />
            <label>How many inputs do you need?</label>
            <br />
            <input
              type="text"
              name="numberOfTheInputs"
              value={formGroup["numberOfTheInputs"]}
              onChange={handleChange}
            />
            <div>
              {Array.from(
                { length: +formGroup?.numberOfTheInputs },
                (_, i) => i + 1
              ).map((input, idx) => (
                <Fragment>
                  <label htmlFor="">
                    Please, enter name of input groups and types
                  </label>
                  <input
                    type="text"
                    name={`formGroupInput${input}`}
                    value={formGroupIntpus[`formGroupInput${input}`]}
                    onChange={handleFormGroupKeysChange}
                  />
                  <input
                    type="text"
                    name={`formGroupInput${input}`}
                    value={formGroupIntpus[`formGroupInput${input}`]}
                    onChange={handleFormGroupTypesChange}
                  />
                  <br />
                </Fragment>
              ))}
            </div>
          </form>
        </Grid>

        <Grid item sm={6}>
          <Typography variant={"h3"} className={classes.title}>
            Rendered form
          </Typography>
          <div className={classes.demoform}>
            <JsonForms
              schema={schema}
              uischema={uischema}
              data={jsonformsData}
              renderers={renderers}
              cells={materialCells}
              onChange={({ errors, data }) => setJsonformsData(data)}
            />
          </div>
          <Button>
            {Object.values(jsonformsData).length > 0 ? "Update" : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Dynamic;
