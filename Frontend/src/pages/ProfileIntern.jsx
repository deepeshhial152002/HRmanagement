import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authAction } from '../store/auth';
// import Linkpage from '../components/Linkpage';

const ProfileIntern = () => {
  const [profile, setInternProfile] = useState(null);
  const [urlData, setUrlData] = useState(null); // Initially set to null to distinguish between loading and empty state
  const [currentPage, setCurrentPage] = useState(1);


  const [values, setValues] = useState({ url: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const urlsPerPage = 10;
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    if (!headers.id || !headers.authorization) {
      navigate("/");
      return;
    }
  
    let isMounted = true; // flag to prevent setting state on unmounted component
  
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://qodeit.store/api/getIntern-info`, { headers });
        if (isMounted) setInternProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };
  
    const fetchUrlData = async () => {
      try {
        const response = await axios.get(`http://qodeit.store/url-info-intern`, { headers });
        if (isMounted) setUrlData(response.data.data || []);
      } catch (error) {
        console.error("Error fetching URL data", error);
        if (isMounted) setUrlData([]);
      }
    };
  
    fetchProfile();
    fetchUrlData();
  
    return () => {
      isMounted = false; // cleanup function to prevent state updates on unmounted component
    };
  }, [headers, navigate]);
  
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


  
  // Pagination logic
  const indexOfLastUrl = currentPage * urlsPerPage;
  const indexOfFirstUrl = indexOfLastUrl - urlsPerPage;
  const currentUrls = urlData ? urlData.slice(indexOfFirstUrl, indexOfLastUrl) : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className='flex items-center justify-between w-full px-16'>
             
    
        
        {profile ? (
          <div className=''>
            <h1 className='text-lg'>Name: {profile.name}</h1>
           
          </div>
        ) : (
          <p>Loading...</p>
        )}
          <div>
      <button
        className="w-24 h-10 mt-6 text-white rounded-md bg-zinc-700"
        onClick={() => {
          dispatch(authAction.logout());
          localStorage.clear();
          navigate("/LoginIntern");
        }}
      >
        Logout
      </button>
      </div>
      </div>
       
      
        
      {/* <Linkpage /> */}


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
     
    
      <div className='flex flex-col items-center w-full mt-11'>
        {urlData === null ? (
          <p>Loading...</p>
        ) : urlData.length > 0 ? (
          <div className='w-3/4'>
            <table className='min-w-full bg-white border border-gray-300'>
              <thead>
                <tr>
                  <th className='px-4 py-2 border-b'>SNo</th>
                  <th className='px-4 py-2 border-b'>Group Links</th>
                </tr>
              </thead>
              <tbody>
                {currentUrls.map((link, index) => (
                  <tr key={index}>
                    <td className='px-4 py-2 text-center border-b'>{indexOfFirstUrl + index + 1}</td>
                    <td className='flex items-center justify-center px-4 py-2 border-b'>
                      <a target="_blank" rel="noopener noreferrer" href={`${link.url}`}  className='text-blue-500 hover:underline'>
                        {link.url}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='flex justify-center mt-4'>
              {Array.from({ length: Math.ceil(urlData.length / urlsPerPage) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 mx-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p>No URLs available.</p>
        )}
      </div>
 
    </>
  );
};

export default ProfileIntern;
