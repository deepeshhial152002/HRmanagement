import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Linkpage = () => {
  const [values, setValues] = useState({ url: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (values.url === "") {
        alert("All fields are required");
      } else {
        const response = await axios.post(`http://qodeit.store/api/submit-link`, { url: values.url }, { headers });
        alert(response.data.message);
        // Optionally refetch or update the state here
        // e.g., fetchUrlData(); // Assuming you have a function to fetch URL data
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
        alert(error.response.data.message);
      } else {
        setError("Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-11">
      <form className="space-y-6 w-[60vh]" onSubmit={submit}>
        <div className="flex items-center justify-between">
          <input
            id="url"
            name="url"
            type="text"
            autoComplete="url"
            required
            className="w-full h-10 px-3 border-2 rounded-md"
            placeholder="Enter URL"
            value={values.url}
            onChange={change}
          />
          <button
            type="submit"
            className="h-10 ml-4 text-white rounded-md w-28 bg-zinc-700"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save URL'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Linkpage;
