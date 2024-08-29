import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileIntern = () => {
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };


  useEffect(() => {
   

    if (!headers.id || !headers.authorization) {
        navigate("/"); // Redirect to / route if headers are missing
    } else {
        const fetchProfileAndLinks = async () => {
            try {
                const response = await axios.get(`http://qodeit.store/api/user-links`, { headers });
                setProfile(response.data.profile);
                setLinks(response.data.links);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileAndLinks();
    }
}, [navigate]);




if (loading) {
    return <p>Loading...</p>;
}

if (!profile) {
    return <p>No profile data available.</p>;
}


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
      const response = await axios.post('http://qodeit.store/api/check-and-add-url', { url },{ headers });
      alert(response.data.message); // Show success or error message in an alert
  } catch (error) {
      if (error.response) {
          alert(error.response.data.message); // Show error message in an alert
      } else {
          alert('Error submitting UPI/URL');
      }
  }
};





return (<>

    <div>
        <h1>{profile.name} Links</h1>
        {links.length > 0 ? (
            <ul>
                {links.map((link, index) => (
                    <li key={index}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                            {link.url}
                        </a>
                    </li>
                ))}
            </ul>
        ) : (
            <p>No URLs available.</p>
        )}
    </div>
     <div>
     <form onSubmit={handleSubmit}>
         <input
             type="text"
             value={url}
             onChange={(e) => setUrl(e.target.value)}
             placeholder="Enter UPI/URL"
             required
         />
         <button type="submit">Submit</button>
     </form>
 </div>
 </>
);
};

export default ProfileIntern;
