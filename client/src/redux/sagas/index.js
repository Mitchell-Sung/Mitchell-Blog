import { all, fork } from 'redux-saga/effects';
import axios from 'axios';
import authSaga from './authSaga';
import postSaga from './postSaga';
import commentSaga from './commentSaga'; // [s48]
import dotenv from 'dotenv'; // [s22] under client folder
dotenv.config();

// [s22]
axios.defaults.baseURL = process.env.REACT_APP_BASIC_SERVER_URL;

// [s48]
export default function* rootSaga() {
	yield all([fork(authSaga), fork(postSaga), fork(commentSaga)]);
}
