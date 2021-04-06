import moment from 'moment';
import mongoose, { mongo } from 'mongoose';

// s36 npm install multer-s3 path aws-sdk

const PostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		index: true,
	},
	contents: {
		type: String,
		required: true,
	},
	views: {
		type: Number,
		default: -2,
	},
	fileUrl: {
		type: String,
		default: 'https://source.unsplash.com/random/301x201',
	},
	date: {
		type: String,
		default: moment().format('YYYY-MM-DD hh:mm:ss'),
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'category',
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'comment',
		},
	],
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
});

const Post = mongoose.model('post', PostSchema);

export default Post;
