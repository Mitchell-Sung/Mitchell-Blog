import express from 'express';
import Post from '../../models/post';

/**
 *  [s56]
 */
const router = express.Router();

router.get('/:searchTerm', async (request, response, next) => {
	try {
		const result = await Post.find({
			title: { $regex: request.params.searchTerm, $options: 'i' },
		});
		// console.log(result, 'Search result');
		response.send(result);
	} catch (err) {
		console.error(err);
		next(err);
	}
});

export default router;
