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
        .json({ success: false, message: "Wrong password!" });
    }

    const token = createToken(signInUser, "24h");
    console.log(token);

    response.status(200).send({
      success: true,
      message: "Sign In successful",
      user: { email: signInUser.email, token },
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
      user: { email: signInUser.email, token: newToken },
    });
  } catch (error) {
    next(error);
  }
};

// GET USER details for show in navbar
// export const getUserById = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.params;
//     const user = await prisma.user.findUnique({
//       where: { id:Number(id) },
//     });

//     if (!user) {
//       return res
//         .status(404)
//         .send({ success: false, message: "User not found" });
//     }

//     res.status(200).send({ success: true, user });
//   } catch (error) {
//     next(error);
//   }
// };
