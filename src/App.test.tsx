import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // For extended matchers like .toBeInTheDocument()
import App from './App';

// Mock Redux hooks
// We need to mock useAppDispatch and useAppSelector because our component uses them.
// This allows us to control their behavior and assert if actions are dispatched.
jest.mock('./redux/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

// Mock react-router-dom's useNavigate hook
// We mock useNavigate to prevent actual navigation during tests and to check if it's called.
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Import and retain actual for other exports like BrowserRouter, Routes, Route
  useNavigate: jest.fn(), // Mock useNavigate
}));

// Import the mocked functions
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { useNavigate } from 'react-router-dom';

// Mock the specific Redux action and the crypto.randomUUID for predictable IDs
import { addEntry } from './redux/entries/entriesSlice';
jest.mock('./redux/entries/entriesSlice', () => ({
  ...jest.requireActual('./redux/entries/entriesSlice'),
  addEntry: jest.fn(), // Mock addEntry to check if it's called
}));

describe('App Component', () => {
  let mockDispatch: jest.Mock;
  let mockUseSelector: jest.Mock;
  let mockUseNavigate: jest.Mock;

  beforeEach(() => {
    // Reset mocks before each test to ensure isolation
    mockDispatch = jest.fn();
    mockUseSelector = jest.fn();
    mockUseNavigate = jest.fn();

    // Configure the mocks to return specific values for our tests
    (useAppDispatch as any).mockReturnValue(mockDispatch);
    (useAppSelector as any).mockReturnValue(mockUseSelector);
    (useNavigate as jest.Mock).mockReturnValue(mockUseNavigate);

    // Default mock state for useAppSelector (e.g., no entries initially)
    mockUseSelector.mockReturnValue([]);
  });

  test('renders welcome message and create entry button', () => {
    render(<App />);

    // Check if the main heading is present
    expect(screen.getByText(/Welcome to Your Entry App/i)).toBeInTheDocument();

    // Check if the create entry button is present
    expect(screen.getByRole('button', { name: /Create New Entry/i })).toBeInTheDocument();
  });

  test('dispatches addEntry and navigates to new entry page when button is clicked', () => {
    // Mock crypto.randomUUID to return a predictable ID for testing
    // This is important because addEntry uses it internally.
    const mockUuid = 'test-uuid-123';
    jest.spyOn(crypto, 'randomUUID').mockReturnValue(mockUuid as any);

    render(<App />);

    // Find the button and click it
    const createButton = screen.getByRole('button', { name: /Create New Entry/i });
    fireEvent.click(createButton);

    // Assert that dispatch was called
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    // Assert that addEntry action was dispatched with the correct payload
    // We check the first argument of the first call to mockDispatch
    expect(mockDispatch).toHaveBeenCalledWith(
      addEntry({
        id: mockUuid,
        title: '',
        content: '',
        isFavorite: false,
        updatedAt: Date.now()
      })
    );

    // Assert that navigate was called with the correct path
    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toHaveBeenCalledWith(`/entry/${mockUuid}`);

    // Restore the original crypto.randomUUID after the test
    jest.spyOn(crypto, 'randomUUID').mockRestore();
  });

  test('displays "Your Favorites" section if there are favorite entries', () => {
    // Mock useAppSelector to return some favorite entries
    const favoriteEntriesState = [
      { id: '1', title: 'Fav Entry 1', content: '...', isFavorite: true, updatedAt: 1678886400000, coverType: 'color', coverValue: '#FF0000' },
      { id: '2', title: 'Fav Entry 2', content: '...', isFavorite: true, updatedAt: 1678886500000, coverType: 'color', coverValue: '#00FF00' },
    ];
    mockUseSelector.mockReturnValue(favoriteEntriesState);
    console.log('Test: Favorite entries state for useAppSelector:', favoriteEntriesState);
    

    render(<App />);

    // Check if the "Your Favorites" heading is present
    expect(screen.getByText(/Your Favorites/i)).toBeInTheDocument();
    // expect(screen.getByText(/Fav Entry 1/i)).toBeInTheDocument();
    // expect(screen.getByText(/Fav Entry 2/i)).toBeInTheDocument();
  });

  test('does not display "Your Favorites" section if no favorite entries', () => {
    // Mock useAppSelector to return no favorite entries
    mockUseSelector.mockReturnValue([
      { id: '1', title: 'Non-Fav Entry', content: '...', isFavorite: false, updatedAt: 1678886400000, coverType: 'color', coverValue: '#FF0000' },
    ]);

    render(<App />);

    // Check that the "Your Favorites" heading is NOT present
    expect(screen.queryByText(/Your Favorites/i)).not.toBeInTheDocument();
  });

  test('displays "Latest Updated Entries" section if there are entries', () => {
    // Mock useAppSelector to return some entries
    mockUseSelector.mockReturnValue([
      { id: 'a', title: 'Entry A', content: '...', isFavorite: false, updatedAt: 1678886400000, coverType: 'color', coverValue: '#FF0000' },
      { id: 'b', title: 'Entry B', content: '...', isFavorite: true, updatedAt: 1678886500000, coverType: 'color', coverValue: '#00FF00' },
    ]);

    render(<App />);

    // Check if the "Latest Updated Entries" heading is present
    expect(screen.getByText(/Latest Updated Entries/i)).toBeInTheDocument();
    expect(screen.getByText(/Entry A/i)).toBeInTheDocument();
    expect(screen.getByText(/Entry B/i)).toBeInTheDocument();
  });

  test('does not display "Latest Updated Entries" section if no entries', () => {
    // Mock useAppSelector to return an empty array
    mockUseSelector.mockReturnValue([]);

    render(<App />);

    // Check that the "Latest Updated Entries" heading is NOT present
    expect(screen.queryByText(/Latest Updated Entries/i)).not.toBeInTheDocument();
  });
});