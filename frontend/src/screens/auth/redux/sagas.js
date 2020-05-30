import { put, takeLatest, call } from 'redux-saga/effects';

import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

import { request } from '../../../utils';
import { history } from '../../../configureStore';

import { enqueueSnackbar } from '../../../shared/Notifier/redux/actions';

function* signup(action) {
  try {
    const data = yield call(request, '/auth/signup', 'POST', action.payload);

    yield put(ACTIONS.signupSuccess(data));
    history.push('/signin');
  } catch (err) {
    yield put(ACTIONS.signupError());
    yield put(enqueueSnackbar(err.message, 'error'));
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
    yield put(enqueueSnackbar(err.message, 'error'));
  }
}

export default function* authSaga() {
  yield takeLatest(CONSTANTS.SIGNUP_REQUEST, signup);
  yield takeLatest(CONSTANTS.LOGIN_REQUEST, login);
}
