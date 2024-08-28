import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authAction } from '../store/auth';
import Linkpage from '../components/Linkpage';

const ProfileIntern = () => {
  const [profile, setInternProfile] = useState(null);
  const [urlData, setUrlData] = useState(null); // Initially set to null to distinguish between loading and empty state
  const [currentPage, setCurrentPage] = useState(1);
  const urlsPerPage = 10;
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    if (!headers.id || !headers.authorization) {
      navigate("/"); // Redirect to / route if headers are missing
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://QODEIT.CLOUD/api/v1/getIntern-info`, { headers });
        setInternProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };

    const fetchUrlData = async () => {
      try {
        const response = await axios.get(`http://QODEIT.CLOUD/v1/url-info-intern`, { headers });
        setUrlData(response.data.data || []); // Ensure urlData is an array, even if empty
      } catch (error) {
        console.error("Error fetching URL data", error);
        setUrlData([]); // Set as empty array on error to avoid indefinite loading
      }
    };

    fetchProfile();
    fetchUrlData();
  }, [headers, navigate]);

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
       
      
        
      <Linkpage />
     
    
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
