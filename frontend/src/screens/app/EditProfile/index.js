import React from 'react';
import { Link } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

import {
  CssBaseline,
  Avatar,
  Button,
  Grid,
  Typography,
  Container,
} from '@material-ui/core';

import useApiRequests from './useApiRequests';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    marginTop: theme.spacing(2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const { data, isLoading, updateProfile } = useApiRequests();

  const handleFormSubmit = ({ firstName, lastName, email, password }) => {
    updateProfile({ firstName, lastName, email, password });
  };

  return (
    <Container className={classes.paper} component="main" maxWidth="xs">
      <CssBaseline />
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Update profile
      </Typography>
      <Formik
        initialValues={{ ...data, confirmPassword: '' }}
        validate={(values) => {
          const errors = {};

          if (!values.email) {
            errors.email = 'Email is required';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Invalid email address';
          }

          if (!values.firstName) {
            errors.firstName = 'First name is required';
          }
          if (!values.lastName) {
            errors.lastName = 'Last name is required';
          }
          if (!values.password) {
            errors.password = 'Password is required';
          }

          if (
            !values.confirmPassword ||
            values.password !== values.confirmPassword
          ) {
            errors.confirmPassword = 'Please confirm your password';
          }

          return errors;
        }}
        onSubmit={handleFormSubmit}
      >
        {({ submitForm, isSubmitting }) => (
          <Form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  disabled={false}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  disabled={false}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  disabled={false}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  disabled={false}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  variant="outlined"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirm-password"
                  autoComplete="current-password"
                  disabled={false}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.submit}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  onClick={submitForm}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  component={Link}
                  to="/restaurants"
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
