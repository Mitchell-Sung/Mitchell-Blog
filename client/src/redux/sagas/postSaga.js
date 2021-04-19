import axios from 'axios';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import {
	POST_DELETE_FAILURE,
	POST_DELETE_REQUEST,
	POST_DELETE_SUCCESS,
	POST_DETAIL_LOADING_FAILURE,
	POST_DETAIL_LOADING_REQUEST,
	POST_DETAIL_LOADING_SUCCESS,
	POST_EDIT_LOADING_FAILURE,
	POST_EDIT_LOADING_REQUEST,
	POST_EDIT_LOADING_SUCCESS,
	POST_EDIT_UPLOADING_FAILURE,
	POST_EDIT_UPLOADING_REQUEST,
	POST_EDIT_UPLOADING_SUCCESS,
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
 *	Post upload
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

/*
 *	Post delete [s49]
 */
const DeletePostAPI = (payload) => {
	const config = { headers: { 'Content-Type': 'application/json' } };
	const token = payload.token;

	if (token) {
		config.headers['x-auth-token'] = token;
	}

	return axios.delete(`/api/post/${payload.id}`, config);
};

function* DeletePost(action) {
	try {
		const result = yield call(DeletePostAPI, action.payload);
		yield put({ type: POST_DELETE_SUCCESS, payload: result.data });
		yield put(push('/'));
	} catch (err) {
		yield put({ type: POST_DELETE_FAILURE, payload: err });
	}
}

function* watchDeletePost() {
	yield takeEvery(POST_DELETE_REQUEST, DeletePost);
}

/*
 *	Post edit load [s51]
 */
const PostEditLoadAPI = (payload) => {
	const config = {
		headers: { 'Content-Type': 'application/json' },
	};
	const token = payload.token;

	if (token) {
		config.headers['x-auth-token'] = token;
	}

	return axios.get(`./api/post/${payload.id}/edit`, config);
};

function* PostEditLoad(action) {
	try {
		const result = yield call(PostEditLoadAPI, action.payload);
		yield put({
			type: POST_EDIT_LOADING_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		yield put({
			type: POST_EDIT_LOADING_FAILURE,
			payload: err,
		});
		yield put(push('/'));
	}
}

function* watchPostEditLoad() {
	yield takeEvery(POST_EDIT_LOADING_REQUEST, PostEditLoad);
}

/*
 *	Post edit upload [s51]
 */
const PostEditUploadAPI = (payload) => {
	const config = { headers: { 'Content-Type': 'application/json' } };
	const token = payload.token;

	if (token) {
		config.headers['x-auth-token'] = token;
	}

	return axios.post(`/api/post/${payload.id}/edit`, payload, config);
};

function* PostEditUpload(action) {
	try {
		const result = yield call(PostEditUploadAPI, action.payload);
		yield put({ type: POST_EDIT_UPLOADING_SUCCESS, payload: result.data });
		yield put(push(`/post/${result.data._id}`));
	} catch (err) {
		yield put({ type: POST_EDIT_UPLOADING_FAILURE, payload: err });
	}
}

function* watchPostEditUpload() {
	yield takeEvery(POST_EDIT_UPLOADING_REQUEST, PostEditUpload);
}

export default function* postSaga() {
	yield all([
		fork(watchLoadPosts),
		fork(watchUploadPosts),
		fork(watchLoadPostDetail),
		fork(watchDeletePost),
		fork(watchPostEditLoad),
		fork(watchPostEditUpload),
	]);
}
