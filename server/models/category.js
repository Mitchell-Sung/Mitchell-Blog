import mongoose from 'mongoose';

/**
 * 	Create category schema
 */
const CategorySchema = new mongoose.Schema({
	categoryName: {
		type: String,
		default: 'undefined',
	},
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'post',
		},
	],
});

const Category = mongoose.model('category', CategorySchema);

export default Category;
