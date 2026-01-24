import {
    API_ERROR,
    LOGIN_SUCCESS,
    LOGIN_USER,
    LOGOUT_USER,
    LOGOUT_USER_SUCCESS,
} from "./actionTypes";

const initialState = {
  error: "",
  loading: false,
  user: JSON.parse(localStorage.getItem("authUser")),
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOGIN_SUCCESS:
      state = {
        ...state,
        user: action.payload,
        isUserLogout: false,
        loading: false,
      };
      break;
    case LOGOUT_USER:
      state = { 
        ...state, 
        user: null,
        isUserLogout: true };
      break;
    case LOGOUT_USER_SUCCESS:
      state = { ...state, isUserLogout: true };
      break;
    case API_ERROR:
      state = {
        ...state,
        error: action.payload,
        loading: false,
        isUserLogout: false,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default login;
