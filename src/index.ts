import express, { Application, NextFunction, Request, Response } from "express";
import userRouter from "./routers/user.router";
import blogRouter from "./routers/blog.router";
import cors from "cors";

const PORT = "4001";

// define api config
const app: Application = express();

const corsOptions = {
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};

// request middleware
app.use(cors(corsOptions)); // cors used to connect backend and frontend
app.use(express.json());

// config route
app.get("/", (request: Request, response: Response) => {
  response.status(200).send("<h1>API express</h1>"); // status 200, success
});

app.use("/blog/user", userRouter);
app.use("/blog", blogRouter);

// error handling middleware
app.use(
  (error: any, request: Request, response: Response, next: NextFunction) => {
    console.log(error);
    response.status(error.code || 500).send(error);
  }
);

app.listen(PORT, () => {
  console.log("API express running at port:", PORT,`-> http://localhost:${PORT}`);
});
