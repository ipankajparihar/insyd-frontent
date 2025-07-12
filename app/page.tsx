"use client";

import { useEffect, useState } from "react";
import {
  createPost,
  followUser,
  getFollowing,
  getFollowingPosts,
  getNotifications,
  likePost,
  unfollowUser,
} from "./service";
import { INotification, IPost } from "./interface";

export default function Home() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [content, setContent] = useState("");
  const allUsers = ["user_a", "user_b", "user_c", "user_d", "user_e"];
  const [following, setFollowing] = useState<string[]>([]);
  const [posts, setPosts] = useState<IPost[]>([]);

  const userId = "user_d"; // Simulated logged-in user

  useEffect(() => {
    loadNotifications();
    loadFollowing();
    loadPosts();

    const socket = new WebSocket("ws:https://insyd-backend-88m9.onrender.com");
    socket.onopen = () => socket.send(JSON.stringify({ userId }));
    socket.onmessage = (msg) => {
      const notif = JSON.parse(msg.data);
      setNotifications((prev) => [notif, ...prev]);
    };

    return () => socket.close();
  }, []);

  const loadNotifications = async () => {
    const res = await getNotifications(userId);

    setNotifications(res);
  };
  const loadFollowing = async () => {
    const res = await getFollowing(userId);
    setFollowing(res.map((f) => f.following_id));
  };

  const loadPosts = async () => {
    const res = await getFollowingPosts(userId);
    setPosts(res);
  };

  const toggleFollow = async (targetUserId: string) => {
    if (following.includes(targetUserId)) {
      await unfollowUser(userId, targetUserId);
    } else {
      await followUser(userId, targetUserId);
    }
    await loadFollowing();
    await loadPosts();
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    await createPost({ userId, content });
    setContent("");
    await loadPosts();
  };

  const handleLike = async (id: string, liked: boolean) => {
    await likePost(id, liked, userId);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans space-y-8">
      <section>
        {/* Users to follow */}
        <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900">
              Other Users
            </h5>
          </div>
          <div className="flow-root">
            <ul
              role="list"
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {allUsers
                .filter((u) => u !== userId)
                .map((user) => (
                  <li className="py-3 sm:py-4" key={user}>
                    <div className="flex items-center">
                      <div className="shrink-0">
                        <img
                          className="w-8 h-8 rounded-full"
                          src="../public/globe.svg"
                          alt="image"
                        />
                      </div>
                      <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate ">
                          {user}
                        </p>
                        <p className="text-sm text-gray-500 truncate ">
                          email@windster.com
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        <button
                          className={`px-3 py-1 rounded text-sm ${
                            following.includes(user)
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                          onClick={() => toggleFollow(user)}
                        >
                          {following.includes(user) ? "Unfollow" : "Follow"}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Create Post */}
      <section>
        <h2 className="text-xl font-semibold mb-4">✏️ Create a Post</h2>
        <textarea
          rows={3}
          className="w-full p-3 border rounded mb-2"
          placeholder="Write post content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          onClick={handlePost}
        >
          Post
        </button>
      </section>

      {/* Posts */}
      <section>
        <h2 className="text-xl font-semibold mb-4">📰 Your Feed</h2>
        <div className="overflow-auto h-50">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="border p-4 rounded shadow-sm mb-4">
                <p className="font-semibold">{post.user_id}</p>
                <p className="text-gray-800 mb-2">{post.content}</p>
                <div className="space-x-2">
                  <button
                    onClick={() => handleLike(post.id, true)}
                    className="text-green-600 hover:underline"
                  >
                    👍 Like
                  </button>
                  <button
                    onClick={() => handleLike(post.id, false)}
                    className="text-red-600 hover:underline"
                  >
                    👎 Dislike
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No posts to show yet.</p>
          )}
        </div>
      </section>

      {/* Notifications */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🔔 Notifications</h2>
        <ul className="space-y-2 overflow-auto h-50">
          {notifications.map((n, i) => (
            <li
              key={i}
              className="border-l-4 border-yellow-400 bg-yellow-50 p-3 rounded"
            >
              <p>
                <strong className="capitalize">{n.type}</strong>: {n.message}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
