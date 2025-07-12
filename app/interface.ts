export interface INotification {
  type: string;
  message: string;
  createdAt: string;
}

export interface IPost {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface IFollow {
  follower_id: string;
  following_id: string;
}

export interface ICreatePostRequest {
  userId: string;
  content: string;
}

export interface IResponse<T> {
  status: number;
  message: string;
  data: {
    success?: T;
    failure?: T;
  };
}
