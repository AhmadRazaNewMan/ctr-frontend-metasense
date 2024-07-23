import {
  ADD_COLUMN_FAIL,
  ADD_COLUMN_REQUEST,
  ADD_COLUMN_SUCCESS,
  GET_STRUCTURED_DOCUMENT_FAIL,
  GET_STRUCTURED_DOCUMENT_REQUEST,
  GET_STRUCTURED_DOCUMENT_SUCCESS,
  STORE_STRUCTURED_DOCUMENT_FAIL,
  STORE_STRUCTURED_DOCUMENT_REQUEST,
  STORE_STRUCTURED_DOCUMENT_SUCCESS,
  UPLOAD_DOCUMENT_FAIL,
  UPLOAD_DOCUMENT_REQUEST,
  UPLOAD_DOCUMENT_STATUS,
  UPLOAD_DOCUMENT_SUCCESS,
} from "../constants/documentConstants";

const initialState = {
  loading: false,
  success: false,
  errors: [],
  documents: [],
  response: {},
  jobStatus: {},
};

export const getStructuredDocumentsReducer = (state = initialState, action) => {
  const { type, payload } = action;
  if (type === GET_STRUCTURED_DOCUMENT_REQUEST) {
    return { ...state, loading: true };
  } else if (type === GET_STRUCTURED_DOCUMENT_SUCCESS) {
    return {
      ...state,
      loading: false,
      success: true,
      documents: payload,
      errors: [],
    };
  } else if (type === GET_STRUCTURED_DOCUMENT_FAIL) {
    return { ...state, loading: false, success: false, errors: payload };
  } else {
    return state;
  }
};

export const storeStructuredDocumentsReducer = (
  state = initialState,
  action
) => {
  const { type, payload } = action;
  if (type === STORE_STRUCTURED_DOCUMENT_REQUEST) {
    return { ...state, loading: true };
  } else if (type === STORE_STRUCTURED_DOCUMENT_SUCCESS) {
    return {
      ...state,
      loading: false,
      success: true,
      response: payload,
      errors: [],
    };
  } else if (type === STORE_STRUCTURED_DOCUMENT_FAIL) {
    return { ...state, loading: false, success: false, errors: payload };
  } else {
    return state;
  }
};

export const uploadDocumentReducer = (state = initialState, action) => {
  const { type, payload } = action;
  if (type === UPLOAD_DOCUMENT_REQUEST) {
    return { ...state, loading: true };
  } else if (type === UPLOAD_DOCUMENT_SUCCESS) {
    return {
      ...state,
      loading: false,
      success: true,
      response: payload,
      jobStatus: {},
      errors: [],
    };
  } else if (type === UPLOAD_DOCUMENT_STATUS) {
    return {
      ...state,
      loading: false,
      success: true,
      jobStatus: payload,
      errors: [],
    };
  } else if (type === UPLOAD_DOCUMENT_FAIL) {
    return { ...state, loading: false, success: false, errors: payload };
  } else {
    return state;
  }
};

export const addColumnReducer = (state = initialState, action) => {
  const { type, payload } = action;
  if (type === ADD_COLUMN_REQUEST) {
    return { ...state, loading: true };
  } else if (type === ADD_COLUMN_SUCCESS) {
    return {
      ...state,
      loading: false,
      success: true,
      errors: [],
    };
  } else if (type === ADD_COLUMN_FAIL) {
    return { ...state, loading: false, success: false, errors: payload };
  } else {
    return state;
  }
};
