import { Router } from "express";
import { createBlog } from "../controllers/blog.controller";

const router: Router = Router();

router.post("/create", createBlog); 
// router.get("/", getTracker); 
// router.patch("/edit/:id", editTracker); 
// router.delete("/delete/:id", deleteTracker); 
// router.get("/total-by-category/:categoryId", getTotalByCategory); // /total-by-category/1
// router.get("/detail/:id", getTrackerDetail); 
// router.get("/total-by-date", getTotalByDateRange); // /total-by-date?start=2025-08-01&end=2025-08-30

export default router