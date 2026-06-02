import { UserModel, IUser } from "../users/user.model";

const register = async (userData: any) => {
  const { username, email, password } = userData;

  const existingUser: IUser | null = await UserModel.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new Error("Please select another username or email");
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
    throw new Error("Invalid credentials. Username not found.");
  }

  const isPasswordValid: boolean = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials. Password is not valid.");
  }

  return user;
};

export default {
  register,
  login,
};
