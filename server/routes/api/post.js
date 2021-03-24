import express, { request, response } from 'express';
import auth from '../../middleware/auth';

// Model
import Post from '../../models/post';

const router = express.Router();

// api/post => in feture, defined frontend server...
// server have to response to the browser.
router.get('/', async(request, response) => {
    const postFindResult = await Post.find();
    console.log(postFindResult, "All Post Get");
    response.json(postFindResult);
});

// Allow only authorized user to create posts.
router.post('/', auth, async(request, response, next) => {
    try {
        console.log(request, "request");
        const {title, contents, fileUrl, creator} = request.body;
        const newPost = await Post.create({
            title: title,
            contents: contents, 
            fileUrl: fileUrl,
            creator: creator,
        });
        response.json(newPost);
    } catch(err) {
        console.log(err);
    }
});

// shortcut "ed"
export default router;
