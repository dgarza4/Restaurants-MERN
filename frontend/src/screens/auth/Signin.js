import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

import {
  CssBaseline,
  Avatar,
  Button,
  Link as MuiLink,
  Grid,
  Box,
  Typography,
  Container,
} from '@material-ui/core';

import { loginRequest } from './redux/actions';
import { Copyright } from '../../shared';

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();

  const { authUserLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleFormSubmit = ({ email, password }) => {
    dispatch(loginRequest(email, password));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Formik
          initialValues={{ email: '', password: '' }}
          validate={(values) => {
            const errors = {};

            if (!values.email) {
              errors.email = 'Email is required';
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = 'Invalid email address';
            }

            if (!values.password) {
              errors.password = 'Password is required';
            }
            return errors;
          }}
          onSubmit={handleFormSubmit}
        >
          {({ submitForm, isSubmitting }) => (
            <Form>
              <Field
                variant="outlined"
                margin="normal"
                fullWidth
                autoFocus
                required
                autoComplete="email"
                component={TextField}
                name="email"
                type="email"
                label="Email"
                disabled={false}
              />
              <Field
                variant="outlined"
                margin="normal"
                fullWidth
                required
                autoComplete="current-password"
                component={TextField}
                type="password"
                label="Password"
                name="password"
                disabled={false}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={authUserLoading}
                onClick={submitForm}
              >
                {authUserLoading ? 'Signing...' : 'Sign'} In
              </Button>
              <Grid container>
                <Grid item xs />
                <Grid item>
                  <MuiLink component={Link} to="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </MuiLink>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
