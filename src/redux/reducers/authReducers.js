import {
  ADMIN_LOGIN_FAIL,
  ADMIN_LOGIN_REQUEST,
  ADMIN_LOGIN_SUCCESS,
} from "../constants/authConstants";

const initialState = {
  loading: false,
  success: false,
  errors: [],
  admin: "",
};

export const adminLoginReducer = (state = initialState, action) => {
  const { type, payload } = action;
  if (type === ADMIN_LOGIN_REQUEST) {
    return { ...state, loading: true };
  } else if (type === ADMIN_LOGIN_SUCCESS) {
    return {
      ...state,
      loading: false,
      success: true,
      admin: payload,
      errors: [],
    };
  } else if (type === ADMIN_LOGIN_FAIL) {
    return { ...state, loading: false, success: false, errors: payload };
  } else {
    return state;
  }
};
