import express, { request, response } from 'express';
import auth from '../../middleware/auth';
// Model
import Post from '../../models/post';
import auth from '../../middleware/auth';

const router = express.Router();

// s36 start
import multer from 'multer';
import multerS3 from 'multer-s3'; // manage moving files with aws s3
import path from 'path';
import AWS from 'aws-sdk'; // support aws tool
import { dotenv } from '../../../client/config/paths';

dotenv.config();

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_KEY,
	secretAccessKey: process.env.AWS_PRIVATE_KEY,
});

const uploadS3 = multer({
	storage: multerS3({
		s3, // access key
		bucket: 'mitchell-blog/upload', // will change aws educate account
		region: 'ca-central-1',
		key(request, file, callback) {
			const extension = path.extname(file.originalname);
			const basename = path.basename(file.originalname, extension);
			callback(null, basename + new Date().valueOf() + extension);
		},
	}),
	limits: { fileSize: 100 * 1024 * 1024 }, // 100 mb
});

// @route     POST api/post/image
// @desc      Create a Post
// @access    Private
router.post(
	'/image',
	uploadS3.array('upload', 5),
	async (request, response, next) => {
		try {
			console.log(request.files.map((v) => v.location));
			response.json({
				uploaded: true,
				url: request.files.map((v) => v.location),
			});
		} catch (err) {
			console.error(err);
			response.json({ uploaded: false, url: null });
		}
	}
);

// s36 end

router.get('/', async (request, response) => {
	const postFindResult = await Post.find();
	console.log(postFindResult, 'All Post Get');
	response.json(postFindResult); // server have to response to the browser.
});

// Allow only authorized user to create posts.
router.post('/', auth, async (request, response, next) => {
	try {
		console.log(request, 'request');
		const { title, contents, fileUrl, creator } = request.body;
		const newPost = await Post.create({
			title: title,
			contents: contents,
			fileUrl: fileUrl,
			creator: creator,
		});
		response.json(newPost);
	} catch (err) {
		console.log(err);
	}
});

// shortcut "ed"
export default router;
