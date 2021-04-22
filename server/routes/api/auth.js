import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../../middleware/auth'; // check path.
import config from '../../config/index';
import User from '../../models/user';

const { JWT_SECRET } = config;
const router = express.Router();

/**
 * 	@ Route 	POST 	api/auth
 * 	@ Desc 		Auth 	user
 * 	@ Access	Public
 */
router.post('/', (request, response) => {
	const { email, password } = request.body;

	// Simple validation
	if (!email || !password) {
		return response.status(400).json({ msg: 'Fill in all fields.' });
	}

	// Check for existing user
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
		console.error(err);
		response.status(400).json({ msg: err.message });
	}
});

export default router;
