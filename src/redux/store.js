import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import appSlice from "./slices/appSlice";
import modalSlice from "./slices/modalSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    app: appSlice,
    modal: modalSlice,
  },
});
