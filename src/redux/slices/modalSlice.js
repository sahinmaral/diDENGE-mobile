import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  content: null,
  isOpen: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModalContent: (state, action) => {
      state.content = action.payload;
      state.isOpen = true;
    },
    toggleModal: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { setModalContent, toggleModal } = modalSlice.actions;

export const selectModal = (state) => state.modal;

export default modalSlice.reducer;
