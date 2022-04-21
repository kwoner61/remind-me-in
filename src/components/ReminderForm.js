import React from "react";
import { addYears, addMonths, addDays, addMinutes } from 'date-fns'
import "./ReminderForm.css";
import { Formik, Form, Field } from "formik";
import { v4 as uuid } from 'uuid';
import Box from "@mui/material/Box";
import * as Yup from "yup";
import axios from "axios";

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

const getScheduledDate = (timeAmount, timeUnit) => {
  let scheduledDate = new Date();

  switch (timeUnit) {
    case "year":
      scheduledDate = addYears(scheduledDate, timeAmount);
      break;
    case "month":
      scheduledDate = addMonths(scheduledDate, timeAmount);
      break;
    case "day":
      scheduledDate = addDays(scheduledDate, timeAmount);
      break;
    case "minute":
      scheduledDate = addMinutes(scheduledDate, timeAmount);
  }

  return scheduledDate;
}

const getCronExpression = (date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();

  return "cron(" + minute + " " + hour + " " + day + " " + month + " ? " + year + ")";
};

const getReminderRequest = (schedDate, email, message) => {

  return {
    requestId: uuid(),
    cronExpression: getCronExpression(schedDate),
    reminderContent: message,
    toEmailAddress: email
  }
};

const createReminder = (reminderRequest) => {
  const baseUrl = process.env.REACT_APP_BACKEND_URL;

  axios.post(baseUrl + '/reminder', reminderRequest).then((response) => {
    console.log(response);
  })
};

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
      onSubmit={(formValues) => {
        // same shape as initial values

        const schedDate = getScheduledDate(formValues.timeAmount, formValues.timeUnit);
        const reminderRequest = getReminderRequest(schedDate, formValues.email, formValues.message);
        createReminder(reminderRequest);

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
              <option value="day">Day(s)</option>
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
