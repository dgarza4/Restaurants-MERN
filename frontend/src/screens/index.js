import React from 'react';
import { Container } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { SnackbarProvider } from 'notistack';

import { Navbar } from '../shared';
import AuthModule from './auth';
import AppModule from './app';
import { Notifier } from '../shared';

export default () => {
  const { authUser } = useSelector((state) => state.auth);

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <Notifier />
      <Navbar />
      <Container>{authUser ? <AppModule /> : <AuthModule />}</Container>
    </SnackbarProvider>
  );
};
