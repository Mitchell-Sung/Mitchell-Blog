import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config/index';
import User from '../../models/user';
import auth from '../../middleware/auth';

const { JWT_SECRET } = config;
const router = express.Router();

/*
 *	@ Routes	GET api/user
 *	@ Desc		GET all user
 * 	@ Access	Pulbic
 */
router.get('/', async (request, response) => {
	try {
		const users = await User.find();
		if (!users) throw Error('No users');
		response.status(200).json(users);
	} catch (err) {
		console.error(err);
		response.status(400).json({ msg: err.message });
	}
});

/*
 *	@ Routes	POST api/user
 *	@ Desc		Register user
 * 	@ Access	Pulbic
 */
router.post('/', (request, response) => {
	// console.log(request);
	const { name, email, password } = request.body;

	if (!name || !email || !password) {
		return response.status(400).json({ msg: 'Fill up all of them' });
	}

	User.findOne({ email }).then((user) => {
		if (user)
			return response
				.status(400)
				.json({ msg: 'User already joined exists.' });

		const newUser = new User({
			name,
			email,
			password,
		});

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) throw err;
				newUser.password = hash;
				newUser.save().then((user) => {
					jwt.sign(
						{ id: user.id },
						JWT_SECRET,
						{ expiresIn: 3600 },
						(err, token) => {
							if (err) throw err;
							response.json({
								token,
								user: {
									id: user.id,
									name: user.name,
									email: user.email,
								},
							});
						}
					);
				});
			});
		});
	});
});

/*
 *	@ Routes	POST	api/user/:username/profile
 *	@ Desc		POST	Edit Password
 * 	@ Access	Private
 */
router.post('/:userName/profile', auth, async (request, response) => {
	try {
		const { previousPassword, password, rePassword, userId } = request.body;
		const result = await User.findById(userId, 'password');
		// console.log(request.body, 'userName Profile');

		bcrypt.compare(previousPassword, result.password).then((isMatch) => {
			if (!isMatch) {
				return response.status(400).json({
					match_msg: 'It does not match the existing password.',
				});
			} else {
				if (password === rePassword) {
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(password, salt, (err, hash) => {
							if (err) throw err;
							result.password = hash;
							result.save();
						});
					});
					response.status(200).json({
						success_msg: 'Password update has succeeded.',
					});
				} else {
					response
						.status(400)
						.json({ fail_msg: 'The new password does not match.' });
				}
			}
		});
	} catch (err) {
		console.error(err);
	}
});

export default router;
