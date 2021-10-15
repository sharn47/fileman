import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cors from 'cors'
const bodyParser = require('body-parser');

const fileRoutes = require('./routes/file-upload-routes');

dotenv.config();

connectDB();

const app = express(); 

app.use(express.json()); 

app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);


const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}


app.use(notFound);
app.use(errorHandler);

app.use(cors());

require('./database')();


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', fileRoutes.routes);




const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}..`.yellow
      .bold
  )
);

