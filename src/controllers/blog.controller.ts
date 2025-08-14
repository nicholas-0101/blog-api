import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";

// GET all blogs and filtered blogs by TITLE OR CATEGORY OR AUTHOR USERNAME
export const getBlogs = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const filterBlogs: any = {};
    if (request.query.title) {
      // If a title query parameter is provided, filter by title
      filterBlogs.title = request.query.title;
    } else if (request.query.category) {
      filterBlogs.category = request.query.category;
    } else if (request.query.username) {
      filterBlogs.author = {
        username: request.query.username,
      };
    }
    
    const blogs = await prisma.blog.findMany({
      where: filterBlogs, // Filtering based on query parameters
      include: {
        author: true, // Include the related category data
      },
      omit: {
        authorId: true, // Exclude categoryId from the response
      },
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
      tracker: blogs,
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
  try {
    const filterBlogs: any = {};
    if (request.params.title) {
      // If a title query parameter is provided, filter by title
      filterBlogs.title = request.params.title;
    }
    
    const blog = await prisma.blog.findUnique({
      where: filterBlogs, // Filtering based on query parameters
      include: {
        author: true, // Include the related category data
      },
      omit: {
        authorId: true, // Exclude categoryId from the response
      },
    });
    
    if (!blog) {
      return response.status(404).send({
        success: false,
        message: "No blogs found",
      });
    }
    
    response.status(200).send({
      success: true,
      message: "Blog retrived succesfully",
      tracker: blog,
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
    const newBlog = await prisma.blog.create({
      data: { ...request.body },
      include: {
        author: true, // Include the related author
      },
      omit: {
        authorId: true, // Exclude authorId from the response
      },
    });

    response.status(200).send({
      success: true,
      message: "Blog added successfully",
      tracker: newBlog,
    });
  } catch (error:any) {
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
      where:{
        id: parseInt(request.params.id), // Find the blog by ID
      },
      data:request.body, // Update with the request body
    })

    response.status(200).send({
      success: true,
      message: "Blog updated successfully",
      blog: update,
    });

  } catch (error: any) {
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
      where:{
        id: parseInt(request.params.id), // Find the blog by ID
      }
    })

    response.status(200).send({
      success: true,
      message: "Blog deleted successfully",
      blog: remove,
    });
  } catch (error: any) {
    next(error);
  }
};
