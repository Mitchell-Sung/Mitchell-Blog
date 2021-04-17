import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import authSaga from './authSaga';
import postSaga from './postSaga';
import commentSaga from './commentSaga'; // s48

// s22 config dotenv under client folder.
import dotenv from 'dotenv';
dotenv.config();

// s22
axios.defaults.baseURL = process.env.REACT_APP_BASIC_SERVER_URL;

// s48 (commentSaga)
export default function* rootSaga() {
	yield all([fork(authSaga), fork(postSaga), fork(commentSaga)]);
}
