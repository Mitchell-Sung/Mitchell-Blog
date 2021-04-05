import axios from 'axios';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import {
	POST_LOADING_FAILURE,
	POST_LOADING_REQUEST,
	POST_LOADING_SUCCESS,
} from '../types';

// All Posts Load
const loadPostAPI = () => {
	return axios.get('/api/post');
};

function* loadPosts(action) {
	try {
		const result = yield call(loadPostAPI, action.payload);
		yield put({
			type: POST_LOADING_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		yield put({
			type: POST_LOADING_FAILURE,
			payload: err,
		});
		yield push('/');
	}
}

function* watchLoadPosts() {
	yield takeEvery(POST_LOADING_REQUEST, loadPosts);
}

export default function* postSaga() {
	yield all([fork(watchLoadPosts)]);
}
