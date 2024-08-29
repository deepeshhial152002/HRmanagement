import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileIntern = () => {
    const [profile, setProfile] = useState(null);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://qodeit.store/api/check-and-add-url', { url }, { headers });
            alert(response.data.message); // Show success or error message in an alert
            if (response.data.link) {
                setLinks([...links, response.data.link]);
            }
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message); // Show error message in an alert
            } else {
                alert('Error submitting UPI/URL');
            }
        }
    };

    const linksPerPage = 8;
    const totalPages = Math.ceil(links.length / linksPerPage);
    const startIndex = (currentPage - 1) * linksPerPage;
    const currentLinks = links.slice(startIndex, startIndex + linksPerPage);

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!profile) {
        return <p>No profile data available.</p>;
    }

    return (
        <div className="max-w-4xl p-4 mx-auto">
            <div className='flex items-center justify-between' >
            <h1 className="mb-4 text-2xl font-bold">{profile.name} Links</h1>
            
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
            <div className="mt-8">
                <form onSubmit={handleSubmit} className="flex items-center">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter UPI/URL"
                        required
                        className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none"
                    />
                    <button type="submit" className="px-4 py-2 text-white bg-zinc-700 rounded-r-md">
                        Submit
                    </button>
                </form>
            </div>
            {links.length > 0 ? (
                <table className="min-w-full overflow-hidden bg-white rounded-lg shadow-md">
                    <thead>
                        <tr className="text-white bg-gray-800">
                            <th className="px-4 py-2">Serial No</th>
                            <th className="px-4 py-2">URL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLinks.map((link, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2 text-center">{startIndex + index + 1}</td>
                                <td className="px-4 py-2">
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        {link.url}
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-600">No URLs available.</p>
            )}

            <div className="flex items-center justify-between mt-4">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-gray-800 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-gray-800 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

   
        </div>
    );
};

export default ProfileIntern;
