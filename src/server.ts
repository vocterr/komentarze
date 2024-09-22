import express, {Request, Response} from "express";
import cors from "cors";
import dotenv from "dotenv";

import prisma from "../prisma/prisma";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get("/", (req: Request, res: Response) => {
    res.send("Backend is running");
});

app.get("/api/comments", async (req: Request, res: Response) => {
    try {
        const comments = await prisma.comment.findMany({
            orderBy: {createdAt: "desc"},
        });
        res.json(comments);
    }
    catch(error) {
        res.status(500).json({error: "Failed to fetch comments"})
    }
});

app.post("/api/comments", async (req: Request, res: Response) => {
    const {content, username} = req.body;
        if(!username || !content) {
            return res.status(400).json({error: "Username and content are required"});
        }

        if(content.length > 2000) {
            return res.status(400).json({error: "Content exceeds maximum length of 2000 characters."});
        }
        try {
            const newComment = prisma.comment.create({
                data: {
                    username,
                    content
                }
            });
            res.status(201).json(newComment);
        }
        catch(error) {
            res.status(500).json({error: "Failed to add comment."});
        }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));