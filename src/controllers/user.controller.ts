import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";

// SIGN UP
export const signUp = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const newUser = await prisma.user.create({
      data: { ...request.body },
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
    const { email, password } = request.query;

    const signInUser = await prisma.user.findFirst({
      where: {
        email: String(email),
        password: String(password),
      },
    });

    response.status(200).send({
      success: true,
      message: "Sign In successful",
      user: signInUser,
    });
  } catch (error) {
    next(error);
  }
};
