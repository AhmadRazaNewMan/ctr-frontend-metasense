import React from "react";

//Packages
import { RouterProvider } from "react-router-dom";
import { browserRouter } from "./routes/browerRouter";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="fade-in">
      <RouterProvider router={browserRouter} />
      <Toaster />
    </div>
  );
}

export default App;
