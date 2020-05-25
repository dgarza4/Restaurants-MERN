import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: 500,
  },
});

function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h5">
        A web application to Review Restaurants
      </Typography>
    </div>
  );
}

export default App;
