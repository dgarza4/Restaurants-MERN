import * as CONSTANTS from './constants';

export const signupRequest = (payload) => ({
  type: CONSTANTS.SIGNUP_REQUEST,
  payload,
});
export const signupSuccess = (payload) => ({
  type: CONSTANTS.SIGNUP_SUCCESS,
  payload,
});
export const signupError = () => ({
  type: CONSTANTS.SIGNUP_ERROR,
});

export const loginRequest = (email, password) => ({
  type: CONSTANTS.LOGIN_REQUEST,
  email,
  password,
});

export const loginSuccess = (payload) => ({
  type: CONSTANTS.LOGIN_SUCCESS,
  payload,
});

export const loginError = () => ({
  type: CONSTANTS.LOGIN_ERROR,
});

export const logout = () => ({
  type: CONSTANTS.LOGOUT,
});

export const updateProfileSuccess = (payload) => ({
  type: CONSTANTS.UPDATE_PROFILE_SUCCESS,
  payload,
});
