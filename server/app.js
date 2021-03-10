import express from "express";
import mongoose from "mongoose";
import config from "./config";

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
})
.then(() => console.log("MongoDB connecting Success!"))
.catch((e) => console.log(e));

// User routes
app.get("/");




export default app;