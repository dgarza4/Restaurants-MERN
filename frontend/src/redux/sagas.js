import { all, fork } from 'redux-saga/effects';

import authSaga from '../screens/auth/redux/sagas';

export default function* root() {
  yield all([fork(authSaga)]);
}
