import { Types } from "mongoose";
import { UserModel, IUser } from "./user.model";

const getUser = async (id: any) => {
  const user: IUser | null = await UserModel.findById(id)
    .select("-password")
    .populate("followers", "username avatar")
    .populate("following", "username avatar");

  return user;
};

const updateUser = async (userData: any) => {
  const { id, username, email, bio, avatar } = userData;

  const user: IUser | null = await UserModel.findById(id);

  if (!user) {
    return;
  }

  // Check if username exist already
  if (username && username !== user.username) {
    const existingUsername = await UserModel.findOne({
      username,
      _id: { $ne: id },
    });

    if (existingUsername) {
      throw new Error("Username already in use");
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
      throw new Error("Email already iun use.");
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

  return updatedUser;
};

const updateUserPassword = async (userData: any) => {
  const { id, currentPassword, newPassword } = userData;

  const user: IUser | null = await UserModel.findById(id).select("+password");

  if (!user) {
    return;
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new Error("Current password is incorrect");
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
    return;
  }

  return user.followers;
};

const getFollowings = async (id: string) => {
  const user = await UserModel.findById(id).populate(
    "following",
    "username avatar",
  );

  if (!user) {
    return;
  }

  return user.following;
};

const toggleFollowing = async (id: string, followingId: string) => {
  if (id === followingId) {
    throw new Error("You cannot follow yourself");
  }

  const currentUser = await UserModel.findById(id);
  const followingUser = await UserModel.findById(followingId);

  if (!currentUser || !followingUser) {
    return;
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
  getUser,
  updateUser,
  updateUserPassword,
  getFollowers,
  getFollowings,
  toggleFollowing,
};
