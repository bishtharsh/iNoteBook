import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

// Register User
export const Register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if the user already exists
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(201).send({
        status: "error",
        message: "The email already exists. Please try registering with a different email.",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    let user = await UserModel.create({ name, email, password: hashedPassword });
    if (user) return res.status(201).send({ status: "success", message: "User successfully registered." });
  } catch (error) {
    res.status(500).send({ error: error?.message || "Internal server error" });
  }
};

// Login User (using cookies)
export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(201).send({
        status: "error",
        message: "Please try logging in with the correct credentials!",
      });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(201).send({
        status: "error",
        message: "Please try logging in with the correct credentials!",
      });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "30m" });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 30,
      sameSite: 'Lax',
      domain: 'localhost',
    });

    return res.status(200).send({ status: "success", message: `iNoteBook: Welcome, ${user.name}!` });
  } catch (error) {
    return res.status(500).send({ error: error?.message || "Internal server error" });
  }
};

// Get User Details Without Password
export const GetUserWithoutPassword = async (req, res) => {
  const { id } = req.user;
  try {
    // Find the user and exclude the password field
    let user = await UserModel.findOne({ _id: id }).select("-password");
    if (!user) {
      return res.status(201).send({
        status: "error",
        message: "User not found"
      });
    }
    let userData = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    return res.status(201).send({ status: "success", message: `iNoteBook: Welcome, ${user.name}!`, userData });
  } catch (error) {
    return res.status(500).send({ error: error?.message || "Internal server error" }); return res.status(201).send({ error: error?.message || "Internal server error" });
  }
};

export const updateDetails = async (req, res) => {
  try {
    const {id,name,email} = req.body;
    
    if (!id || !name || !email) {
      return res.status(201).send({ status: 'error', message: 'User name and email are required' });
    }

    if(id === req.user.id){
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(201).send({ status: 'error', message: 'Sorry, User details not found' });
      }
      user.name =  name;
      user.email = email;
      await user.save();
      return res.status(202).send({ status: 'success', message:'Details updated successful!' });
    }
  } catch (error) {
    return res.status(201).send({ status: 'error', message: 'Failed to retrieve note' });
  }
}

export const updatePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(201).send({ status: 'error', message: 'All fields are required.' });
    }
    if(userId === req.user.id){
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(201).send({ status: 'error', message: 'Sorry, User details not found.' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(201).send({ status: 'error', message: 'Current password is incorrect.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();

      return res.status(202).send({ status: 'success', message: 'Password updated successful.' });
    }
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(201).send({ status: 'error', message: 'Something went wrong. Please try again.' });
  }
};

export const verifyPassword = async (req,res) => {
  try {
    const { id, pwd } = req.query;

    if (!id || !pwd) {
      return res.status(201).send({ status: 'error', message: 'User ID and password are required.' });
    }
    if (id !== req.user.id){
      return res.status(201).send({ status: 'error', message: 'User ID not match .' });
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(201).send({ status: 'error', message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(pwd, user.password);

    if (isMatch) {
      return res.status(202).send({ status: 'success', message: 'Password verified.' });
    } else {
      return res.status(201).send({ status: 'error', message: 'Incorrect password.' });
    }
  } catch (error) {
    console.error('Password verification error:', error);
    return res.status(500).send({ status: 'error', message: 'Internal server error.' });
  }
}

export const Logout = async (req, res) => {
  try {
    res.clearCookie('auth_token');
    return res.status(202).send({ status: 'success', message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).send({ error: error?.message || "Internal server error" }); return res.status(201).send({ error: error?.message || "Internal server error" });
  }
}

