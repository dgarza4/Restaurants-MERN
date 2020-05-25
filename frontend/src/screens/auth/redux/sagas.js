import { put, takeLatest, call } from 'redux-saga/effects';

import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

import { request } from '../../../utils';
import { history } from '../../../configureStore';

function* signup(action) {
  try {
    const data = yield call(request, '/auth/signup', 'POST', action.data);

    yield put(ACTIONS.signupSuccess(data));
    history.push('/signin');
  } catch (err) {
    yield put(ACTIONS.signupError());
  }
}

function* login(action) {
  try {
    const requestData = {
      email: action.email,
      password: action.password,
    };

    const data = yield call(request, '/auth/login', 'POST', requestData, false);
    yield put(ACTIONS.loginSuccess(data));
  } catch (err) {
    yield put(ACTIONS.loginError());
  }
}

function* updateProfile(action) {
  try {
    const data = yield call(request, '/profile', 'PUT', action.payload, true);

    history.push('/');
    yield put(ACTIONS.updateProfileSuccess(data));
  } catch (err) {
    yield put(ACTIONS.updateProfileError());
  }
}

export default function* authSaga() {
  yield takeLatest(CONSTANTS.SIGNUP_REQUEST, signup);
  yield takeLatest(CONSTANTS.LOGIN_REQUEST, login);
  yield takeLatest(CONSTANTS.UPDATE_PROFILE_REQUEST, updateProfile);
}
