import express, { request, response } from 'express';
import auth from '../../middleware/auth';
// Model
import Post from '../../models/post';
import Category from '../../models/category';
import User from '../../models/user';
import Comment from '../../models/comment';

const router = express.Router();

// s36 start
import multer from 'multer';
import multerS3 from 'multer-s3'; // manage moving files with aws s3
import path from 'path';
import AWS from 'aws-sdk'; // support aws tool
import dotenv from 'dotenv';
import moment from 'moment';

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

/*
 *	@route	POST api/post
 *	@desc	Create a Post
 *  @access	Private
 */
// Allow only authorized user to create posts.
// s40 Add
router.post('/', auth, uploadS3.none(), async (request, response, next) => {
	try {
		console.log(request, 'request');
		const { title, contents, fileUrl, creator, category } = request.body;
		const newPost = await Post.create({
			title: title,
			contents: contents,
			fileUrl: fileUrl,
			creator: request.user.id,
			date: moment().format('YYYY-MM-DD hh:mm:ss'),
		});

		const findResult = await Category.findOne({
			categoryName: category,
		});

		console.log(findResult, 'Finde Result');

		// isNullOrDefined is deprecated
		if (findResult == null) {
			const newCategory = await Category.create({
				categoryName: category,
			});
			await Post.findByIdAndUpdate(newPost._id, {
				$push: { category: newCategory._id },
			});
			await Category.findByIdAndUpdate(newCategory._id, {
				$push: { posts: newPost._id },
			});
			await User.findByIdAndUpdate(request.user.id, {
				$push: { posts: newPost._id },
			});
		} else {
			await Category.findByIdAndUpdate(findResult._id, {
				$push: { posts: newPost._id },
			});
			await Post.findByIdAndUpdate(newPost._id, {
				category: findResult._id,
			});
			await User.findByIdAndUpdate(request.user.id, {
				$push: { posts: newPost._id },
			});
		}
		return response.redirect(`/api/post/${newPost._id}`);
	} catch (err) {
		console.log(err);
	}
});

/*
 *	@route	POST api/post/:id
 *	@desc	Detail Post
 *  @access	Public
 */
router.get('/:id', async (request, response, next) => {
	try {
		const post = await (await Post.findById(request.params.id))
			.populate({ path: 'creator', select: 'name' }) // user
			.populate({ path: 'category', select: 'categoryName' });
		post.views += 1;
		post.save();
		console.log(post);
		response.json(post);
	} catch (err) {
		console.error(err);
		next(err);
	}
});

/*
 *	[Comments Route]
 * 	@ Route Get api/post/comments
 * 	@ Desc	Get All Comments
 * 	@ Access public
 */
router.get('/:id/comments', async (request, response) => {
	try {
		const comment = await (
			await Post.findById(request.params.id)
		).populated({
			path: 'comment', // check 'comment' from ./models/post.js
		});
		const result = comment.comments;
		console.log(result, 'comment load');
		response.json(result);
	} catch (err) {
		console.log(err);
	}
});

router.post('/:id/comments', async (request, response, next) => {
	const newComment = await Comment.create({
		contents: request.body.contents,
		creator: request.body.userId,
		creatorName: request.body.userName,
		post: request.body.id,
		date: moment().format('YYYY-MM-DD hh:mm:ss'),
	});
	console.log(newComment, 'newComment');

	try {
		await Post.findByIdAndUpdate(request.body.id, {
			$push: {
				comments: newComment._id,
			},
		});
		await User.findByIdAndUpdate(request.body.userId, {
			$push: {
				comments: {
					post_id: request.body.id,
					comment_id: newComment._id,
				},
			},
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
});

// shortcut "ed"
export default router;
