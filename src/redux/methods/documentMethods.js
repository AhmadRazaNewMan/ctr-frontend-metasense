import {
  GET_STRUCTURED_DOCUMENT_FAIL,
  GET_STRUCTURED_DOCUMENT_SUCCESS,
  GET_STRUCTURED_DOCUMENT_REQUEST,
  STORE_STRUCTURED_DOCUMENT_REQUEST,
  STORE_STRUCTURED_DOCUMENT_SUCCESS,
  STORE_STRUCTURED_DOCUMENT_FAIL,
  UPLOAD_DOCUMENT_REQUEST,
  UPLOAD_DOCUMENT_SUCCESS,
  UPLOAD_DOCUMENT_FAIL,
  UPLOAD_DOCUMENT_STATUS,
  ADD_COLUMN_REQUEST,
  ADD_COLUMN_SUCCESS,
  ADD_COLUMN_FAIL,
} from "../constants/documentConstants";
import { BASE_URL } from "../constants/constants";
import axios from "axios";

export const getStructuredDocuments = (
  search = "",
  country_code,
  revenuetsek
) => {
  return async (dispatch) => {
    try {
      dispatch({ type: GET_STRUCTURED_DOCUMENT_REQUEST });

      const response = await axios.post(
        `${BASE_URL}/api/document/get-structured-data`,
        { company_name: search, country_code, revenuetsek },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({
        type: GET_STRUCTURED_DOCUMENT_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: GET_STRUCTURED_DOCUMENT_FAIL,
        payload: [{ message: error.message }],
      });
    }
  };
};

export const storeStructuredDocuments = (id, year) => {
  return async (dispatch) => {
    try {
      dispatch({ type: STORE_STRUCTURED_DOCUMENT_REQUEST });

      const response = await axios.post(
        `${BASE_URL}/api/document/store-structured-data/${id}`,
        { year },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({
        type: STORE_STRUCTURED_DOCUMENT_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: STORE_STRUCTURED_DOCUMENT_FAIL,
        payload: [error],
      });
    }
  };
};

export const uploadDocument = (formData, type) => {
  return async (dispatch) => {
    try {
      dispatch({ type: UPLOAD_DOCUMENT_REQUEST });
      let uploadResponse;

      if (type === "adobe") {
        console.log("Adobe API Hit");
        uploadResponse = await axios.post(
          `${BASE_URL}/api/document/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else if (type === "llama") {
        console.log("Llama API Hit");
        uploadResponse = await axios.post(
          `${BASE_URL}/api/document/upload-llama`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else if (type === "unstructured") {
        console.log("Unstructured API Hit");
        uploadResponse = await axios.post(
          `${BASE_URL}/api/document/upload-unstructured`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      dispatch({
        type: UPLOAD_DOCUMENT_SUCCESS,
        payload: uploadResponse.data,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: UPLOAD_DOCUMENT_FAIL,
        payload: [error],
      });
    }
  };
};

export const checkJobStatus = () => {
  return async (dispatch) => {
    try {
      let jobStatus;

      do {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const statusResponse = await axios.get(
          console.log("get current status")
          `${BASE_URL}/api/document/status`
        );

        dispatch({
          type: UPLOAD_DOCUMENT_STATUS,
          payload: statusResponse.data,
        });

        jobStatus = statusResponse.data;
      } while (jobStatus.status === "ONGOING");

      if (jobStatus.status === true) {
        dispatch({
          type: UPLOAD_DOCUMENT_SUCCESS,
          payload: jobStatus,
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: UPLOAD_DOCUMENT_FAIL,
        payload: [error],
      });
    }
  };
};

export const exportDocument = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: UPLOAD_DOCUMENT_REQUEST });

      const response = await axios.get(`${BASE_URL}/api/document/export`, {
        responseType: "blob",
      });

      //Creating Blob and Download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "exported_data.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      dispatch({ type: UPLOAD_DOCUMENT_SUCCESS });
    } catch (error) {
      console.error(error);
      dispatch({
        type: UPLOAD_DOCUMENT_FAIL,
        payload: [error],
      });
    }
  };
};

export const addColumn = (columnName, columnType) => {
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_COLUMN_REQUEST });

      await axios.post(
        `${BASE_URL}/api/document/add-column`,
        {
          columnName,
          columnType,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch({ type: ADD_COLUMN_SUCCESS });
    } catch (error) {
      console.error(error);
      dispatch({
        type: ADD_COLUMN_FAIL,
        payload: [error],
      });
    }
  };
};
