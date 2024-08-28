import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authAction } from '../store/auth';
import { useDispatch } from 'react-redux';

const ProfileHR = () => {
    const [profile, setProfile] = useState(null);
    const [internInfo, setInternInfo] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // State to manage search term

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    useEffect(() => {
        if (!headers.id || !headers.authorization) {
            navigate("/"); // Redirect to / route if headers are missing
        } else {
            const fetchProfile = async () => {
                try {
                    const response = await axios.get(`http://qodeit.store/api/gethrinfo`, { headers });
                    setProfile(response.data);
                } catch (error) {
                    console.error("Error fetching profile data", error);
                }
            };
            fetchProfile();
        }
    }, []);

    useEffect(() => {
        if (!headers.id || !headers.authorization) {
            navigate("/"); // Redirect to / route if headers are missing
        } else {
            const fetchInternInfo = async () => {
                try {
                    const response = await axios.get(`http://qodeit.store/api/hrIntern-info`, { headers });
                    setInternInfo(response.data.data);
                } catch (error) {
                    console.error("Error fetching intern info", error);
                }
            };
            fetchInternInfo();
        }
    }, []);

    const deleteIntern = async (internId) => {
        const confirmed = window.confirm("Are you sure you want to delete this intern?");
        if (confirmed) {
            try {
                await axios.delete(`http://qodeit.store/api/delete-intern/${internId}`, { headers });
                setInternInfo(internInfo.filter((intern) => intern._id !== internId));
                alert('Intern deleted successfully.');
            } catch (error) {
                console.error("Error deleting intern", error);
                alert('Failed to delete intern. Please try again.');
            }
        }
    };

    // Filter intern info based on search term
    const filteredInternInfo = internInfo?.filter((intern) =>
        intern.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container p-4 mx-auto my-8">
            <div className='flex items-center justify-between mb-4'>
                <div>
                    {profile ? (<div className='flex gap-2' >
                        
                        <span className='font-bold' > HR Name:- </span>
                        <h1> {profile.Username}</h1>
                    </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
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

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search Interns"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
            </div>

            <div className="overflow-x-auto">
                {filteredInternInfo ? (
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead>
                            <tr>
                                <th className='px-4 py-2 text-left'>Name</th>
                                <th className='px-4 py-2 text-left'>Email</th>
                                <th className='px-4 py-2 text-left'>Joining Date</th>
                                <th className='px-4 py-2 text-left'>Joining Time</th>
                                <th className='px-4 py-2 text-left'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInternInfo.map((item, i) => {
                                const joiningDate = new Date(item.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                });
                                const joiningTime = new Date(item.createdAt).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                });

                                return (
                                    <tr key={item._id || i} className="border-t">
                                        <td className='px-4 py-2'>{item.name}</td>
                                        <td className='px-4 py-2'>{item.email}</td>
                                        <td className='px-4 py-2'>{joiningDate} </td>
                                        <td className='px-4 py-2'>{joiningTime} </td>
                                        <td className='px-4 py-2'>
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
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default ProfileHR;
