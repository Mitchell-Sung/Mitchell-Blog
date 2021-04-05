import { all, fork } from 'redux-saga/effects';
import axios from 'axios';
import authSaga from './authSaga';
import dotenv from 'dotenv';
import postSaga from './postSaga';

// s22 config dotenv under client folder.
dotenv.config();

// s22
axios.defaults.baseURL = process.env.REACT_APP_BASIC_SERVER_URL;

// The function* declaration defines a generator function,
// which returns a Generator object.
export default function* rootSaga() {
	yield all([fork(authSaga), fork(postSaga)]);
}
