import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/UserSlice";
import authReducer from "./slices/AuthSlice";
import postReducer from "./slices/PostSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    post: postReducer,
  },
});
