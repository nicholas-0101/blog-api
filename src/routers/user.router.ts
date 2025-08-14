import { Router } from "express";
import { getUserById, signIn, signUp } from "../controllers/user.controller";

const router: Router = Router();

router.post("/signup", signUp); // /blog/user/signup
/**
 * {
  "username" : "testing", 
  "email": "testing@gmail.com",
  "password": "testing"
}
 */
router.post("/signin", signIn); // /blog/user/signin
/**
 * {
"email": "testing@gmail.com",
"password": "testing"
}
*/
router.get("/:id", getUserById); // /blog/user/2 (used for show username in navbar)

export default router;
