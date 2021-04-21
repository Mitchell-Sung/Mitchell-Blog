import React, { Fragment } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppNavbar from '../components/AppNavbar';
import { Container } from 'reactstrap';
import { Redirect, Route, Switch } from 'react-router';
import PostCardList from './normalRoute/PostCardList';
import PostWrite from './normalRoute/PostWrite';
import PostDetail from './normalRoute/PostDetail';
import CategoryResult from './normalRoute/CategoryResult';
import PostEdit from './normalRoute/PostEdit';
import Search from './normalRoute/Search';
import {
	EditProtectedRoute,
	ProfileProtectedRoute,
} from './protectedRoute/ProtectedRoute';
import Profile from './normalRoute/Profile';

const MyRouter = () => {
	return (
		<Fragment>
			<AppNavbar />
			<Header />
			<Container id="main-body">
				<Switch>
					<Route path="/" exact component={PostCardList} />
					<Route path="/post" exact component={PostWrite} />
					<Route path="/post/:id" exact component={PostDetail} />
					{/* s52 */}
					<EditProtectedRoute
						path="/post/:id/edit"
						exact
						component={PostEdit}
					/>
					<Route
						path="/post/category/:categoryName"
						exact
						component={CategoryResult}
					/>
					<Route
						path="/search/:searchTerm"
						exact
						component={Search}
					/>
					{/* [s58] */}
					<ProfileProtectedRoute
						path="/user/:userName/profile"
						exact
						component={Profile}
					/>
					<Redirect from="*" to="/" />
				</Switch>
			</Container>
			<Footer />
		</Fragment>
	);
};

export default MyRouter;
