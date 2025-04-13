import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8000));
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

const start = async () => {
    try {
        // Using the MongoDB URL you provided
        const mongoDbUrl = "mongodb+srv://guptanitintd:TnWqtPzflfaAlMCu@cluster0.2r7ulx8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        
        // Replace <db_password> with your actual password either from environment variable or directly
        const connectionString = process.env.DB_PASSWORD 
            ? mongoDbUrl.replace("TnWqtPzflfaAlMCu", process.env.DB_PASSWORD)
            : mongoDbUrl; // You'll need to replace <db_password> manually if not using env var
            
        const connectionDb = await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB Connected: ${connectionDb.connection.host}`);
        
        server.listen(app.get("port"), () => {
            console.log(`Server listening on port ${app.get("port")}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); // Exit with failure
    }
};

start();