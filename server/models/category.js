import mongoose, { mongo } from 'mongoose';

// Create Schema
const CategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        default:"undefined",
    },
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
    },],
});

const Category = mongoose.model("category", CategorySchema);

export default Category;