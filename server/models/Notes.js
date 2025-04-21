import mongoose from "mongoose";

const NotesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required:true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "General"
    },
    lock: {
        type: Boolean,
        default: false
    },
    password:{
        type:String,
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    },
},{timestamps:true});
const NotesModel = mongoose.model("notes",NotesSchema);
export default NotesModel;