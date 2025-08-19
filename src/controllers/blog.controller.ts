import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";

// GET all blogs
export const getBlogs = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        thumbnail: true,
        content: true,
        category: true,
        createdAt: true,
        author: {
          select: { username: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (blogs.length === 0) {
      return response.status(404).send({
        success: false,
        message: "No blogs found",
      });
    }

    response.status(200).send({
      success: true,
      message: "Blogs retrived succesfully",
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

// GET blog for signed in user
export const getMyBlogs = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { userId } = request.params; 
  
  try {
    const blogs = await prisma.blog.findMany({
      where: { authorId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });

    response.send({
      success: true,
      message: "Blog retrived succesfully",
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

// GET blog details
export const getBlogDetails = async (
  request: Request,
  response: Response,
  next: NextFunction //next untuk mengarahkan ke middleware selanjutnya (dalam case ini, ke middleware error)
) => {
  const { title } = request.params;
  try {
    const blog = await prisma.blog.findUnique({
      where: { title },
      select: {
        title: true,
        thumbnail: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!blog) {
      return response.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }

    response.status(200).send({
      success: true,
      message: "Blog retrived succesfully",
      blog,
    });
  } catch (error: any) {
    next(error);
  }
};

// CREATE new blog
export const createBlog = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    console.log(request.body)
    const { title, thumbnail, category, content, authorId } = request.body;
    const newBlog = await prisma.blog.create({
      data: {
        title,
        thumbnail,
        category,
        content,
        author: {
          connect: { id: Number(authorId) }, 
        },
      },
      include: {
        author: true, // Include the related author
      },
    });

    response.status(200).send({
      success: true,
      message: "Blog added successfully",
      newBlog,
    });
  } catch (error: any) {
    next(error);
  }
};

// EDIT a blog
export const editBlog = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const update = await prisma.blog.update({
      where: {
        id: parseInt(request.params.id), // Find the blog by ID
      },
      data: request.body, // Update with the request body
    });

    response.status(200).send({
      success: true,
      message: "Blog updated successfully",
      updatedBlog: update,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      // P2025 is Prisma's error code for "Record to update not found"
      return response.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }
    next(error);
  }
};

// DELETE a blog
export const deleteBlog = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const remove = await prisma.blog.delete({
      where: {
        id: parseInt(request.params.id), // Find the blog by ID
      },
    });

    response.status(200).send({
      success: true,
      message: "Blog deleted successfully",
      deletedBlog: remove,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      // P2025 is Prisma's error code for "Record to delete not found"
      return response.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }
    next(error);
  }
};
