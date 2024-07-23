import {
  EDIT_PROFILE_FAIL,
  EDIT_PROFILE_REQUEST,
  EDIT_PROFILE_SUCCESS,
  GET_SPECIFIC_USER_FAIL,
  GET_SPECIFIC_USER_REQUEST,
  GET_SPECIFIC_USER_SUCCESS,
  GET_USERS_FAIL,
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  UPLOAD_IMAGE_FAIL,
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_SUCCESS,
} from "../constants/userConstants";

const initialState = {
  loading: false,
  success: false,
  errors: [],
  users: [],
  user: {},
  imageURL: "",
};

export const getUsersReducer = (state = initialState, action) => {
  const { type, payload } = action;
  if (type === GET_USERS_REQUEST) {
    return { ...state, loading: true };
  } else if (type === GET_USERS_SUCCESS) {
    return {
      ...state,
      loading: false,
      success: true,
      users: payload,
      errors: [],
    };
  } else if (type === GET_USERS_FAIL) {
    return { ...state, loading: false, success: false, errors: payload };
  } else {
    return state;
  }
};

export const getSpecificUserReducer = (state = initialState, action) => {
  const { type, payload } = action;
  if (type === GET_SPECIFIC_USER_REQUEST) {
    return { ...state, loading: true };
  } else if (type === GET_SPECIFIC_USER_SUCCESS) {
    return {
      ...state,
      loading: false,
      success: true,
      user: payload,
      errors: [],
    };
  } else if (type === GET_SPECIFIC_USER_FAIL) {
    return { ...state, loading: false, success: false, errors: payload };
  } else {
    return state;
  }
};

export const editProfileReducer = (state = initialState, action) => {
  const { type, payload } = action;
  if (type === EDIT_PROFILE_REQUEST) {
    return { ...state, loading: true };
  } else if (type === EDIT_PROFILE_SUCCESS) {
    return {
      ...state,
      loading: false,
      success: true,
      errors: [],
    };
  } else if (type === EDIT_PROFILE_FAIL) {
    return { ...state, loading: false, success: false, errors: payload };
  } else {
    return state;
  }
};

export const uploadImageReducer = (state = initialState, action) => {
  const { type, payload } = action;
  if (type === UPLOAD_IMAGE_REQUEST) {
    return { ...state, loading: true };
  } else if (type === UPLOAD_IMAGE_SUCCESS) {
    return {
      ...state,
      loading: false,
      success: true,
      imageURL: payload,
      errors: [],
    };
  } else if (type === UPLOAD_IMAGE_FAIL) {
    return { ...state, loading: false, success: false, errors: payload };
  } else {
    return state;
  }
};
