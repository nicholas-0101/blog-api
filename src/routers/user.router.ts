import { Router } from "express";
import { signIn, signUp } from "../controllers/user.controller";

const router: Router = Router();

router.post("/signup", signUp); // /blog/user/signup
/**
 * {
  "username" : "testing", 
  "email": "testing@gmail.com",
  "password": "testing"
}
 */
router.get("/signin", signIn); // /blog/user/signin?email=testing@gmail.com&password=testing

export default router;