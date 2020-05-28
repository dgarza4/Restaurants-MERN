import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Container,
  MenuItem,
  Menu,
  Typography,
} from '@material-ui/core';

import { logout } from '../screens/auth/redux/actions';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  login: {
    marginLeft: 'auto',
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Container>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            {!authUser && (
              <Button
                component={Link}
                to="/signin"
                color="inherit"
                className={classes.login}
              >
                Signin
              </Button>
            )}
            {authUser && (
              <>
                <MenuItem component={Link} to="/restaurants">
                  Restaurants
                </MenuItem>
                {authUser.role === 'admin' && (
                  <MenuItem component={Link} to="/users">
                    Users
                  </MenuItem>
                )}
                <div className={classes.login}>
                  <Button
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <Typography>
                      {authUser.firstName} {authUser.lastName} ({authUser.role})
                    </Typography>
                  </Button>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem component={Link} to="/profile">
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => dispatch(logout())}>
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
