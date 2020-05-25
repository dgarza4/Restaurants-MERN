import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Signin from './Signin';
import Signup from './Signup';

export default () => {
  return (
    <Switch>
      <Route path="/signin" component={Signin} />
      <Route path="/signup" component={Signup} />
      <Redirect to="/signin" />
    </Switch>
  );
};
