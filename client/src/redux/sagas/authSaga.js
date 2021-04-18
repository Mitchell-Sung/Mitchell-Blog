import axios from 'axios';
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
	REGISTER_FAILURE,
	REGISTER_SUCCESS,
	REGISTER_REQUEST,
	CLEAR_ERROR_SUCCESS,
	CLEAR_ERROR_FAILURE,
	CLEAR_ERROR_REQUEST,
} from '../types';

// s22 User Login
const loginUserAPI = (loginData) => {
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

// S28 Register User
const registerUserAPI = (request) => {
	const config = {
		Headers: {
			'Content-Type': 'application/json',
		},
	};
	return axios.post('api/user', request, config);
};

function* registerUser(action) {
	try {
		const result = yield call(registerUserAPI, action.payload);
		yield put({
			type: REGISTER_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		yield put({
			type: REGISTER_FAILURE,
			payload: err.response,
		});
	}
}

function* watchRegisterUser() {
	yield takeEvery(REGISTER_REQUEST, registerUser);
}

// s28 Clear Error
function* clearError() {
	try {
		yield put({
			type: CLEAR_ERROR_SUCCESS,
		});
	} catch (err) {
		yield put({
			type: CLEAR_ERROR_FAILURE,
		});
		console.log(err, 'authSaga.ja');
	}
}

function* watchClearError() {
	yield takeEvery(CLEAR_ERROR_REQUEST, clearError);
}

// s27 User Loading
const userLoadingAPI = (token) => {
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
		fork(watchRegisterUser),
		fork(watchClearError),
	]);
}
