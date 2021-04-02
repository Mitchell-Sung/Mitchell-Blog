import express, { request, response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../../middleware/auth'; // check path.
import config from '../../config/index';
const { JWT_SECRET } = config;

// Model
import User from '../../models/user';

const router = express.Router();

// @route   POST    api/auth
// @desc    Auth    user
// @access  public
router.post('/', (request, response) => {
	const { email, password } = request.body;

	if (!email || !password) {
		return response.status(400).json({ msg: 'Fill in all fields.' });
	}

	User.findOne({ email }).then((user) => {
		if (!user)
			return response.status(400).json({ msg: 'User does not exist.' });

		bcrypt.compare(password, user.password).then((isMatch) => {
			if (!isMatch)
				return response
					.status(400)
					.json({ msg: 'Password does not match.' });
			jwt.sign(
				{ id: user.id },
				JWT_SECRET,
				{ expiresIn: '2 days' },
				(err, token) => {
					if (err) throw err;
					response.json({
						token,
						user: {
							id: user.id,
							name: user.name,
							email: user.email,
							role: user.role,
						},
					});
				}
			);
		});
	});
});

router.post('/logout', (request, response) => {
	response.json({ msg: 'Logout has been successful!' });
});

router.get('/user', auth, async (request, response) => {
	try {
		const user = await User.findById(request.user.id).select('-password');
		if (!user) throw Error('User does not exist');
		response.json(user);
	} catch (err) {
		console.log(err);
		response.status(400).json({ msg: err.message });
	}
});

export default router;
