import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Define the interface for a single image entry
export interface ImageEntry {
  id: string;
  name: string;
  dataUrl: string; // To store the image as a Base64 string (data URL)
  uploadedAt: number; // Timestamp for sorting or display
}

// Define the state for the images slice as an array of ImageEntry objects
export type ImagesState = ImageEntry[];

// Initialize the state as an empty array of images
const initialState: ImagesState = [];

export const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    /**
     * Adds a new image to the array.
     * The payload should be an object containing image details.
     */
    addImage: (state, action: PayloadAction<{ id: string; name: string; dataUrl: string }>) => {
      state.push({
        id: action.payload.id,
        name: action.payload.name,
        dataUrl: action.payload.dataUrl,
        uploadedAt: Date.now(), // Automatically add a timestamp
      });
    },
    /**
     * Deletes an image by its ID.
     * The payload should be the ID (string) of the image to delete.
     */
    deleteImage: (state, action: PayloadAction<string>) => {
      return state.filter(image => image.id !== action.payload);
    },
    // You can add more reducers here for updating image metadata, etc.
  },
});

// Export the actions
export const { addImage, deleteImage } = imagesSlice.actions;

// Export the reducer
export default imagesSlice.reducer;

// Selector example (optional, but useful for accessing state)
// export const selectAllImages = (state: RootState) => state.images;
// export const selectImageById = (state: RootState, id: string) =>
//   state.images.find(image => image.id === id);