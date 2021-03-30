import axios from 'axios';
import { all, call, put, takeEvery, fork } from 'redux-saga/effects';
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS } from '../types';

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

// if get login user, call loginUser funcion.
function* watchLoginUser() {
    yield takeEvery(LOGIN_REQUEST, loginUser)
};

export default function* authSaga() {
    yield all([
        fork(watchLoginUser)
    ])
};