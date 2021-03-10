import moment from 'moment';
import mongoose, { mongo } from 'mongoose';

// Create Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["MainJuin", "SubJuin", "User"],
        default: "User",
    },
    register_date: {
        type: Date,
        default: moment().format("YYYY-MM-DD hh:mm:ss"),
    },
    comments: [{
        post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post",
        }, 
        comment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment",
        },
    },],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
    },],
});

// "user" is reference variable.
const User = mongoose.model("user", UserSchema);

export default User;

// comments why use post_id and comment_id??
// posts is many people can read it, so it use array.
