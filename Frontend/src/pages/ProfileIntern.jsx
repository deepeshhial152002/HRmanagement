import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileIntern = () => {
  const [profile, setProfile] = useState(null);
  const [urlData, setUrlData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    if (!headers.id || !headers.authorization) {
      navigate("/"); // Redirect to home if headers are missing
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://qodeit.store/api/user-links', { headers });
        setProfile(response.data.profile);
        setUrlData(response.data.links);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        // Handle error, possibly redirect to an error page
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [headers, navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {profile ? (
        <>
          <h1>Name: {profile.name}</h1>
          <ul>
            {urlData.length > 0 ? (
              urlData.map((link, index) => (
                <li key={index}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.url}
                  </a>
                </li>
              ))
            ) : (
              <p>No URLs available.</p>
            )}
          </ul>
        </>
      ) : (
        <p>No profile data available.</p>
      )}
    </div>
  );
};

export default ProfileIntern;
