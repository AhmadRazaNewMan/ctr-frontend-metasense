import {
      FETCH_COMPANIES_WITHOUT_PDF_REQUEST,
      FETCH_COMPANIES_WITHOUT_PDF_SUCCESS,
      FETCH_COMPANIES_WITHOUT_PDF_FAIL,
      SCRAP_PDF_REQUEST,
      SCRAP_PDF_SUCCESS,
      SCRAP_PDF_FAIL,
    } from "../constants/companiesConstants";
    
    const initialState = {
      loading: false,
      success: false,
      errors: [],
      companiesWithoutPDFs: [],
      scrapResponse: {},
    };
    
    // Reducer for handling companies without PDFs
    export const fetchCompaniesWithoutPDFReducer = (state = initialState, action) => {
      const { type, payload } = action;
      if (type === FETCH_COMPANIES_WITHOUT_PDF_REQUEST) {
        return { ...state, loading: true };
      } else if (type === FETCH_COMPANIES_WITHOUT_PDF_SUCCESS) {
        return {
          ...state,
          loading: false,
          success: true,
          companiesWithoutPDFs: payload,
          errors: [],
        };
      } else if (type === FETCH_COMPANIES_WITHOUT_PDF_FAIL) {
        return { ...state, loading: false, success: false, errors: payload };
      } else {
        return state;
      }
    };
    
    // Reducer for scraping PDFs
    export const scrapPDFReducer = (state = initialState, action) => {
      const { type, payload } = action;
      if (type === SCRAP_PDF_REQUEST) {
        return { ...state, loading: true };
      } else if (type === SCRAP_PDF_SUCCESS) {
        return {
          ...state,
          loading: false,
          success: true,
          scrapResponse: payload,
          errors: [],
        };
      } else if (type === SCRAP_PDF_FAIL) {
        return { ...state, loading: false, success: false, errors: payload };
      } else {
        return state;
      }
    };
    