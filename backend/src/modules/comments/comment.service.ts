import { UserModel, IUser } from "../users/user.model";
import { PostModel, IPost } from "../posts/post.model";
import { CommentModel, IComment } from "./comment.model";
import { AppError } from "../../exceptions/AppError";

const createComment = async (commentData: any) => {
  const { postId, content, author } = commentData;

  const user: IUser | null = await UserModel.findById(author);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const post: IPost | null = await PostModel.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const newComment: IComment | null = await CommentModel.create({
    content,
    author,
  });

  post.comments?.push(newComment._id);
  await post.save();

  return { comment: newComment };
};

const updateComment = async (commentData: any) => {
  const { postId, commentId, content, author } = commentData;

  const user: IUser | null = await UserModel.findById(author);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const post: IPost | null = await PostModel.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
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

  if (!updatedComment) {
    throw new AppError("Comment not found", 404);
  }

  return {
    comment: updatedComment,
    message: "Comment has successfully updated.",
  };
};

const deleteComment = async (commentData: any) => {
  const { commentId, postId } = commentData;

  const post = await PostModel.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const deletedComment: IComment | null =
    await CommentModel.findByIdAndDelete(commentId);

  if (!deletedComment) {
    throw new AppError("Comment not found", 404);
  }

  post.comments = post.comments?.filter((id) => id.toString() !== commentId);

  return {
    message: "Comment successfully deleted.",
  };
};

export default {
  createComment,
  updateComment,
  deleteComment,
};
