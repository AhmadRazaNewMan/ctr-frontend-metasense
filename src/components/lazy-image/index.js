import { useState, Fragment, useEffect } from "react";

export default function LazyImage({ placeholder, src, ...rest }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const imageToLoad = new Image();
    imageToLoad.src = src;

    imageToLoad.onload = () => {
      setLoading(false);
    };
  }, [src]);

  return (
    <Fragment>{loading ? placeholder : <img src={src} alt="Lazy Load" {...rest} />}</Fragment>
  );
}
