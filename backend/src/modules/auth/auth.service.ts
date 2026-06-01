import bcrypt from "bcrypt";
import { UserModel, IUser } from "../users/user.model";
import { generateToken } from "../../middleware/auth.middleware";

const register = async (userData: any) => {
  const { username, email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser: IUser | null = await UserModel.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new Error("Please select another username or email");
  }

  const newUser: IUser | null = await UserModel.create({
    username,
    email,
    password: hashedPassword,
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
    throw new Error("Invalid credentials");
  }

  const isPasswordValid: boolean = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id.toString());

  return {
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  };
};

export default {
  register,
  login,
};
