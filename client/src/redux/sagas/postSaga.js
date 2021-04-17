import axios from 'axios';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import {
	POST_DETAIL_LOADING_FAILURE,
	POST_DETAIL_LOADING_REQUEST,
	POST_DETAIL_LOADING_SUCCESS,
	POST_LOADING_FAILURE,
	POST_LOADING_REQUEST,
	POST_LOADING_SUCCESS,
	POST_UPLOADING_FAILURE,
	POST_UPLOADING_REQUEST,
	POST_UPLOADING_SUCCESS,
} from '../types';

/*
 *	All Posts Load
 */
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
	}
}

function* watchLoadPosts() {
	yield takeEvery(POST_LOADING_REQUEST, loadPosts);
}

/*
 *	Post Detail
 */
const loadPostDetailAPI = (payload) => {
	return axios.get(`/api/post/${payload}`);
};

function* loadPostDetail(action) {
	try {
		const result = yield call(loadPostDetailAPI, action.payload);
		yield put({
			type: POST_DETAIL_LOADING_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		yield put({
			type: POST_DETAIL_LOADING_FAILURE,
			payload: err,
		});
		yield put(push('/'));
	}
}

function* watchLoadPostDetail() {
	yield takeEvery(POST_DETAIL_LOADING_REQUEST, loadPostDetail);
}

/*
 *	Upload Post
 */
const uploadPostAPI = (payload) => {
	const config = { headers: { 'Content-Type': 'application/json' } };
	const token = payload.token;

	if (token) {
		config.headers['x-auth-token'] = token;
	}

	return axios.post('/api/post', payload, config);
};

function* uploadPosts(action) {
	try {
		const result = yield call(uploadPostAPI, action.payload);
		yield put({ type: POST_UPLOADING_SUCCESS, payload: result.data });
		yield put(push(`/post/${result.data._id}`));
	} catch (err) {
		yield put({ type: POST_UPLOADING_FAILURE, payload: err });
		yield put(push('/'));
	}
}

function* watchUploadPosts() {
	yield takeEvery(POST_UPLOADING_REQUEST, uploadPosts);
}

export default function* postSaga() {
	yield all([
		fork(watchLoadPosts),
		fork(watchUploadPosts),
		fork(watchLoadPostDetail),
	]);
}
