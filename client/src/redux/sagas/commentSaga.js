import axios from 'axios';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
	COMMENT_LOADING_FAILURE,
	COMMENT_LOADING_REQUEST,
	COMMENT_LOADING_SUCCESS,
	COMMENT_UPLOADING_FAILURE,
	COMMENT_UPLOADING_REQUEST,
	COMMENT_UPLOADING_SUCCESS,
} from '../types';
import { push } from 'connected-react-router';

/*
 *  Load Comment (s47)
 */
const loadCommentsAPI = (payload) => {
	// console.log(payload, "loadCommentAPI ID");
	return axios.get(`/api/post/${payload}/comments`);
};

function* loadComments(action) {
	try {
		const result = yield call(loadCommentsAPI, action.payload);
		// console.log(result);
		yield put({
			type: COMMENT_LOADING_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: COMMENT_LOADING_FAILURE,
			payload: err,
		});
		yield push('/');
	}
}

function* watchLoadComments() {
	yield takeEvery(COMMENT_LOADING_REQUEST, loadComments);
}

/*
 *  Upload Comment (s47)
 */
const uploadCommentsAPI = (payload) => {
	return axios.post(`/api/post/${payload.id}/comments`, payload);
};

function* uploadComments(action) {
	try {
		// console.log(action);
		const result = yield call(uploadCommentsAPI, action.payload);
		// console.log(result);
		yield put({
			type: COMMENT_UPLOADING_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: COMMENT_UPLOADING_FAILURE,
			payload: err,
		});
		yield push('/');
	}
}

function* watchUploadComments() {
	yield takeEvery(COMMENT_UPLOADING_REQUEST, uploadComments);
}

export default function* commentSaga() {
	yield all([fork(watchLoadComments), fork(watchUploadComments)]);
}
