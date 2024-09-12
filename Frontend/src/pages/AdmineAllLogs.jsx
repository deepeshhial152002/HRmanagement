import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdmineAllLogs = () => {
    const [deletionLogs, setDeletionLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(""); // State for search term
    const logsPerPage = 7;

    useEffect(() => {
        const fetchDeletionLogs = async () => {
            try {
                const response = await axios.get(`http://qodeit.store/api/getall-deletedlogs`);
                // const response = await axios.get(`http://localhost:3007/api/getall-deletedlogs`);
                setDeletionLogs(response.data.data);
            } catch (error) {
                console.error("Error fetching deletion logs", error);
            }
        };
        fetchDeletionLogs();
    }, []);

    // Filter logs based on search term
    const filteredLogs = deletionLogs.filter(log =>
        log.internName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get current logs for the current page
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className="container p-4 mx-auto my-8">
            <h1 className="mb-6 text-2xl font-bold text-center">Deletion Logs</h1>
            
            {/* Search Field */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Intern Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
            </div>

            {currentLogs.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 border-b">HR Name</th>
                                <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 border-b">Intern Name</th>
                                <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 border-b">Deleted At</th>
                                <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 border-b">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentLogs.map((log) => {
                                const date = new Date(log.timestamp).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                });
                                const time = new Date(log.timestamp).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                });

                                return (
                                    <tr key={log._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-700 border-b">{log.hrName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 border-b">{log.internName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 border-b">{date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 border-b">{time}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-600">No deletion logs available.</p>
            )}

            {/* Pagination */}
            <div className="flex justify-between mt-4">
                <button
                    className={`px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="text-sm font-medium text-gray-700">Page {currentPage} of {totalPages}</span>
                <button
                    className={`px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdmineAllLogs;
