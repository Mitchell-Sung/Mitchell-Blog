import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { POST_LOADING_REQUEST } from '../../redux/types';
import { Helmet } from 'react-helmet';
import { Row } from 'reactstrap';
import { GrowingSpinner } from '../../components/spinner/Spinner';
import PostCardOne from '../../components/post/PostCardOne';

// Main Component (Home)
const PostCardList = () => {
	// posts from ./client/redux/reducers/postReducer.js/initialState
	const { posts } = useSelector((state) => state.post);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch({ type: POST_LOADING_REQUEST, payload: 0 });
	}, [dispatch]);

	return (
		// npm install react-helmet
		<Fragment>
			<Helmet title="Home" />
			<Row className="border-bottom border-top border-primary py-2 mb-3">
				{posts ? <PostCardOne posts={posts} /> : GrowingSpinner}
			</Row>
		</Fragment>
	);
};

export default PostCardList;
