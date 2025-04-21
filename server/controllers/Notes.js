import NotesModel from "../models/Notes.js";
import bcrypt from "bcryptjs";

//getAll
export const getAllNotesByUserId = async (req, res) => {
    try {
        const { id } = req.user;
        if (!id) {
            return res.status(201).send({ status: 'error', message: "User ID is required" });
        }
        const notes = await NotesModel.find({ user: id });
        if (notes.length === 0) {
            return res.status(201).send({ status: 'error', message: "No notes found for the provided user ID" });
        }
        return res.status(201).send({ notes, status: "success" });
    } catch (error) {
        return res.status(201).send({ error: error?.message || "Internal server error" });
    }
}
// Read a note
export const getNoteById = async (req, res) => {
    try {
        const noteId = req.query.id;
        const password  = req.query.pwd;
        const note = await NotesModel.findOne({ _id: noteId, user: req.user.id });
        
        if (!note) {
            return res.status(201).send({ status: 'error', message: 'Note not found' });
        }
        
        // Check if the note is locked
        if (note.lock) {
            if (password && bcrypt.compareSync(password, note.password)) {
                return res.status(200).send({ status: 'success', note });
            } else if (!bcrypt.compareSync(password, note.password)) { 
                return res.status(201).send({ status: 'error', message: 'Incorrect password' });
            }
        } else {
            return res.status(200).send({ status: 'success', note });
        }
    } catch (error) {
        return res.status(201).send({ status: 'error', message: 'Failed to retrieve note' });
    }
};
//create 
export const createNote = async (req, res) => {
    try {
        const { title, tag, description, lock, password } = req.body;

        const note = new NotesModel({
            title, tag, description, lock, password, user: req.user.id,
        });
        if (lock && password) {
            note.password = bcrypt.hashSync(password, 10);
        }
        await note.save();
        res.status(201).send({ status: 'success', message: "Note is create Successful!" });
    } catch (error) {
        return res.status(201).send({ error: error?.message || "Internal server error" });
    }
}
//update
export const updateNote = async (req, res) => {
    try {
        const { title, tag, description, lock, password } = req.body;
        const id = req.query.id;
        const note = await NotesModel.findOne({ _id: id, user: req.user.id });
        if (!note) {
            return res.status(201).send({ status: 'error', message: 'Note not found' });
        } else {
            note.title = title || note.title;
            note.description = description || note.description;
            note.tag = tag || note.tag;
            note.lock = lock !== undefined ? lock : note.lock;
            if (lock && password) {
                note.password = (password !== note.password)
                    ? bcrypt.hashSync(password, 10)
                    : note.password;
            } else {
                note.password = '';
            }

            await note.save();
            return res.status(200).send({ status: 'success', message: 'Note update successful!' });
        }


    } catch (error) {
        return res.status(500).send({ status: 'error', message: error?.message || 'Internal server error' });
    }
}
//delete
export const deleteNote = async (req, res) => {
    try {
        const noteId = req.query.id;
        const { password } = req.body;

        const note = await NotesModel.findOne({ _id: noteId, user: req.user.id });
        if (!note) {
            return res.status(201).send({ status: 'error', message: 'Note not found' });
        }
        if (note.lock) {
            // If note is locked, compare the provided password with the stored hashed password
            const isPasswordCorrect = bcrypt.compareSync(password, note.password);
            if (!isPasswordCorrect) {
                return res.status(401).send({ status: 'error', message: 'Incorrect password' });
            }
        }
        await NotesModel.findOneAndDelete({ _id: noteId, user: req.user.id });
        return res.status(201).send({ status: 'success', message: 'Note deleted successfully' });

    } catch (error) {
        return res.status(500).send({ status: "error", message: error?.message || "Internal server error" });
    }
}