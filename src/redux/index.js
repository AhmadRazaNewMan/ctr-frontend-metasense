import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

//Reducers
import { adminLoginReducer } from "./reducers/authReducers";

import {
  getStructuredDocumentsReducer,
  storeStructuredDocumentsReducer,
  uploadDocumentReducer,
  addColumnReducer,
} from "./reducers/documentReducers";

import {
  fetchCompaniesWithoutPDFReducer,
  scrapPDFReducer,
} from "./reducers/companiesReducer";

import {
  getUsersReducer,
  getSpecificUserReducer,
  editProfileReducer,
  uploadImageReducer,
} from "./reducers/userReducers";

const rootReducers = combineReducers({
  adminLoginReducer,

  getStructuredDocumentsReducer,
  storeStructuredDocumentsReducer,
  uploadDocumentReducer,
  addColumnReducer,

  getUsersReducer,
  getSpecificUserReducer,
  editProfileReducer,
  uploadImageReducer,

  fetchCompaniesWithoutPDFReducer,
  scrapPDFReducer,
});

const middlewares = [thunkMiddleware];
const Store = createStore(
  rootReducers,
  composeWithDevTools(applyMiddleware(...middlewares))
);

export default Store;
