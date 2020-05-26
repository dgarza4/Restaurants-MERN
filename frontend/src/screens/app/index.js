import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import RestaurantsList from './Restaurants/ListPage';
import UsersList from './Users/ListPage';
import EditProfile from './EditProfile';
import ResetPassword from './ResetPassword';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default () => {
  const classes = useStyles();
  const { authUser, authUserLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <Switch>
      {/* {(authUser.role === 'admin' || authUser.role === 'owner') && (
        <Switch>
          <Route
            path="/restaurants/:restaurantId/reviews/:reviewId"
            component={ReviewPage}
          />
          <Route
            path="/restaurants/:restaurantId/reviews"
            component={ReviewsList}
          />
        </Switch>
      )} */}
      {/* {authUser.role === 'admin' && (
        <Switch>
          <Route
            path="/users/:userId/reset-password"
            component={ResetPassword}
          />
          <Route path="/users/:userId" component={UserPage} />
          <Route path="/users" component={UsersList} />
        </Switch>
      )} */}
      {/* <Route path="/restaurants/:restaurantId" component={RestaurantPage} /> */}
      <Route path="/restaurants" component={RestaurantsList} />
      <Route path="/profile" component={EditProfile} />
      <Route path="/reset-password" component={ResetPassword} />
      <Redirect to="/restaurants" />
    </Switch>
  );
};
