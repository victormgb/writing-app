import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { addEntry } from './redux/entries/entriesSlice'; // Import addEntry
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { type Entry } from './redux/entries/entriesSlice';
import type { RootState } from './redux/store';
// import Sidebar from './components/sidebar';
// import './App.css'; // Assuming you have some basic styling here

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const entries = useAppSelector((state: RootState) => state.entries); // Get all entries from Redux store

  // Sort entries by updatedAt in descending order (latest first)
  const sortedEntries = entries.length ? [...entries].sort((a, b) => b.updatedAt - a.updatedAt) : [];

  // Get the latest updated entries (e.g., top 8 or all if less than 8)
  const latestUpdatedEntries = sortedEntries.slice(0, 8); // Display up to 8 latest entries

  // Get favorite entries, sorted by updatedAt
  const favoriteEntries = entries.length ? sortedEntries.filter(entry => entry.isFavorite).slice(0, 8) : []; // Display up to 8 favorite entries

  const handleCreateNewEntry = () => {
    // Generate a unique ID for the new entry
    const newEntryId = crypto.randomUUID(); // Modern way to generate UUIDs

    // Dispatch the addEntry action with an empty entry
    dispatch(addEntry({
      id: newEntryId,
      title: '',
      content: '',
      isFavorite: false,
      updatedAt: Date.now()
    }));

    // Redirect to the new entry's page
    navigate(`/entry/${newEntryId}`);
  };

  // Helper function to format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const EntryCard = ({ entry }: { entry: Entry }) => (
    <div
      onClick={() => navigate(`/entry/${entry.id}`)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer overflow-hidden transform hover:-translate-y-1"
    >
      {/* Cover Area */}
      {entry.coverType && entry.coverValue && (
        <div
          className="w-full h-32 bg-cover bg-center flex items-end p-3"
          style={
            entry.coverType === 'color'
              ? { backgroundColor: entry.coverValue }
              : { backgroundImage: `url(${entry.coverValue})` }
          }
        >
          {entry.isFavorite && (
            <span className="text-yellow-400 text-2xl drop-shadow-md">⭐</span>
          )}
        </div>
      )}
      {/* Content Area */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate mb-2">
          {entry.title || 'Untitled Entry'}
        </h3>
        <p className="text-sm text-gray-500">
          Updated: {formatDate(entry.updatedAt)}
        </p>
      </div>
    </div>
  );

  return (
      <div className="bg-white p-10 rounded-3xl shadow-2xl transform transition-all duration-500 hover:shadow-3xl flex flex-col items-center h-full">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-6 animate-fade-in-down">
          Welcome to Your Entry App
        </h1>
        <p className="text-lg text-gray-600 mb-10 text-center max-w-md animate-fade-in">
          Organize your thoughts and ideas. Click the button below to create a new entry and start writing!
        </p>
        <button
          onClick={handleCreateNewEntry}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75 animate-bounce-once"
        >
          Create New Entry
        </button>

      {/* Favorite Entries Section */}
      {favoriteEntries.length > 0 && (
        <div className="w-full max-w-5xl mb-12">
          <div className="divider"></div>
          <h2 className="text-md font-bold text-gray-800 mb-6 text-left">Your Favorites</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pr-4">
            {favoriteEntries.map(entry => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}

      {/* Latest Updated Entries Section */}
      {latestUpdatedEntries.length > 0 && (
        <div className="w-full max-w-5xl">
          <div className="divider"></div>
          <h2 className="text-md font-bold text-gray-800 mb-6 text-left">Latest Updated Entries</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pr-4">
            {latestUpdatedEntries.map(entry => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}

      </div>
  );
}

export default App;