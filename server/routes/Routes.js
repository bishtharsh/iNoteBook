import express from "express";
import { Register, Login, GetUserWithoutPassword, Logout, verifyPassword, updatePassword, updateDetails, } from "../controllers/User.js";
import { authenticateToken, getToken } from "../middleware/authMiddleware.js";
import { getAllNotesByUserId, createNote, updateNote, deleteNote, getNoteById } from '../controllers/Notes.js';

const router = express.Router();
///user
// Register route
router.post("/register", Register);

// Login route
router.post("/login", Login);

router.post("/logout", authenticateToken, Logout);

// Get user details without password route
router.get("/user", authenticateToken, GetUserWithoutPassword);

router.get("/verifyPwd", authenticateToken, verifyPassword);

router.put("/updateDetails", authenticateToken, updateDetails);

router.put("/updatePassword", authenticateToken, updatePassword);

router.post("/")

///Authenticate
router.get("/getToken", getToken);

///Notes
router.get('/getAllNotes',authenticateToken, getAllNotesByUserId);

router.get('/getNote',authenticateToken, getNoteById);

// Create a new note
router.post('/createNote', authenticateToken,createNote);

// Update an existing note
router.put('/updateNote', authenticateToken, updateNote);

// Delete a note
router.delete('/deleteNote', authenticateToken, deleteNote);

export default router;
