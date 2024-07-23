import React, { Fragment, useEffect } from "react";
import NProgress from "nprogress";
import "./ProgressBar.css";

export default function ProgressBar({ spinner = false }) {
  NProgress.configure({ showSpinner: spinner });

  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return <Fragment></Fragment>;
}
