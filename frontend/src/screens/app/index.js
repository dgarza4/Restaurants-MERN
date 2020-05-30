import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import RestaurantsList from './Restaurants/ListPage';
import UsersList from './Users/ListPage';
import EditProfile from './EditProfile';
import ResetPassword from './ResetPassword';
import ReviewsList from './Reviews/ListPage';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
}));

export default () => {
  const classes = useStyles();
  const { authUser } = useSelector((state) => state.auth);

  return (
    <div className={classes.paper}>
      <Switch>
        {authUser.role === 'admin' && (
          <Route path="/users" component={UsersList} />
        )}
        <Route path="/restaurants/:id" component={ReviewsList} />
        <Route path="/restaurants" component={RestaurantsList} />
        <Route path="/profile" component={EditProfile} />
        <Route path="/reset-password" component={ResetPassword} />
        <Redirect to="/restaurants" />
      </Switch>
    </div>
  );
};
