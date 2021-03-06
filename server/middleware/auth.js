import jwt from 'jsonwebtoken';
import config from '../config/index';
const { JWT_SECRET } = config;

const auth = (request, response, next) => {
	const token = request.header('x-auth-token');

	if (!token) {
		return response
			.status(401)
			.json({ msg: 'Authentication denied because no token exists' });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		request.user = decoded;
		next();
	} catch (err) {
		console.error(err);
		response.status(400).json({ msg: 'The token is invalid.' });
	}
};

export default auth;
