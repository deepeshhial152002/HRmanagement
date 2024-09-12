import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileIntern = () => {
    const [profile, setProfile] = useState(null);
    const [links, setLinks] = useState([]);
    const [linkedinLinks, setLinkedinLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState('');
    const [linkType, setLinkType] = useState('');
    const [filter, setFilter] = useState('');
    const [linkedinFilter, setLinkedinFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageLinkedin, setCurrentPageLinkedin] = useState(1);
    const navigate = useNavigate();

    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    useEffect(() => {
        if (!headers.id || !headers.authorization) {
            navigate("/");
        } else {
            const fetchProfileAndLinks = async () => {
                try {
                    // const response = await axios.get(`http://localhost:3007/api/user-links`, { headers });
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

    useEffect(() => {
        if (!headers.id || !headers.authorization) {
            navigate("/");
        } else {
            const fetchLinkedinLinks = async () => {
                try {
                    // const response = await axios.get(`http://localhost:3007/api/user-linkedinlink`, { headers });
                    const response = await axios.get(`http://qodeit.store/api/user-linkedinlink`, { headers });
                    setLinkedinLinks(response.data.links);
                } catch (error) {
                    console.error("Error fetching LinkedIn links:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchLinkedinLinks();
        }
    }, [navigate]);

    const handleLinkTypeChange = (e) => {
        const type = e.target.value;
        setLinkType(type);

        if (type === 'facebook') {
            setUrl('https://www.facebook.com/groups/');
        } else if (type === 'linkedin') {
            setUrl('https://www.linkedin.com/groups/');
        } else {
            setUrl('');
        }
    };

    const handleUrlChange = (e) => {
        const input = e.target.value;
        let prefix = '';
        if (linkType === 'facebook') {
            prefix = 'https://www.facebook.com/groups/';
        } else if (linkType === 'linkedin') {
            prefix = 'https://www.linkedin.com/groups/';
        }

        if (input.length < prefix.length) {
            setUrl(prefix);
            return;
        }

        if (input.startsWith(prefix)) {
            setUrl(input);
        } else {
            setUrl(prefix + input.slice(prefix.length));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            let endpoint = '';
    
            if (linkType === 'facebook') {
                // endpoint = 'http://localhost:3007/api/link/check-and-add-url';
                endpoint = 'http://qodeit.store/api/link/check-and-add-url';
            } else if (linkType === 'linkedin') {
                // endpoint = 'http://localhost:3007/api/linkedin/linkedinlinkcheck-add-url';
                endpoint = 'http://qodeit.store/api/linkedin/linkedinlinkcheck-add-url';
            }
    
            if (!endpoint) {
                alert('Please select a link type.');
                return;
            }
    
            const response = await axios.post(endpoint, { url }, { headers });
            alert(response.data.message);
    
            if (response.data.link) {
                if (linkType === 'facebook') {
                    setLinks([...links, response.data.link]);
                } else if (linkType === 'linkedin') {
                    setLinkedinLinks([...linkedinLinks, response.data.link]);
                }
            }
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert('Error submitting URL');
            }
        }
    };

    const linksPerPage = 5;
    const totalPages = Math.ceil(links.length / linksPerPage);
    const startIndex = (currentPage - 1) * linksPerPage;

    const filteredLinks = links.filter(link =>
        link.url.toLowerCase().includes(filter.toLowerCase())
    );
    const currentLinks = filteredLinks.slice(startIndex, startIndex + linksPerPage);

    const linkedinPerPage = 5;
    const totalPagesLinkedin = Math.ceil(linkedinLinks.length / linkedinPerPage);
    const startIndexLinkedin = (currentPageLinkedin - 1) * linkedinPerPage;

    const filteredLinkedinLinks = linkedinLinks.filter(link =>
        link.url.toLowerCase().includes(linkedinFilter.toLowerCase())
    );
    const currentLinkedinLinks = filteredLinkedinLinks.slice(startIndexLinkedin, startIndexLinkedin + linkedinPerPage);

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPageLinkedin = () => {
        setCurrentPageLinkedin((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPageLinkedin = () => {
        setCurrentPageLinkedin((prevPage) => Math.min(prevPage + 1, totalPagesLinkedin));
    };

    const handleDelete = async (linkId, type) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this link?');
        if (confirmDelete) {
            try {
                let endpoint = '';
                if (type === 'facebook') {
                    // endpoint = ` /api/link/link-delete/${linkId}`;
                    endpoint = `http://qodeit.store/api/link/link-delete/${linkId}`;
                } else if (type === 'linkedin') {
                    // endpoint = `http://localhost:3007/api/linkedin/linkedinlink-delete/${linkId}`;
                    endpoint = `http://qodeit.store/api/linkedin/linkedinlink-delete/${linkId}`;
                }
    
                const response = await axios.delete(endpoint);
                alert(response.data.message);
                if (type === 'facebook') {
                    setLinks(links.filter(l => l._id !== linkId));
                } else if (type === 'linkedin') {
                    setLinkedinLinks(linkedinLinks.filter(l => l._id !== linkId));
                }
            } catch (error) {
                console.error("Error deleting link:", error);
                alert('Error deleting link');
            }
        }
    };

    if (loading) {
        return <p className="text-center">Loading...</p>;
    }

    if (!profile) {
        return <p className="text-center">No profile data available.</p>;
    }

    return (
        <div className="max-w-6xl p-4 mx-auto">
            <div className="flex flex-col items-center justify-between md:flex-row">
                <h1 className="mb-4 text-2xl font-bold text-center md:text-left">{profile.name} Links</h1>
                <button
                    className="w-24 h-10 mt-6 text-white rounded-md bg-zinc-700 md:mt-0"
                    onClick={() => {
                        localStorage.clear();
                        navigate("/LoginIntern");
                    }}
                >
                    Logout
                </button>
            </div>

            <div className="mt-8 mb-8">
                <form onSubmit={handleSubmit} className="flex flex-col items-center md:flex-row">
                    <select
                        value={linkType}
                        onChange={handleLinkTypeChange}
                        required
                        className="px-4 py-2 mb-2 border rounded-md focus:outline-none md:rounded-r-md"
                    >
                        <option value="" disabled>Select Link Type</option>
                        <option value="facebook">Facebook Group</option>
                        <option value="linkedin">LinkedIn Group</option>
                    </select>
                    <input
                        type="text"
                        value={url}
                        onChange={handleUrlChange}
                        placeholder="Enter group code"
                        required
                        className="flex-grow w-full px-4 py-2 mb-2 border rounded-md focus:outline-none md:rounded-l-md md:mb-0"
                    />
                    <button type="submit" className="px-4 py-2 text-white rounded-md bg-zinc-700">
                        Submit
                    </button>
                </form>
            </div>

            <div className="overflow-x-auto">
                <h2 className="mb-4 text-xl font-semibold text-center">Facebook Links</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Search Facebook URLs"
                        className="w-full px-4 py-2 placeholder-red-500 border rounded-md focus:outline-none"
                    />
                </div>
                {filteredLinks.length > 0 ? (
                    <table className="min-w-full mb-8 overflow-hidden bg-white rounded-lg shadow-md">
                        <thead className='text-white bg-zinc-700' >
                            <tr>
                                <th className="px-4 py-2 border-b">No</th>
                                <th className="px-4 py-2 border-b">Facebook URL</th>
                                <th className="px-4 py-2 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentLinks.map((link, index) => (
                                <tr key={link._id}>
                                    <td className="px-4 py-2 border-b">{startIndex + index + 1}</td>
                                    <td className="px-4 py-2 break-all border-b">
                                        
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 break-words hover:underline"> {link.url}
                                    </a>
                       
                                        </td>
                                    <td className="px-4 py-2 border-b">
                                        <button
                                            className="px-4 py-2 text-white bg-red-600 rounded-md"
                                            onClick={() => handleDelete(link._id, 'facebook')}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center">No Facebook links available.</p>
                )}
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-white bg-blue-500 rounded-md"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-white bg-blue-500 rounded-md"
                    >
                        Next
                    </button>
                </div>
            </div>

            <div className="mt-8 overflow-x-auto">
                <h2 className="mb-4 text-xl font-semibold text-center">LinkedIn Links</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        value={linkedinFilter}
                        onChange={(e) => setLinkedinFilter(e.target.value)}
                        placeholder="Search LinkedIn URLs"
                        className="w-full px-4 py-2 placeholder-red-500 border rounded-md focus:outline-none"
                    />
                </div>
                {filteredLinkedinLinks.length > 0 ? (
                    <table className="min-w-full mb-8 overflow-hidden bg-white rounded-lg shadow-md">
                        <thead className='text-white bg-zinc-700'>
                            <tr>
                                <th className="px-4 py-2 border-b">No</th>
                                <th className="px-4 py-2 border-b">LinkedIn URL</th>
                                <th className="px-4 py-2 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentLinkedinLinks.map((link, index) => (
                                <tr key={link._id}>
                                    <td className="px-4 py-2 border-b">{startIndexLinkedin + index + 1}</td>
                                    <td className="px-4 py-2 break-all border-b">
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 break-words hover:underline"> {link.url}
                                    </a>
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        <button
                                            className="px-4 py-2 text-white bg-red-600 rounded-md"
                                            onClick={() => handleDelete(link._id, 'linkedin')}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center">No LinkedIn links available.</p>
                )}
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={handlePrevPageLinkedin}
                        disabled={currentPageLinkedin === 1}
                        className="px-4 py-2 text-white bg-blue-500 rounded-md"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextPageLinkedin}
                        disabled={currentPageLinkedin === totalPagesLinkedin}
                        className="px-4 py-2 text-white bg-blue-500 rounded-md"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileIntern;
