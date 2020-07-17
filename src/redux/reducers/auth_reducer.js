import {userAPI} from '../../api/api'
import {stopSubmit} from "redux-form";

const SET_USER_DATA = 'auth_reducers/SET_USER_DATA';
const SET_AUTHENTICATE = 'auth_reducers/SET_AUTHENTICATE';
const LOG_OUT = 'auth_reducers/LOG_OUT';
const SET_NEW_USER = 'auth_reducers/SET_NEW_USER';

const initialState = {
    currentUser: {
        userID: null,
        email: null,
        login: null,
    },
    isAuthenticate: false,

    isNewUser: false,
}


const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_DATA:
            return {
                ...state,
                currentUser: action.data,
            }
        case SET_AUTHENTICATE:
            return {
                ...state,
                isAuthenticate: action.isAuthenticate,
            }
        case LOG_OUT:
            return {
                ...state,
                currentUser: {
                    userID: null,
                    email: null,
                    login: null,
                },
                isAuthenticate: false,
            }
        case SET_NEW_USER:
            return {
                ...state,
                isNewUser: action.isNewUser,
            }
        default:
            return state;

    }
}


export const setUserData = (currentUser) => ({type: SET_USER_DATA, data: currentUser})
export const setAuthenticate = (isAuth) => ({type: SET_AUTHENTICATE, isAuthenticate: isAuth})
export const logOut = () => ({type: LOG_OUT})
export const setIsNewUser = (isNewUser) => ({type: SET_NEW_USER, isNewUser})

export const loginUser = (username, password) => {
    return dispatch => {

        userAPI.loginUser({username, password})
            .then(
                response => {
                    console.log(response);
                    localStorage.setItem("refresh", response.refresh);
                    localStorage.setItem("access", response.access);
                    dispatch(isLogged());
                }
            )
            .catch(
                error => {
                    console.log(error.response)
                    dispatch(stopSubmit("login", {_error: error.response.data.detail}))
                }
            )
    }
}

export const createUser = (username, email, last_name, first_name, password) => async dispatch => {

    try{
        let response = await userAPI.createNewUser(username, email, last_name, first_name, password)
        await dispatch(loginUser(username, password));
        dispatch(setIsNewUser(true));
    } catch (e) {
        if (e.response.status === 400){
            dispatch(stopSubmit("registration/signup", e.response.data))
        }
    }
}

export const isLogged = () => async dispatch => {
    if (!localStorage.access) return Promise.resolve();
    try {
        let response = await userAPI.isLoggedIn()
        console.log(response);
        dispatch(setUserData({
            userID: response.id,
            email: response.email,
            login: response.username,
        }))
        dispatch(setAuthenticate(true));

    } catch (error) {

        dispatch(setAuthenticate(false));
        if (error.response.status === 401) {
            dispatch(refreshToken())
        } else {
            console.log(error.response);
            localStorage.removeItem("refresh");
            localStorage.removeItem("access");

        }
    }
}

export const refreshToken = () => async dispatch => {
    try {
        let data = await userAPI.refreshToken()
        console.log(data);
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        dispatch(isLogged());
    } catch (error) {
        console.log(error.response);
        localStorage.removeItem("refresh");
        localStorage.removeItem("access");
    }
}

export const userLogOut = () => async dispatch => {
    if (!localStorage.refresh) return;
    try {
        await userAPI.blacklistToken()

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        dispatch(logOut());
    } catch (error) {
        console.log(error.response);
    }
}


export default authReducer;