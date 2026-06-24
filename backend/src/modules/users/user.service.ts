import { Types } from "mongoose";
import { UserModel, IUser } from "./user.model";
import { AppError } from "../../exceptions/AppError";

const getUsers = async () => {
  const users: IUser[] | null = await UserModel.find()
    .select("-password")
    .populate("followers", "username avatar")
    .populate("following", "username avatar");

  if (!users) {
    throw new AppError("Users not found", 404);
  }

  return { users };
};

const getUser = async (id: any) => {
  const user: IUser | null = await UserModel.findById(id)
    .select("-password")
    .populate("followers", "username avatar")
    .populate("following", "username avatar");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return { user };
};

const updateUser = async (userData: any) => {
  const { id, username, email, bio, avatar } = userData;

  const user: IUser | null = await UserModel.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Check if username exist already
  if (username && username !== user.username) {
    const existingUsername = await UserModel.findOne({
      username,
      _id: { $ne: id },
    });

    if (existingUsername) {
      throw new AppError("Username already in use", 409);
    }

    user.username = username;
  }

  // Check if email exist already
  if (email && email !== user.email) {
    const existingEmail = await UserModel.findOne({
      email,
      _id: { $ne: id },
    });

    if (existingEmail) {
      throw new AppError("Email already in use", 409);
    }

    user.email = email;
  }

  if (bio !== undefined) {
    user.bio = bio;
  }

  if (avatar != undefined) {
    user.avatar = avatar;
  }

  await user.save();
  const updatedUser = await UserModel.findById(id).select("-password");

  return { user: updatedUser };
};

const updateUserPassword = async (userData: any) => {
  const { id, currentPassword, newPassword } = userData;

  const user: IUser | null = await UserModel.findById(id).select("+password");

  if (!user) {
    throw new AppError("User not found");
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = newPassword;

  await user.save();

  return {
    message: "Password updated sucessfully",
  };
};

const getFollowers = async (id: string) => {
  const user = await UserModel.findById(id).populate(
    "followers",
    "username avatar",
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return { followers: user.followers };
};

const getFollowings = async (id: string) => {
  const user = await UserModel.findById(id).populate(
    "following",
    "username avatar",
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return { follwings: user.following };
};

const toggleFollowing = async (id: string, followingId: string) => {
  if (id === followingId) {
    throw new AppError("You cannot follow yourself", 400);
  }

  const currentUser = await UserModel.findById(id);
  const followingUser = await UserModel.findById(followingId);

  if (!currentUser || !followingUser) {
    throw new AppError("User not found", 404);
  }

  const isFollowing = currentUser.following?.some(
    (followedId) => followedId.toString() === followingId,
  );

  if (isFollowing) {
    // Unfollow
    currentUser.following = currentUser.following?.filter(
      (followedId) => followedId.toString() !== followingId,
    );

    followingUser.followers = followingUser.followers?.filter(
      (followerId) => followerId.toString() !== id,
    );

    await currentUser.save();
    await followingUser.save();

    return {
      message: "User unfollowed successfully",
    };
  }

  // Follow
  currentUser.following?.push(new Types.ObjectId(followingId));

  followingUser.followers?.push(new Types.ObjectId(id));

  await currentUser.save();
  await followingUser.save();

  return {
    message: "User followed successfully",
  };
};

export default {
  getUsers,
  getUser,
  updateUser,
  updateUserPassword,
  getFollowers,
  getFollowings,
  toggleFollowing,
};
