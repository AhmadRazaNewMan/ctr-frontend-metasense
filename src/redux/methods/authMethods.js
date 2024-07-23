import {
  ADMIN_LOGIN_FAIL,
  ADMIN_LOGIN_REQUEST,
  ADMIN_LOGIN_SUCCESS,
} from "../constants/authConstants";
import { supabase } from "../../config/supabase";

export const adminLogin = (email, password) => {
  return async (dispatch) => {
    try {
      dispatch({ type: ADMIN_LOGIN_REQUEST });

      //Check if Admin
      const { data: isAdmin, error: isAdminError } = await supabase
        .from("admin")
        .select("*")
        .eq("email", email);

      if (isAdminError || isAdmin.length === 0) {
        dispatch({
          type: ADMIN_LOGIN_FAIL,
          payload: [{ message: "Admin not found" }],
        });
        return;
      }

      //Login
      if (isAdmin && isAdmin.length > 0) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          dispatch({
            type: ADMIN_LOGIN_FAIL,
            payload: [error],
          });
          return;
        }
        dispatch({
          type: ADMIN_LOGIN_SUCCESS,
          payload: data.user.id,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: ADMIN_LOGIN_FAIL,
        payload: [error],
      });
      return;
    }
  };
};
