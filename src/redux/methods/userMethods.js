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
import { supabase } from "../../config/supabase";

export const getAllUsers = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: GET_USERS_REQUEST });

      const { data, error } = await supabase.from("users").select("*");

      if (error) {
        dispatch({
          type: GET_USERS_FAIL,
          payload: [error],
        });
        return;
      }

      dispatch({
        type: GET_USERS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: GET_USERS_FAIL,
        payload: [{ message: error.message }],
      });
    }
  };
};

export const getSpecificUser = (id) => {
  return async (dispatch) => {
    try {
      dispatch({ type: GET_SPECIFIC_USER_REQUEST });

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id);

      if (error) {
        dispatch({
          type: GET_SPECIFIC_USER_FAIL,
          payload: [error],
        });
        return;
      }

      dispatch({
        type: GET_SPECIFIC_USER_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: GET_SPECIFIC_USER_FAIL,
        payload: [{ message: error.message }],
      });
    }
  };
};

export const editUserDetail = (info) => {
  return async (dispatch) => {
    try {
      dispatch({ type: EDIT_PROFILE_REQUEST });

      const { error } = await supabase
        .from("users")
        .update({
          profile_image: info.profile_image,
          name: info.name,
          phone_number: info.phone_number,
        })
        .eq("id", info.id);

      if (error) {
        dispatch({
          type: EDIT_PROFILE_FAIL,
          payload: [error],
        });
        return;
      }

      dispatch({
        type: EDIT_PROFILE_SUCCESS,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: EDIT_PROFILE_FAIL,
        payload: [{ message: error.message }],
      });
    }
  };
};

export const uploadImage = (filePath, file) => {
  return async (dispatch) => {
    try {
      dispatch({ type: UPLOAD_IMAGE_REQUEST });

      //Upload Image
      const { error } = await supabase.storage
        .from("CTI")
        .upload(filePath, file);

      if (error) {
        dispatch({
          type: UPLOAD_IMAGE_FAIL,
          payload: [error],
        });
        return;
      }

      //Get Public URL
      const { data } = supabase.storage.from("CTI").getPublicUrl(filePath);

      dispatch({
        type: UPLOAD_IMAGE_SUCCESS,
        payload: data.publicUrl,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: UPLOAD_IMAGE_FAIL,
        payload: [{ message: error.message }],
      });
    }
  };
};
