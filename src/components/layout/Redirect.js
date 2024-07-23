import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../config/supabase";

//Components
import { webRoutes } from "../../routes/web";

export default function Redirect() {
  const [token, setToken] = useState(false);
  const [execute, setExecute] = useState(false);

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

  return execute ? (
    <Navigate to={token ? webRoutes.dashboard : webRoutes.login} replace />
  ) : null;
}
