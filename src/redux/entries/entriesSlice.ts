import { createSlice, type PayloadAction  } from '@reduxjs/toolkit';

// Define a constant array of 8 different colors
export const COLORS = [
  '#6D28D9', // Deep Purple
  '#1D4ED8', // Dark Blue
  '#059669', // Dark Green
  '#D97706', // Dark Orange
  '#DC2626', // Dark Red
  '#7C3AED', // Medium Purple
  '#0F766E', // Dark Teal
  '#4B5563', // Dark Gray
];

export interface Entry {
  id: string; // Add an ID to uniquely identify each entry
  title: string;
  content: string;
  isFavorite: boolean;
  coverType?: 'color' | 'image'; // New field to indicate cover type
  coverValue?: string; // New field for the cover color
  createdAt?: number; // New field: Timestamp of creation
  updatedAt: number; // New field: Timestamp of last update
}

// Define the state for the entries slice as an array of Entry objects
export type EntriesState = Entry[];

// Initialize the state as an empty array of entries
const initialState: EntriesState = [];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
};

export const entriesSlice = createSlice({
  name: 'entries',
  initialState,
  reducers: {
    /**
     * Adds a new entry to the array.
     * The payload should be an Entry object.
     */
    addEntry: (state, action: PayloadAction<Entry>) => {
      const now = Date.now();
      // Assign a random cover color when a new entry is added
      state.push({
        ...action.payload,
        isFavorite: action.payload.isFavorite ?? false,
        coverType: "color",
        coverValue: getRandomColor(), // Assign a random color here
        createdAt: now, // Set creation timestamp
        updatedAt: now, // Set update timestamp
      });
    },
    /**
     * Updates an existing entry by its ID.
     * The payload should be an Entry object with the ID of the entry to update.
     */
    updateEntry: (state, action: PayloadAction<Entry>) => {
      const { id, title, content, isFavorite, coverValue, coverType, createdAt } = action.payload;
      const existingEntry = state.find(entry => entry.id === id);
      if (existingEntry) {
        existingEntry.title = title;
        existingEntry.content = content;
        existingEntry.isFavorite = isFavorite ?? existingEntry.isFavorite;
        existingEntry.coverType = coverType ?? existingEntry.coverType;
        existingEntry.coverValue = coverValue ?? existingEntry.coverValue; // Update cover color as well
       existingEntry.createdAt = createdAt ?? existingEntry.createdAt; // Preserve original createdAt if not provided
        existingEntry.updatedAt = Date.now(); // Update timestamp on any general update
      }
    },
    /**
     * Deletes an entry by its ID.
     * The payload should be the ID (string) of the entry to delete.
     */
    deleteEntry: (state, action: PayloadAction<string>) => {
      return state.filter(entry => entry.id !== action.payload);
    },
    /**
     * Sets the title of a specific entry by its ID.
     * The payload should be an object containing the entry ID and the new title.
     */
    setEntryTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const { id, title } = action.payload;
      const existingEntry = state.find(entry => entry.id === id);
      if (existingEntry) {
        existingEntry.title = title;
        existingEntry.updatedAt = Date.now()
      }
    },
    /**
     * Sets the content of a specific entry by its ID.
     * The payload should be an object containing the entry ID and the new content.
     */
    setEntryContent: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const { id, content } = action.payload;
      const existingEntry = state.find(entry => entry.id === id);
      if (existingEntry) {
        existingEntry.content = content;
        existingEntry.updatedAt = Date.now()
      }
    },
    // New reducer to toggle the favorite status of an entry
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const idToToggle = action.payload;
      const existingEntry = state.find(entry => entry.id === idToToggle);
      if (existingEntry) {
        existingEntry.isFavorite = !existingEntry.isFavorite;
        existingEntry.updatedAt = Date.now()
      }
    },
    // New reducer to set the cover (color or image) of an entry
    setEntryCover: (state, action: PayloadAction<{ id: string; type: 'color' | 'image'; value: string }>) => {
      const { id, type, value } = action.payload;
      const existingEntry = state.find(entry => entry.id === id);
      if (existingEntry) {
        existingEntry.coverType = type;
        existingEntry.coverValue = value;
        existingEntry.updatedAt = Date.now()
      }
    },
  },
});

// Export the actions
export const { addEntry, updateEntry, deleteEntry, setEntryTitle, setEntryContent, toggleFavorite } = entriesSlice.actions;

// Export the reducer
export default entriesSlice.reducer;