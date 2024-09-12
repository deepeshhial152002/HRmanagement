import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { authAction } from '../store/auth';
import { useDispatch } from 'react-redux';

const ProfileHR = () => {
    const [profile, setProfile] = useState(null);
    const [internInfo, setInternInfo] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Number of items per page

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    useEffect(() => {
        if (!headers.id || !headers.authorization) {
            navigate("/");
        } else {
            const fetchProfile = async () => {
                try {
                    // const response = await axios.get(`http://localhost:3007/api/gethrinfo`, { headers });
                    const response = await axios.get(`http://qodeit.store/api/gethrinfo`, { headers });
                    setProfile(response.data);
                } catch (error) {
                    console.error("Error fetching profile data", error);
                }
            };
            fetchProfile();
        }
    }, [headers, navigate]);

    useEffect(() => {
        if (!headers.id || !headers.authorization) {
            navigate("/");
        } else {
            const fetchInternInfo = async () => {
                try {
                    // const response = await axios.get(`http://localhost:3007/api/hrIntern-info`, { headers });
                    const response = await axios.get(`http://qodeit.store/api/hrIntern-info`, { headers });
                    setInternInfo(response.data.data);
                } catch (error) {
                    console.error("Error fetching intern info", error);
                }
            };
            fetchInternInfo();
        }
    }, [headers, navigate]);

    const deleteIntern = async (internId) => {
        const confirmed = window.confirm("Are you sure you want to delete this intern?");
        if (confirmed) {
            try {
                // await axios.delete(`http://localhost:3007/api/delete-intern/${internId}`, { headers });
                await axios.delete(`http://qodeit.store/api/delete-intern/${internId}`, { headers });
                setInternInfo(internInfo.filter((intern) => intern._id !== internId));
                alert('Intern deleted successfully.');
            } catch (error) {
                console.error("Error deleting intern", error);
                alert('Failed to delete intern. Please try again.');
            }
        }
    };

    const filteredInternInfo = internInfo?.filter((intern) =>
        intern.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInternInfo?.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredInternInfo?.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container px-4 py-8 mx-auto">
            <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row">
                <div>
                    {profile ? (
                        <div className="flex gap-2">
                            <span className="font-bold">HR Name:</span>
                            <h1>{profile.Username}</h1>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                <button
                    className="px-4 py-2 text-white rounded-md bg-zinc-700 hover:bg-zinc-800"
                    onClick={() => {
                        dispatch(authAction.logout());
                        localStorage.clear();
                        navigate("/LoginIntern");
                    }}
                >
                    Logout
                </button>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search Interns"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="overflow-x-auto">
                {filteredInternInfo ? (
                    <>
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                            <thead>
                                <tr className="text-white bg-gray-800">
                                    <th className="px-4 py-2 text-left">#</th>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Joining Date</th>
                                    <th className="px-4 py-2 text-left">Joining Time</th>
                                    <th className="px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems?.map((item, i) => {
                                    const joiningDate = new Date(item.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    });
                                    const joiningTime = new Date(item.createdAt).toLocaleTimeString('en-IN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    });

                                    return (
                                        <tr key={item._id || i} className="border-t">
                                            <td className="px-4 py-2">{i + 1 + (currentPage - 1) * itemsPerPage}</td>
                                            <Link to={`/${item.name}/${item._id}`}>
                                                <td className="px-4 py-2 text-blue-600 hover:underline">{item.name}</td>
                                            </Link>
                                            <td className="px-4 py-2">{joiningDate}</td>
                                            <td className="px-4 py-2">{joiningTime}</td>
                                            <td className="px-4 py-2">
                                                <i
                                                    className="text-2xl cursor-pointer ri-delete-bin-2-line hover:text-red-600"
                                                    onClick={() => deleteIntern(item._id)}
                                                ></i>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredInternInfo.length > itemsPerPage && (
                            <div className="flex items-center justify-between mt-4">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                >
                                    Previous
                                </button>
                                <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default ProfileHR;
