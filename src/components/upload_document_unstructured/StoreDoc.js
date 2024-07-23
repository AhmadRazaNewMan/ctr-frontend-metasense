import React, { useEffect, useState } from "react";
import { Button, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

//Components
import { storeStructuredDocuments } from "../../redux/methods/documentMethods";

export default function StoreDoc({ prevStep }) {
  const [id, setId] = useState(null);
  const [year, setYear] = useState(null);

  const dispatch = useDispatch();
  const { loading, response, errors } = useSelector(
    (state) => state.storeStructuredDocumentsReducer
  );

  //Display Errors
  useEffect(() => {
    if (errors.length > 0) {
      errors.map((err) => {
        if (err.response) {
          return toast.error(err.response.data.msg);
        } else {
          return toast.error(err.message);
        }
      });
    }
  }, [errors]);

  //Functions
  const handleStoreDocument = () => {
    if (!id) return toast.error("Company ID is required");
    if (!year) return toast.error("Year is required");

    dispatch(storeStructuredDocuments(id, year));
  };

  return (
    <div>
      <div className="mt-5">
        <p className="block text-sm font-bold font-poppins text-gray-900">
          Company ID (Supabase)
        </p>
        <Input
          className="bg-gray-50 font-lato text-gray-900 sm:text-sm py-1.5 w-80"
          placeholder="Enter ID"
          onChange={(e) => setId(e.target.value)}
        />
      </div>
      <div className="mt-5">
        <p className="block text-sm font-bold font-poppins text-gray-900">
          Year
        </p>
        <Input
          className="bg-gray-50 font-lato text-gray-900 sm:text-sm py-1.5 w-80"
          placeholder="Enter Year of Data"
          onChange={(e) => setYear(e.target.value)}
        />
      </div>
      <Button
        className="mt-4 bg-black"
        type="primary"
        size="large"
        loading={loading}
        onClick={handleStoreDocument}
      >
        Execute
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="h-auto md:h-full">
          <p className="block text-sm font-bold font-poppins text-gray-900">
            Request
          </p>
          <pre className="h-auto md:h-full">
            <code className="language-javascript">
              {`
fetch(
  'https://ctr-backend-metasense.vercel.app/api/document/store-structured-data/:id', 
{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
})
.then(response => response.json())
.then(data => console.log(data));
`}
            </code>
          </pre>
        </div>
        <div className="h-auto md:h-full">
          <p className="block text-sm font-bold font-poppins text-gray-900">
            Response
          </p>
          <pre className="h-auto md:h-full">
            <code className="language-javascript">
              {Object.keys(response).length === 0 ? (
                `
{
"status": true,
"data": {}
}
`
              ) : (
                <pre>{JSON.stringify(response, null, 2)}</pre>
              )}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
