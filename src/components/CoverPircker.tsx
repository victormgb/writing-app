import React, { useState, useRef, useEffect } from 'react';
import { COLORS } from '../redux/entries/entriesSlice'; // Import COLORS from entriesSlice
import { useAppDispatch } from '../redux/hooks';

import { addImage } from '../redux/images/imageSlice';

interface CoverPickerProps {
  currentCover: string;
  onSelectColor: (color: string) => void;
  onSelectImage: (dataUrl: string) => void;
  onClose: () => void;
  type?:  'color' | 'image'
}

function CoverPicker({ currentCover, onSelectColor, onClose, type, onSelectImage }: CoverPickerProps) {
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');
  const pickerRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleColorClick = (color: string) => {
    onSelectColor(color);
    onClose(); // Close picker after selecting a color
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const newImageId = crypto.randomUUID(); // Generate a unique ID for the image
        dispatch(addImage({
          id: newImageId,
          name: file.name,
          dataUrl: dataUrl,
        }));
        // Optionally, you might want to select this image as the cover immediately
        // For now, we'll just add it to the store.
        // If you want to set it as cover, you'd dispatch setEntryCoverImage({ id: entryId, imageUrl: dataUrl })
        // and update Entry interface to support image covers.
        onSelectImage(dataUrl);
        onClose(); // Close picker after upload
      };
      

      reader.readAsDataURL(file); // Read file as Base64 data URL

      
    }
  }

  return (
    <div
      ref={pickerRef}
      className="menu dropdown-content bg-base-100 absolute top-full right-0 w-xs bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-20"
    >
      {/* <div className="flex border-b border-gray-200 "> */}
      <div role='tablist' className='tabs tabs-border' >
        <button
          role='tab'
          className={`tab py-2 text-sm font-medium ${activeTab === 'gallery' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          Gallery
        </button>
        <button
          role='tab'
          className={`tab py-2 text-sm font-medium ${activeTab === 'upload' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-4 gap-2">
            {COLORS.map((color, index) => (
              <div 
                key={index}
                className={`w-12 h-12 rounded-md cursor-pointer border-2 ${currentCover === color ? 'border-blue-500' : 'border-transparent'} hover:scale-105 transition-transform duration-150 ease-in-out`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorClick(color)}
                title={color}
              ></div>
            ))}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">Select an image to upload:</p>
            <input
              type="file"
              accept="image/*" // Accept only image files
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CoverPicker;