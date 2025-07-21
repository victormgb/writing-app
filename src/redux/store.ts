import { configureStore, type ThunkAction, type Action } from '@reduxjs/toolkit'
import counterReducer from './counter/counterSlice';
import entrriesReducer from "./entries/entriesSlice";
import imagesReducer from "./images/imageSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    entries: entrriesReducer,
    images: imagesReducer
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>