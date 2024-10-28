import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { gameReducer } from './gameSlice';
import { settingsReducer } from './settingsSlice';
import { terminalReducer } from './terminalSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['settings', 'game'] // Only persist settings and game state
};

const persistedGameReducer = persistReducer(persistConfig, gameReducer);
const persistedSettingsReducer = persistReducer(persistConfig, settingsReducer);

export const store = configureStore({
  reducer: {
    game: persistedGameReducer,
    settings: persistedSettingsReducer,
    terminal: terminalReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
