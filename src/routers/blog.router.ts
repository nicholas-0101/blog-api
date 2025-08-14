import { Router } from "express";
import { createBlog, deleteBlog, editBlog, getBlogDetails, getBlogs } from "../controllers/blog.controller";

const router: Router = Router();

router.get("/", getBlogs); // /blog or /blog?title=testing or /blog?category=health or /blog?author=testing
router.get("/detail/:title", getBlogDetails); // /blog/detail/testing
router.post("/create", createBlog); // /blog/create
/**
 * {
  "title" : "testing", 
  "thumbnail": "test",
  "category": "health",
  "content": "lorem ipsum dolor sit amet",
  "authorId": 1
}
 */
router.patch("/edit/:id", editBlog); // /blog/edit/2
/**
 * {
  "title" : "testing edit", 
  "thumbnail": "test edit",
  "category": "food"
}
 */
router.delete("/delete/:id", deleteBlog); // /blog/delete/2

export default router