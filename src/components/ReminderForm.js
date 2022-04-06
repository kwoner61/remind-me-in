import React from "react";
import "./ReminderForm.css";
import { Formik, Form, Field } from "formik";
import Box from "@mui/material/Box";
import * as Yup from "yup";

const ReminderFormSchema = Yup.object().shape({
  timeAmount: Yup.number()
    .typeError("Value must be a number.")
    .positive("Value must be greater than 0.")
    .integer("Value must be an integer.")
    .required("Number Required"),
  message: Yup.string()
    .min(1, "Too Short!")
    .max(280, "Too Long!")
    .required("Message Required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email Required"),
});

export const ReminderForm = () => (
  <Box>
    <Formik
      initialValues={{
        timeAmount: 1,
        message: "",
        email: "",
        timeUnit: "year",
      }}
      validationSchema={ReminderFormSchema}
      onSubmit={(values) => {
        // same shape as initial values
        console.log(values);
      }}
    >
      {({ errors, touched, values }) => (
        <Form>
          <Box>
            <h1>Remind Me In</h1>
            <Field as="input" name="timeAmount" />
            {errors.timeAmount && touched.timeAmount ? (
              <div>{errors.timeAmount}</div>
            ) : null}

            <Field as="select" name="timeUnit">
              <option value="minute">Minute(s)</option>
              <option value="hour">Hour(s)</option>
              <option value="month">Month(s)</option>
              <option value="year">Year(s)</option>
            </Field>
          </Box>

          <Box>
            <Field name="email" type="email" placeholder="Email" />
            {errors.email && touched.email ? <div>{errors.email}</div> : null}
          </Box>

          <Box>
            <Field
              name="message"
              as="textarea"
              placeholder="Message"
              rows="10"
              cols="30"
              maxLength="280"
            />
            {errors.message && touched.message ? (
              <div>{errors.message}</div>
            ) : null}
          </Box>

          <button type="submit">Create Reminder</button>
        </Form>
      )}
    </Formik>
  </Box>
);
