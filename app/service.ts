import {
  ICreatePostRequest,
  IFollow,
  INotification,
  IPost,
  IResponse,
} from "./interface";
import axios from "axios";

const BASE_URL = "https://insyd-backend-88m9.onrender.com";

export const getNotifications = async (
  userId: string
): Promise<INotification[]> => {
  const res = await axios.get<IResponse<INotification[]>>(
    `${BASE_URL}/notifications/${userId}`
  );
  return res.data.data.success || [];
};

export const getFollowing = async (userId: string): Promise<IFollow[]> => {
  const res = await axios.get<IResponse<IFollow[]>>(
    `${BASE_URL}/social/following/${userId}`
  );
  return res.data.data.success || [];
};

export const getFollowingPosts = async (userId: string): Promise<IPost[]> => {
  const res = await axios.get<IResponse<IPost[]>>(
    `${BASE_URL}/social/following-posts/${userId}`
  );
  return res.data.data.success || [];
};

export const followUser = async (
  userId: string,
  targetId: string
): Promise<void> => {
  await axios.post(`${BASE_URL}/social/users/${userId}/follow/${targetId}`);
};

export const unfollowUser = async (
  userId: string,
  targetId: string
): Promise<void> => {
  await axios.post(`${BASE_URL}/social/users/${userId}/unfollow/${targetId}`);
};

export const createPost = async (
  data: ICreatePostRequest
): Promise<{ postId: string }> => {
  const res = await axios.post<IResponse<{ postId: string }>>(
    `${BASE_URL}/social/posts`,
    data
  );
  return res.data.data.success || { postId: "" };
};

export const likePost = async (
  postId: string,
  liked: boolean,
  userId: string
): Promise<void> => {
  await axios.post(`${BASE_URL}/social/posts/${postId}/like`, {
    userId: userId,
    liked: liked,
  });
};
