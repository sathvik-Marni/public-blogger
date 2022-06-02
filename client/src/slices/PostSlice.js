import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createPost = createAsyncThunk(
  "/post/createpost",
  async (postObj, thunkApi) => {
    let response = await axios.post("/post/createpost", postObj);

    if (response.data.message === "post-inserted") {
      return;
    } else {
      return thunkApi.rejectWithValue(response.data);
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    isPostLoading: false,
    isPostSuccess: false,
    isPostError: false,
  },
  reducers: {},
  extraReducers: {
    [createPost.pending]: (state) => {
      state.isPostLoading = true;
    },
    [createPost.fulfilled]: (state) => {
      state.isPostLoading = false;
      state.isPostSuccess = true;
      state.isPostError = false;
    },
    [createPost.rejected]: (state) => {
      state.isPostLoading = false;
      state.isPostSuccess = false;
      state.isPostError = true;
    },
  },
});

export default postSlice.reducer;
