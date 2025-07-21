import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  type Entry,
  setEntryTitle,
  setEntryContent,
  deleteEntry,
  addEntry,
  toggleFavorite,
  updateEntry
} from '../redux/entries/entriesSlice';


import {
  addImage,
  deleteImage
} from "../redux/images/imageSlice"

import { type RootState } from '../redux/store'; // Import RootState to type the selector

// import './App.css'; // Assuming you have some basic styling here

import CoverPicker from '../components/CoverPircker';

function EntryPage() {
  const { id } = useParams<{ id: string }>(); // Get the entry ID from the URL
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Select the specific entry from the Redux store
  const entry = useAppSelector((state: RootState) =>
    state.entries.find(e => e.id === id)
  );

  const images = useAppSelector((state: RootState) => state.images);

  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility

  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the three-dots dropdown
  const detailsRef = useRef<HTMLDetailsElement>(null); // New: Ref for the <details> element

  // Local state to manage input fields (better for performance during typing)
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');

  // Update local state when the Redux entry changes (e.g., if navigated directly)
  useEffect(() => {
    console.log("entry", entry);
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
    } else if (id) {
      // If entry doesn't exist in store but ID is present in URL,
      // it means user might have navigated directly or refreshed.
      // You might want to fetch it from a backend here, or add it as an empty entry.
      // For this example, we'll add it as an empty one if it's not found.
      // In a real app, you'd likely fetch from a database.
      dispatch(addEntry({ id: id, title: '', content: '', isFavorite: false }));
    }
  }, [entry, id, dispatch]);

  // New useEffect to close the <details> dropdown when navigating to a new entry
  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  }, [id]); // Dependency array includes 'id' so this runs when 'id' changes

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (id) {
      dispatch(setEntryTitle({ id, title: newTitle }));
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (id) {
      dispatch(setEntryContent({ id, content: newContent }));
    }
  };

  const handleDeleteEntry = () => {
    if (id) {
    dispatch(deleteEntry(id));
      navigate('/'); // Go back to the home page after deleting
    }
    setShowDropdown(false); // Close dropdown after action
  };

  const handleCloneEntry = () => {
    if (entry) {
      const newEntryId = crypto.randomUUID();
      dispatch(addEntry({
        id: newEntryId,
        title: `${entry.title} (Copy)`, // Append "(Copy)" to the title
        content: entry.content,
        isFavorite: entry.isFavorite
      }));
      navigate(`/entry/${newEntryId}`); // Navigate to the cloned entry
    }
    setShowDropdown(false); // Close dropdown after action
  };

  const handleToggleFavorite = () => {
    if (id) {
      dispatch(toggleFavorite(id));
    }
    setShowDropdown(false); // Close dropdown after action
  };

  if (!entry && id) {
    // This case handles when the entry is initially not found but we've dispatched addEntry
    // You might want to show a loading spinner or a "creating new entry..." message
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-inter text-gray-700">
        Loading or creating new entry...
      </div>
    );
  }

  if (!entry) {
    // This case should ideally not be hit if addEntry is dispatched correctly,
    // but as a fallback for direct navigation to a non-existent ID.
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-inter text-gray-700">
        Entry not found.
      </div>
    );
  }

  const handleChangeCover = () => {
    console.log('Change Cover button clicked!');
    // This is where you would implement logic to change the cover color
    // For example, dispatch an action to update the entry's coverColor
    // dispatch(updateEntry({ ...entry, coverColor: getRandomColor() }));
  };

  const onSelectColor = (color: string) => {
    if (id) {
      dispatch(updateEntry({...entry, coverValue: color, coverType: "color"}));
    }
    // Close the <details> element programmatically
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  }

  const onSelectImage = (dataUrl: string) => {
    console.log("on Selecting Image");
    dispatch(updateEntry({...entry, coverType: "image", coverValue: dataUrl}));

    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  }


  return (
    <div className=" flex flex-col items-center min-h-screen bg-white font-inter w-full h-full ">
        {/* Cover Color Display */}
        {entry.coverValue && (

          <div
            className="w-full h-[280px] flex items-center flex-col" // Set height to 280px and full width
            style={
              entry.coverType === 'color'
                ? { backgroundColor: entry.coverValue }
                : { backgroundImage: `url(${entry.coverValue})` } // Fixed: Added url() for image
            }
          >
            <details className="w-full max-w-5xl p-10 pb-5 relative dropdown" ref={detailsRef}>
              {/* Change Cover Button */}
              <summary
                onClick={handleChangeCover}
                className="btn absolute top-4 right-4 bg-white text-gray-800 font-semibold py-2 px-4 rounded-md shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-150 ease-in-out"
              >
                Change Cover
              </summary>


              <CoverPicker onSelectImage={onSelectImage} type={entry.coverType} currentCover={entry.coverValue} onClose={() => {}} onSelectColor={onSelectColor}></CoverPicker>
            </details>

          </div>
        )}

      <div className="p-10 rounded-lg w-full  max-w-5xl relative">
        <details className="absolute top-4 right-4 z-10 dropdown"> {/* Positioned at top-right */}
          <summary
            // onClick={() => setShowDropdown(!showDropdown)}
            className="btn p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="More options"
          >
            {/* SVG for three dots icon */}
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
            </svg>
          </summary>

          {/* {showDropdown && ( */}
            <ul className="absolute right-0 mt-2 w-48 menu dropdown-content border border-gray-200 rounded-md shadow-lg py-1">
              <li
                onClick={handleCloneEntry}
                className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Clone
              </li>
              <li
                onClick={handleToggleFavorite}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                {entry.isFavorite ? 'Unfavorite' : 'Favorite'} {/* Dynamic text */}
              </li>
              <li
                onClick={handleDeleteEntry}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              >
                Delete
              </li>
            </ul>
          {/* )} */}
        </details>


        {/* Title Input */}
        <input
          id="entryTitle"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled Entry"
          className="w-full text-4xl font-extrabold text-gray-800 mb-6 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400"
        />

        {/* Content Textarea */}
        <textarea
          id="entryContent"
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing your thoughts here..."
          rows={15} // Increased rows for more writing space
          className="w-full text-lg text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 resize-none placeholder-gray-400 leading-relaxed"
        />
      </div>
    </div>
  );
}

export default EntryPage;