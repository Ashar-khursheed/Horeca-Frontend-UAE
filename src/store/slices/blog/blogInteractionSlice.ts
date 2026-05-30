import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";

export const likeBlog = createAsyncThunk(
  "blog/like",
  async (id: number, { rejectWithValue }) => {
    try {
      await makeApiRequest(apiUrls.BLOG_LIKE(id), { method: "POST" });
      return id;
    } catch {
      return rejectWithValue(id);
    }
  }
);

export const shareBlog = createAsyncThunk(
  "blog/share",
  async (id: number, { rejectWithValue }) => {
    try {
      await makeApiRequest(apiUrls.BLOG_SHARE(id), { method: "POST" });
      return id;
    } catch {
      return rejectWithValue(id);
    }
  }
);

export const viewBlog = createAsyncThunk(
  "blog/view",
  async (id: number) => {
    try {
      await makeApiRequest(apiUrls.BLOG_VIEW(id), { method: "POST" });
    } catch {
      // fire-and-forget
    }
  }
);

const blogInteractionSlice = createSlice({
  name: "blogInteraction",
  initialState: {},
  reducers: {},
});

export default blogInteractionSlice.reducer;
