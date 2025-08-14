import { Router } from "express";
import { createBlog, deleteBlog, editBlog, getBlogDetails, getBlogs } from "../controllers/blog.controller";

const router: Router = Router();

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
router.get("/", getBlogs); 
router.get("/detail/:title", getBlogDetails); // /detail/testing2
router.patch("/edit/:id", editBlog); // /edit/2
/**
 * {
  "title" : "testing edit", 
  "thumbnail": "test edit",
  "category": "food"
}
 */
router.delete("/delete/:id", deleteBlog); // /delete/2

export default router