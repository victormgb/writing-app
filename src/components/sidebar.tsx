import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { type RootState } from '../redux/store'; // Import RootState to type the selector


// import './App.css'; // Assuming you have some basic styling here

function Sidebar() {
  const entries = useAppSelector((state: RootState) => state.entries);
  const navigate = useNavigate();

  // Filter for favorite entries
  const favoriteEntries = entries.filter(entry => entry.isFavorite);

  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col shadow-lg min-h-screen overflow-y-auto">
    <ul className="space-y-3">
        <li>
            <button
                onClick={() => navigate(`/`)}
                className="w-full text-left py-2 px-3 rounded-md transition duration-200 ease-in-out
                           hover:bg-gray-700 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                           flex items-center space-x-2"
              >
                <span className="text-blue-400">🏠</span> {/* Simple icon */}
                <span className="truncate flex-grow">Home</span>
              </button>
        </li>
    </ul>
      {/* Favorites Section */}
      <h2 className="text-md font-bold mt-3 mb-3 text-blue-300 px-3 border-t border-gray-700 pt-3">Favorites</h2>
      <ul className="space-y-3 mb-6"> {/* Added mb-6 for spacing below Favorites */}
        {favoriteEntries.length === 0 ? (
          <p className="text-gray-400 text-sm px-3">No favorite entries yet.</p>
        ) : (
          favoriteEntries.map(entry => (
            <li key={entry.id}>
              <button
                onClick={() => navigate(`/entry/${entry.id}`)}
                className="w-full text-left py-2 px-3 rounded-md transition duration-200 ease-in-out
                           hover:bg-gray-700 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                           flex items-center space-x-2"
              >
                <span className="text-yellow-400">⭐</span> {/* Star icon for favorites */}
                <span className="truncate flex-grow">{entry.title || `Untitled Entry (${entry.id.substring(0, 4)}...)`}</span>
              </button>
            </li>
          ))
        )}
      </ul>
    <h2 className="text-md font-bold mt-3 mb-3 text-blue-300 px-3">Your Entries</h2>
      <ul className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-gray-400 text-sm text-center">No entries yet. Create one!</p>
        ) : (
          entries.map(entry => (
            <li key={entry.id}>
              <button
                onClick={() => navigate(`/entry/${entry.id}`)}
                className="w-full text-left py-2 px-3 rounded-md transition duration-200 ease-in-out
                           hover:bg-gray-700 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                           flex items-center space-x-2"
              >
                <span className="text-blue-400">📝</span> {/* Simple icon */}
                <span className="truncate flex-grow">{entry.title || `Untitled Entry (${entry.id.substring(0, 4)}...)`}</span>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Sidebar;