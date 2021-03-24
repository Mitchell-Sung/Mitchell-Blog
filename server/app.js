import express from "express";
import mongoose from "mongoose";
import config from "./config";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

// Routes
import postRoutes from "./routes/api/post";
import userRoutes from "./routes/api/user"; 

const app = express();
const {MONGO_URI} = config;

app.use(hpp());
app.use(helmet());
app.use(cors({origin: true, credentials: true}));
app.use(morgan("dev"));
app.use(express.json());

mongoose.connect(MONGO_URI,{
    useNewUrlParser: true,    
    useUnifiedTopology: true,
    // remove warning messages
    useCreateIndex: true,
})
.then(() => console.log("MongoDB connecting Success!"))
.catch((e) => console.log(e));

// User routes
app.get("/");
app.use('/api/post', postRoutes);
app.use('/api/user', userRoutes);

export default app;