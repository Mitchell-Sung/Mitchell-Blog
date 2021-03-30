import axios from 'axios';
import { all, call, put, takeEvery, fork } from 'redux-saga/effects';
import { 
    LOGIN_FAILURE, 
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
} from '../types';

// s22 login 
const loginUserAPI = (loginData) => {
    console.log(loginData, 'loginData');
    const config = {
        Headers: {
            'Content-Type': 'application/json'
        }
    };
    return axios.post('api/auth', loginData, config)
};

function* loginUser(loginAction) {
    try {
        const result = yield call(loginUserAPI, loginAction.payload);
        console.log(result)
        // put is the same as Dispatch
        yield put({
            type: LOGIN_SUCCESS,
            payload: result.data
        })
    } catch(err) {
        yield put({
            type: LOGIN_FAILURE,
            payload: err.response
        })
    }
};

function* watchLoginUser() {
    yield takeEvery(LOGIN_REQUEST, loginUser);
};

// s24 logout
function* logout(loginAction) {
    try {
        yield put({type: LOGOUT_SUCCESS});
    } catch(err) {
        yield put({type: LOGOUT_FAILURE});
        console.log(err);
    }
};

// if get LOGOUT-REQUEST,call the logout function.
function* watchlogout() {
    yield takeEvery(LOGOUT_REQUEST, logout);
};

export default function* authSaga() {
    yield all([fork(watchLoginUser), fork(watchlogout)]);
};