import { configureStore, type ThunkAction, type Action, combineReducers } from '@reduxjs/toolkit'
import counterReducer from './counter/counterSlice';
import entrriesReducer from "./entries/entriesSlice";
import imagesReducer from "./images/imageSlice";
import { Root } from 'react-dom/client';

const rootReducer = combineReducers({
    counter: counterReducer,
    entries: entrriesReducer,
    images: imagesReducer
})




export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  })
}

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
export type RootState = ReturnType<typeof rootReducer>

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>