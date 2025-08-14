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
    const { email, password } = request.body;

    const signInUser = await prisma.user.findFirst({
      where: {
        email: String(email),
        password: String(password),
      },
    });

    if (!signInUser) {
      return response.status(404).send({
        success: false,
        message: "Account not found",
      });
    }

    response.status(200).send({
      success: true,
      message: "Sign In successful",
      user: signInUser,
    });
  } catch (error) {
    next(error);
  }
};

// GET USER details for show in navbar
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    res.status(200).send({ success: true, user });
  } catch (error) {
    next(error);
  }
};