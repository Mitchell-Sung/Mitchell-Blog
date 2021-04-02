import axios from 'axios';
import e from 'cors';
import { all, call, put, takeEvery, fork } from 'redux-saga/effects';
import {
	LOGIN_FAILURE,
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGOUT_REQUEST,
	LOGOUT_SUCCESS,
	LOGOUT_FAILURE,
	USER_LOADING_SUCCESS,
	USER_LOADING_FAILURE,
	USER_LOADING_REQUEST,
} from '../types';

// s22 User Login
const loginUserAPI = (loginData) => {
	console.log(loginData, 'loginData');
	const config = {
		Headers: {
			'Content-Type': 'application/json',
		},
	};
	return axios.post('api/auth', loginData, config);
};

function* loginUser(loginAction) {
	try {
		const result = yield call(loginUserAPI, loginAction.payload);
		console.log(result);
		// put is the same as Dispatch
		yield put({
			type: LOGIN_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		yield put({
			type: LOGIN_FAILURE,
			payload: err.response,
		});
	}
}

function* watchLoginUser() {
	yield takeEvery(LOGIN_REQUEST, loginUser);
}

// s24 User Logout
function* logout(loginAction) {
	try {
		yield put({ type: LOGOUT_SUCCESS });
	} catch (err) {
		yield put({ type: LOGOUT_FAILURE });
		console.log(err);
	}
}

function* watchLogout() {
	yield takeEvery(LOGOUT_REQUEST, logout);
}

// s27 User Loading
const userLoadingAPI = (token) => {
	console.log(token);
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	if (token) {
		config.headers['x-auth-token'] = token;
	}
	return axios.get('api/auth/user', config);
};

function* userLoading(action) {
	try {
		console.log(action, 'userLoading');
		const result = yield call(userLoadingAPI, action.payload);
		yield put({
			type: USER_LOADING_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		yield put({
			type: USER_LOADING_FAILURE,
			payload: err.response,
		});
	}
}

function* watchUserLoading() {
	yield takeEvery(USER_LOADING_REQUEST, userLoading);
}

export default function* authSaga() {
	yield all([
		fork(watchLoginUser),
		fork(watchLogout),
		fork(watchUserLoading),
	]);
}
