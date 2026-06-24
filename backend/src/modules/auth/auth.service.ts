import { AppError } from "../../exceptions/AppError";
import { UserModel, IUser } from "../users/user.model";

const register = async (userData: any) => {
  const { username, email, password } = userData;

  const existingUser: IUser | null = await UserModel.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new AppError("User with this email or username already exists", 409);
  }

  const newUser: IUser | null = await UserModel.create({
    username,
    email,
    password,
  });

  return {
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
  };
};

const login = async (userData: any) => {
  const { username, password } = userData;

  const user: IUser | null = await UserModel.findOne({
    username,
  }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordValid: boolean = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
  };
};

export default {
  register,
  login,
};
