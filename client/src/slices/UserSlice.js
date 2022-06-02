import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const userLogin = createAsyncThunk(
  "user login",
  async (userCredObj, thunkApi) => {
    let response = await axios.post("/user/login", userCredObj);

    let data = response.data;

    if (data.message === "user-logged") {
      localStorage.setItem("token", response.data.payload);

      return;
    } else {
      return thunkApi.rejectWithValue(data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    errMsg: "",
  },
  reducers: {
    clearLoginStatus: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errMsg = "";

      return state;
    },
  },
  extraReducers: {
    [userLogin.pending]: (state) => {
      state.isLoading = true;
    },
    [userLogin.fulfilled]: (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.errMsg = "";
    },
    [userLogin.rejected]: (state, action) => {
      state.errMsg = action.payload.message;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
    },
  },
});

export const { userObj, isLoading, isSuccess, isError, errMsg } =
  userSlice.actions;

export const { clearLoginStatus } = userSlice.actions;

export default userSlice.reducer;
