import { UserModel, IUser } from "../users/user.model";
import { PostModel, IPost } from "./post.model";

const getPosts = async () => {
  const posts: IPost[] | null = await PostModel.find()
    .populate("likes", "username avatar")
    .populate("dislikes", "username avatar");

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

  return post;
};

const createPost = async (postData: any) => {
  const { title, content, featureImg, author } = postData;

  const user: IUser | null = await UserModel.findById(author);

  if (!user) {
    return;
  }

  const newPost: IPost | null = await PostModel.create({
    title,
    content,
    featureImg,
    author,
  });

  return newPost;
};

const updatePost = async (id: string, updatedData: any) => {
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

  return updatedPost;
};

const deletePost = async (id: string) => {
  const deletedPost: IPost | null = await PostModel.findByIdAndDelete(id);

  return deletedPost;
};

export default {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
