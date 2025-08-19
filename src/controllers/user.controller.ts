import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hashPassword";
import { compare } from "bcrypt";
import { createToken } from "../utils/createToken";
import { verify } from "jsonwebtoken";

// SIGN UP
export const signUp = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // check email and username has regestered or not
    const { email, username } = request.body;
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return response
        .status(400)
        .send({ success: false, message: "Username already registered" });
    }
  
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return response
        .status(400)
        .send({ success: false, message: "Email already registered" });
    }
    
    // create a new account
    const newUser = await prisma.user.create({
      data: {
        ...request.body,
        password: await hashPassword(request.body.password),
      },
    });
    
    response.status(200).send({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

// SIGN IN
export const signIn = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = request.body;

    const signInUser = await prisma.user.findUnique({
      where: {
        email: String(email),
      },
    });

    // if user not registered
    if (!signInUser) {
      return response.status(404).send({
        success: false,
        message: "Account not found",
      });
    }

    // validate password
    const comparePassword = await compare(
      request.body.password,
      signInUser.password
    );
    if (!comparePassword) {
      return response
        .status(401)
        .send({ success: false, message: "Password incorrect" });
    }

    const token = createToken(signInUser, "24h");
    console.log(token);

    response.status(200).send({
      success: true,
      message: "Sign In successful",
      user: {
        id: signInUser.id,
        email: signInUser.email,
        username: signInUser.username,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// KEEP LOGIN
export const keepLogin = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const token = request.headers.authorization?.split(" ")[1];
    console.log(token);

    if (!token) {
      throw { message: "Token not exist" };
    }

    const decrypt: any = verify(token, "secret");

    const signInUser = await prisma.user.findUnique({
      where: { id: parseInt(decrypt.id) },
    });

    if (!signInUser) {
      return response.status(404).send({
        success: false,
        message: "Account not found",
      });
    }

    const newToken = createToken(signInUser, "24h");

    response.status(200).send({
      success: true,
      message: "Sign In successful",
      user: {
        id: signInUser.id,
        email: signInUser.email,
        username: signInUser.username,
        token: newToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
