import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const authUser = createAsyncThunk(
  "auth user",
  async (token, thunkApi) => {
    let response = await axios.post("/user/auth", token);

    let data = response.data;

    if (data.status === "True") {
      localStorage.setItem("user", data.user);
      localStorage.setItem("isAuth", true);

      return data.user;
    } else {
      return thunkApi.rejectWithValue(data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: "",
    isAuthLoading: false,
    isAuthSuccess: false,
    isAuthError: false,
  },
  reducers: {
    clearAuthStatus: (state) => {
      state.user = "";
      state.isAuthLoading = false;
      state.isAuthSuccess = false;
      state.isAuthError = false;

      return state;
    },
  },
  extraReducers: {
    [authUser.pending]: (state) => {
      state.isAuthLoading = true;
    },
    [authUser.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.isAuthLoading = false;
      state.isAuthSuccess = true;
      state.isAuthError = false;
    },
    [authUser.rejected]: (state) => {
      state.user = "";
      state.isAuthLoading = false;
      state.isAuthSuccess = false;
      state.isAuthError = true;
    },
  },
});

export const { isAuthLoading, isAuthSuccess, isAuthError } = authSlice.actions;

export const { clearAuthStatus } = authSlice.actions;

export default authSlice.reducer;
