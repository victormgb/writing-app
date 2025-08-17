import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // For extended matchers like .toBeInTheDocument()
import App from './App';
import { renderWithProviders } from './utils/test-utils'; // Your custom render utility

// Import the Entry type for type safety in test data
import { type Entry } from './redux/entries/entriesSlice';

// Mock react-router-dom's useNavigate hook
// We mock useNavigate to prevent actual navigation during tests and to check if it's called.
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Import and retain actual for other exports like BrowserRouter, Routes, Route
  useNavigate: jest.fn(), // Mock useNavigate
}));

// Import the mocked function
import { useNavigate } from 'react-router-dom';

describe('App Component', () => {
  // Clear mock for useNavigate before each test to ensure isolation
  beforeEach(() => {
    (useNavigate as jest.Mock).mockClear();
  });

  test('displays "Your Favorites" section if there are favorite entries', () => {
    // Define your test data with the correct Entry type
    const favoriteEntriesState: Entry[] = [
      { id: '1', title: 'first entry', content: '...', isFavorite: true, updatedAt: 1678886400000, coverType: 'color', coverValue: '#FF0000' },
      { id: '2', title: 'second entry', content: '...', isFavorite: true, updatedAt: 1678886500000, coverType: 'color', coverValue: '#00FF00' },
    ];

    // Render the App component with the preloaded state
    // The key 'entries' here must match the slice name in your rootReducer (e.g., 'entries: entriesReducer')
    renderWithProviders(<App />, {
      preloadedState: {
        entries: favoriteEntriesState,
      },
    });

    // Assert that the "Your Favorites" heading and the entry titles are present
    expect(screen.getByText(/Your Favorites/i)).toBeInTheDocument();
  });

  test('does not display "Your Favorites" section if no favorite entries', () => {
    // Define test data with no favorite entries
    const nonFavoriteEntriesState: Entry[] = [
      { id: '1', title: 'Non-Fav Entry', content: '...', isFavorite: false, updatedAt: 1678886400000, coverType: 'color', coverValue: '#FF0000' },
    ];

    renderWithProviders(<App />, {
      preloadedState: {
        entries: nonFavoriteEntriesState,
      },
    });

    // Assert that the "Your Favorites" heading is NOT present
    expect(screen.queryByText(/Your Favorites/i)).not.toBeInTheDocument();
  });

  test('does not display "Your Favorites" section if entries array is empty', () => {
    renderWithProviders(<App />, {
      preloadedState: {
        entries: [], // Empty entries array
      },
    });

    expect(screen.queryByText(/Your Favorites/i)).not.toBeInTheDocument();
  });

  test('creates a new entry and navigates on button click', () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    // Mock crypto.randomUUID for predictable IDs in tests
    const mockUUID = 'mock-uuid-123';
    jest.spyOn(crypto, 'randomUUID').mockReturnValue(mockUUID as any);

    // Render the component and get access to the store
    const { store } = renderWithProviders(<App />);

    // Simulate clicking the "Create New Entry" button
    fireEvent.click(screen.getByText(/Create New Entry/i));

    // Assert that the addEntry action was dispatched and the store state updated
    const stateAfterDispatch = store.getState();
    expect(stateAfterDispatch.entries).toHaveLength(1);
    expect(stateAfterDispatch.entries[0].id).toBe(mockUUID);
    expect(stateAfterDispatch.entries[0].title).toBe('');
    expect(stateAfterDispatch.entries[0].content).toBe('');
    expect(stateAfterDispatch.entries[0].isFavorite).toBe(false);

    // Assert that navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith(`/entry/${mockUUID}`);

    // Restore original crypto.randomUUID to avoid affecting other tests
    jest.restoreAllMocks();
  });
});
