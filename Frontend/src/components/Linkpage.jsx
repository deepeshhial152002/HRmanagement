import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Linkpage = () => {
  const [Values, setValues] = useState({
    url: "",
  });

  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (Values.url === "") {
        alert("All fields are required");
      } else {
        const response = await axios.post(`http://localhost:4000/api/v1/submit-link`, { url: Values.url }, { headers });
        alert(response.data.message);
        window.location.reload(); // Refresh the page after the alert is shown
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const parsedResponse = JSON.parse(error.request.response);
        setError(parsedResponse.message);
        alert(parsedResponse.message);
      } else {
        setError("Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-11">
      <form className="space-y-6 w-[60vh]">
        <div className="flex items-center justify-between">
          <input
            id="url"
            name="url"
            type="text"
            autoComplete="url"
            required
            className="w-full h-10 px-3 border-2 rounded-md"
            placeholder="Enter URL"
            value={Values.url}
            onChange={change}
          />
          <button
            type="submit"
            className="h-10 ml-4 text-white rounded-md w-28 bg-zinc-700"
            onClick={submit}
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
