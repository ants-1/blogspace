import { redis } from "../../config/redis";
import { AppError } from "../../exceptions/AppError";
import { UserModel, IUser } from "../users/user.model";
import { PostModel, IPost } from "./post.model";

const getPosts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const posts: IPost[] | null = await PostModel.find()
    .populate("likes", "username avatar")
    .populate("dislikes", "username avatar")
    .skip(skip)
    .limit(limit);

  const total = await PostModel.countDocuments();

  return {
    posts,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const getPopularPosts = async () => {
  const cacheKey = "popular_posts";

  // Check cache first
  const cachedPosts = await redis.get(cacheKey);

  if (cachedPosts) {
    return JSON.parse(cachedPosts);
  }

  console.log("Cache miss");

  const posts = await PostModel.aggregate([
    {
      $addFields: {
        likesCount: { $size: "$likes" },
      },
    },
    {
      $sort: {
        likesCount: -1,
        createdAt: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);

  // Populate author if needed
  await PostModel.populate(posts, [
    { path: "author", select: "username avatar" },
    { path: "likes", select: "username avatar" },
    { path: "dislikes", select: "username avatar" },
  ]);

  // Cache for 5 minutes
  await redis.setEx(cacheKey, 300, JSON.stringify(posts));

  return posts;
};

const getPost = async (id: string) => {
  const post = await PostModel.findById(id)
    .populate("likes", "username avatar")
    .populate("dislikes", "username avatar")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "username avatar",
      },
    });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  return { post };
};

const createPost = async (postData: any) => {
  const { title, content, featureImg, author } = postData;

  const user: IUser | null = await UserModel.findById(author);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const newPost: IPost | null = await PostModel.create({
    title,
    content,
    featureImg,
    author,
  });

  return { post: newPost };
};

const updatePost = async (id: string, updatedData: any) => {
  const user: IUser | null = await UserModel.findById(updatedData.author);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const updatedPost: IPost | null = await PostModel.findByIdAndUpdate(
    id,
    updatedData,
    {
      returnDocument: "after",
      runValidators: true,
    },
  )
    .populate("likes", "username avatar")
    .populate("dislikes", "username avatar")
    .populate("author", "username avatar");

  if (!updatedPost) {
    throw new AppError("Post not found");
  }

  return { post: updatedPost, message: "Post successfully updated" };
};

const deletePost = async (id: string) => {
  const deletedPost: IPost | null = await PostModel.findByIdAndDelete(id);

  if (!deletedPost) {
    throw new AppError("Post not found", 404);
  }

  return {
    message: "Post has been successfully deleted",
  };
};

export default {
  getPosts,
  getPost,
  getPopularPosts,
  createPost,
  updatePost,
  deletePost,
};
