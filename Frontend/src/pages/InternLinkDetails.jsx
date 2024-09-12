import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const InternLinkDetails = () => {
  const [data, setData] = useState([]);
  const [link, setLink] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sum, setSum] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Search term for data links
  const [searchTermLinkedIn, setSearchTermLinkedIn] = useState(""); // Search term for LinkedIn links
  const linksPerPage = 8; // Number of links per page

  const { name, id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLinkDetails = async () => {
      try {
        // const response = await axios.get(`http://localhost:3007/api/link/getlink-inter/${id}`);
        const response = await axios.get(`http://qodeit.store/api/link/getlink-inter/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLinkedInDetails = async () => {
      try {
        // const response = await axios.get(`http://localhost:3007/api/linkedin/getlinkedinlink-inter/${id}`);
        const response = await axios.get(`http://qodeit.store/api/linkedin/getlinkedinlink-inter/${id}`);
        setLink(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinkDetails();
    fetchLinkedInDetails();
  }, [id]);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  // Filtering logic based on the search term for data links
  const filteredData = data.filter((item) =>
    item.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtering logic based on the search term for LinkedIn links
  const filteredLinks = link.filter((item) =>
    item.url.toLowerCase().includes(searchTermLinkedIn.toLowerCase())
  );

  const add = filteredData.length + filteredLinks.length;

  // Pagination logic for data links
  const totalPages = Math.ceil(filteredData.length / linksPerPage);
  const startIndex = (currentPage - 1) * linksPerPage;
  const currentLinks = filteredData.slice(startIndex, startIndex + linksPerPage);

  // Pagination logic for LinkedIn links
  const totalPagesLinkedIn = Math.ceil(filteredLinks.length / linksPerPage);
  const startIndexLinkedIn = (currentPage - 1) * linksPerPage;
  const currentLinkedInLinks = filteredLinks.slice(startIndexLinkedIn, startIndexLinkedIn + linksPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPageLinkedIn = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPageLinkedIn = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPagesLinkedIn));
  };

  return (
    <div className="container max-w-screen-xl px-4 py-8 mx-auto">
      <h1 className="mb-4 text-2xl font-bold text-center md:text-left">
        Links Details Of <span className="font-extrabold text-red-500">{name}</span>
      </h1>
      <div className="flex items-center justify-between mb-2">
        <p className="mt-2 text-xl font-bold text-center text-gray-600 md:text-left">
          Total URLs: <span className="font-extrabold text-red-500">{add}</span>
        </p>
      </div>

      {/* Search Bar for Data Links */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Facebook URLs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder:text-red-300"
        />
      </div>

      {/* Data Links Table */}
      {currentLinks.length === 0 ? (
        <p className="text-center">No links found for this intern.</p>
      ) : (
        <div className="mb-8 overflow-x-auto">
          <h1 className="mt-2 text-xl font-bold text-center text-gray-600 md:text-left">Total No Of Facebook Link:<span className="font-extrabold text-red-500"> {filteredData.length}</span></h1>
          <h2 className="mb-4 text-xl font-semibold text-center">Facebook Links</h2>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="text-white bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">URL</th>
                <th className="px-4 py-2 text-left">Created Date</th>
                <th className="px-4 py-2 text-left">Created Time</th>
              </tr>
            </thead>
            <tbody>
              {currentLinks.map((item, index) => {
                const createdAt = new Date(item.createdAt);
                const date = createdAt.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                });
                const time = createdAt.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                return (
                  <tr key={item._id} className="border-t">
                    <td className="px-4 py-2">{startIndex + index + 1}</td>
                    <td className="px-4 py-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 break-words hover:underline"
                      >
                        {item.url}
                      </a>
                    </td>
                    <td className="px-4 py-2">{date}</td>
                    <td className="px-4 py-2">{time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Data Links Pagination Controls */}
      <div className="flex flex-col items-center justify-between mt-4 space-y-2 md:flex-row md:space-y-0">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md w-full md:w-auto text-white ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md w-full md:w-auto text-white ${currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          Next
        </button>
      </div>

      {/* Search Bar for LinkedIn Links */}
      <div className="mt-8 mb-4">
        <input
          type="text"
          placeholder="Search LinkedIn URLs"
          value={searchTermLinkedIn}
          onChange={(e) => setSearchTermLinkedIn(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder:text-red-300"
        />
      </div>

      {/* LinkedIn Links Table */}
      {currentLinkedInLinks.length === 0 ? (
        <p className="text-center">No LinkedIn links found for this intern.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <p className="mt-2 text-xl font-bold text-center text-gray-600 md:text-left">Total No Of LinkedIn Link: <span className="font-extrabold text-red-500">{filteredLinks.length}</span></p>
          <h2 className="mb-4 text-xl font-semibold text-center">LinkedIn Links</h2>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="text-white bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">URL</th>
                <th className="px-4 py-2 text-left">Created Date</th>
                <th className="px-4 py-2 text-left">Created Time</th>
              </tr>
            </thead>
            <tbody>
              {currentLinkedInLinks.map((item, index) => {
                const createdAt = new Date(item.createdAt);
                const date = createdAt.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                });
                const time = createdAt.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                return (
                  <tr key={item._id} className="border-t">
                    <td className="px-4 py-2">{startIndexLinkedIn + index + 1}</td>
                    <td className="px-4 py-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 break-words hover:underline"
                      >
                        {item.url}
                      </a>
                    </td>
                    <td className="px-4 py-2">{date}</td>
                    <td className="px-4 py-2">{time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* LinkedIn Links Pagination Controls */}
      <div className="flex flex-col items-center justify-between mt-4 space-y-2 md:flex-row md:space-y-0">
        <button
          onClick={handlePrevPageLinkedIn}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md w-full md:w-auto text-white ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPagesLinkedIn}
        </span>
        <button
          onClick={handleNextPageLinkedIn}
          disabled={currentPage === totalPagesLinkedIn}
          className={`px-4 py-2 rounded-md w-full md:w-auto text-white ${currentPage === totalPagesLinkedIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InternLinkDetails;
