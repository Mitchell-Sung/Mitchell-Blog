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
	PASSWORD_EDIT_UPLOADING_FAILURE,
	PASSWORD_EDIT_UPLOADING_SUCCESS,
	PASSWORD_EDIT_UPLOADING_REQUEST,
} from '../types';

/**
 * 	[s22] User Login
 */
const loginUserAPI = (loginData) => {
	// console.log(loginData, 'loginData');
	const config = {
		Headers: {
			'Content-Type': 'application/json',
		},
	};
	return axios.post('api/auth', loginData, config);
};

function* loginUser(action) {
	try {
		const result = yield call(loginUserAPI, action.payload);
		// console.log(result);
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

/**
 * 	[s24] User Logout
 */
function* logout(action) {
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

/**
 * 	[s28] Register User
 */
const registerUserAPI = (request) => {
	// console.log(request, 'request');
	// const config = {
	// 	Headers: {
	// 		'Content-Type': 'application/json',
	// 	},
	// };
	// return axios.post('api/user', request, config);
	return axios.post('api/user', request);
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

/**
 * 	[s28] Clear Error
 */
function* clearError() {
	try {
		yield put({
			type: CLEAR_ERROR_SUCCESS,
		});
	} catch (err) {
		yield put({
			type: CLEAR_ERROR_FAILURE,
		});
		console.error(err);
	}
}

function* watchClearError() {
	yield takeEvery(CLEAR_ERROR_REQUEST, clearError);
}

/**
 * 	[s27] User Loading
 */
const userLoadingAPI = (token) => {
	// console.log(token);
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
		// console.log(action, 'userLoading');
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

/**
 * 	[s58] Edit Password
 */
const EditPasswordAPI = (payload) => {
	const config = { headers: { 'Content-Type': 'application/json' } };
	const token = payload.token;

	if (token) {
		config.headers['x-auth-token'] = token;
	}
	// Check the order of 'payload' and 'config'
	return axios.post(`/api/user/${payload.userName}/profile`, payload, config);
};

function* EditPassword(action) {
	try {
		// console.log(action, 'EditPassword');
		const result = yield call(EditPasswordAPI, action.payload);
		yield put({
			type: PASSWORD_EDIT_UPLOADING_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		yield put({
			type: PASSWORD_EDIT_UPLOADING_FAILURE,
			payload: err.response,
		});
	}
}

function* watchEditPassword() {
	yield takeEvery(PASSWORD_EDIT_UPLOADING_REQUEST, EditPassword);
}

export default function* authSaga() {
	yield all([
		fork(watchLoginUser),
		fork(watchLogout),
		fork(watchUserLoading),
		fork(watchRegisterUser),
		fork(watchClearError),
		fork(watchEditPassword),
	]);
}
