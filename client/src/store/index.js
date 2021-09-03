import { configureStore } from '@reduxjs/toolkit';

import settings from "../containers/Setting/settingsReducer";

export default configureStore({
  reducer: {
    settings: settings
  },
});
