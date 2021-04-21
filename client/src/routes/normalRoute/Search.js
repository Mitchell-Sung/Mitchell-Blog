import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SEARCH_REQUEST } from '../../redux/types';
import { Row } from 'reactstrap';
import PostCardOne from '../../components/post/PostCardOne';

/*
 *	[s56]
 */
const Search = () => {
	const dispatch = useDispatch();
	let { searchTerm } = useParams();
	const { searchResult } = useSelector((state) => state.post);

	console.log(searchResult, 'useParams');

	useEffect(() => {
		if (searchTerm) {
			dispatch({ type: SEARCH_REQUEST, payload: searchTerm });
		}
	}, [dispatch, searchTerm]);

	return (
		<div>
			<h1>Search Result: '{searchTerm}'</h1>
			<Row>
				<PostCardOne posts={searchResult} />
			</Row>
		</div>
	);
};

export default Search;
