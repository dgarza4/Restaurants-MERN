import * as CONSTANTS from './constants';

const initialState = {
  authUser: null,
  token: null,
  authUserLoading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONSTANTS.SIGNUP_REQUEST:
      return {
        ...state,
        authUserLoading: true,
      };
    case CONSTANTS.SIGNUP_SUCCESS:
    case CONSTANTS.SIGNUP_ERROR:
      return {
        ...state,
        authUserLoading: false,
      };
    case CONSTANTS.LOGIN_REQUEST:
      return {
        ...state,
        authUserLoading: true,
      };
    case CONSTANTS.LOGIN_SUCCESS:
      return {
        ...state,
        authUser: action.payload,
        token: action.payload.token,
        authUserLoading: false,
      };
    case CONSTANTS.LOGIN_ERROR:
      return {
        ...state,
        authUserLoading: false,
      };
    case CONSTANTS.LOGOUT:
      return {
        ...state,
        authUser: null,
        token: null,
        authUserLoading: false,
      };

    case CONSTANTS.UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        authUserLoading: true,
      };
    case CONSTANTS.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        authUser: action.payload,
        authUserLoading: false,
      };
    case CONSTANTS.UPDATE_PROFILE_ERROR:
      return {
        ...state,
        authUserLoading: false,
      };

    default:
      return state;
  }
};
