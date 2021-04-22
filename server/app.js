import express from 'express';
import mongoose from 'mongoose';
import config from './config';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

/*
 *  Routes
 */
import postRoutes from './routes/api/post';
import userRoutes from './routes/api/user';
import authRoutes from './routes/api/auth';
import searchRoutes from './routes/api/search'; // [s56]

const app = express();
const { MONGO_URI } = config;
const prod = process.env.NODE_ENV === 'production';

app.use(hpp());
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

mongoose
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => console.log('MongoDB connecting Success!'))
	.catch((err) => console.log(err));

/*
 *  User Routes
 */
// app.all('*', (request, response, next) => {
// 	let protocol = request.headers['x-forward-proto'] || request.protocol;

// 	if (protocol === 'https') {
// 		next();
// 	} else {
// 		let to = `https://${request.hostname}${request.url}`;
// 		response.redirect(to);
// 	}
// });

app.use('/api/post', postRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes); // [s56]

// if (prod) {
// 	app.use(express.static(path.join(__dirname, '../client/build')));
// 	app.get('*', (request, response) => {
// 		response.sendFile(
// 			path.resolve(__dirname, '../client/build', 'index.html')
// 		);
// 	});
// }

export default app;
