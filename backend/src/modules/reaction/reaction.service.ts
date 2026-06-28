import { UserModel, IUser } from "../users/user.model";
import { PostModel, IPost } from "../posts/post.model";
import { AppError } from "../../exceptions/AppError";
import { redis } from "../../config/redis";

const toggleLikes = async (likesData: any) => {
  const { postId, userId } = likesData;
  const user: IUser | null = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const post: IPost | null = await PostModel.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const alreadyLiked = post.likes?.includes(user._id);

  if (alreadyLiked) {
    // Remove like
    post.likes = post.likes?.filter(
      (id) => id.toString() !== user._id.toString(),
    );
  } else {
    // Add like
    post.likes?.push(user._id);
  }

  await post.save();

  // Update likes in cache if exists
  const cached = await redis.get("popular_posts");

  if (cached) {
    const posts = JSON.parse(cached);

    const index = posts.findIndex((p: any) => p._id.toString() === postId);

    if (index !== -1) {
      posts[index].likes = post.likes;
      posts[index].likesCount = post.likes?.length;

      posts.sort((a: any, b: any) => b.likesCount - a.likesCount);

      await redis.setEx("popular_posts", 300, JSON.stringify(posts));
    }
  }

  return {
    liked: !alreadyLiked,
    likesCount: post.likes?.length,
    likes: post.likes,
  };
};

const toggleDislikes = async (dislikesData: any) => {
  const { postId, userId } = dislikesData;
  const user: IUser | null = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const post: IPost | null = await PostModel.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const alreadyDisliked = post.dislikes?.includes(user._id);

  if (alreadyDisliked) {
    // Remove dislike
    post.dislikes = post.dislikes?.filter(
      (id) => id.toString() !== user._id.toString(),
    );
  } else {
    // Add dislike
    post.dislikes?.push(user._id);
  }

  await post.save();

  return {
    disliked: !alreadyDisliked,
    dislikesCount: post.dislikes?.length,
    dislikes: post.dislikes,
  };
};

export default {
  toggleLikes,
  toggleDislikes,
};
