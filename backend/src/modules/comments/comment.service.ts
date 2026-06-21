import { UserModel, IUser } from "../users/user.model";
import { PostModel, IPost } from "../posts/post.model";
import { CommentModel, IComment } from "./comment.model";

const createComment = async (commentData: any) => {
  const { postId, content, author } = commentData;

  const user: IUser | null = await UserModel.findById(author);

  if (!user) {
    return;
  }

  const post: IPost | null = await PostModel.findById(postId);

  if (!post) {
    return;
  }

  const newComment: IComment | null = await CommentModel.create({
    content,
    author,
  });

  if (!newComment) {
    return;
  }

  post.comments?.push(newComment._id);
  await post.save();

  return newComment;
};

const updateComment = async (commentData: any) => {
  const { postId, commentId, content, author } = commentData;

  const user: IUser | null = await UserModel.findById(author);

  if (!user) {
    return;
  }

  const post: IPost | null = await PostModel.findById(postId);

  if (!post) {
    return;
  }

  const updatedData = {
    content,
    author,
  };

  const updatedComment: IComment | null = await CommentModel.findByIdAndUpdate(
    commentId,
    updatedData,
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).populate("author", "username avatar");

  return updatedComment;
};

const deleteComment = async (commentData: any) => {
  const { commentId, postId } = commentData;

  const post = await PostModel.findById(postId);

  if (!post) {
    return;
  }

  const deletedComment: IComment | null =
    await CommentModel.findByIdAndDelete(commentId);

  post.comments?.filter((id) => id != commentId);

  return deletedComment;
};

export default {
  createComment,
  updateComment,
  deleteComment,
};
