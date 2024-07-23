import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import { Navigate, useLocation } from "react-router-dom";

//Components
import { webRoutes } from "./web";

export default function RequireAuth({ children }) {
  const [token, setToken] = useState(false);
  const [execute, setExecute] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (data.session !== null) {
          setToken(true);
        } else if (error) {
          console.log("Error getting session:", error);
        }
        setExecute(true);
      } catch (error) {
        console.error("Error getting session:", error.message);
        setExecute(true);
      }
    };

    fetchSession();
  }, []);

  if (execute) {
    if (!token) {
      return (
        <Navigate to={webRoutes.login} state={{ from: location }} replace />
      );
    }
  }

  return children;
}
