import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet'; // Change the name top of the browser.
import {
	POST_DELETE_REQUEST,
	POST_DETAIL_LOADING_REQUEST,
	USER_LOADING_REQUEST,
} from '../../redux/types';
import { Button, Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { GrowingSpinner } from '../../components/spinner/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCommentDots,
	faMouse,
	faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import BallonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';
import { editorConfiguration } from '../../components/editor/EditorConfig';

// Display in the browser from transmitted the server.
const PostDetail = (request) => {
	const dispatch = useDispatch();
	const { postDetail, creatorId, title, loading } = useSelector(
		(state) => state.post
	);
	const { userId, userName } = useSelector((state) => state.auth);

	console.log(request);

	useEffect(() => {
		dispatch({
			type: POST_DETAIL_LOADING_REQUEST,
			payload: request.match.params.id,
		});
		dispatch({
			type: USER_LOADING_REQUEST,
			payload: localStorage.getItem('token'), // network > application > inspector
		});
	}, [dispatch, request.match.params.id]); // if missing this code, it will be infinit loop.

	const onDeleteClick = () => {
		dispatch({
			type: POST_DELETE_REQUEST,
			payload: {
				id: request.match.params.id,
				token: localStorage.getItem('token'),
			},
		});
	};

	const EditButton = (
		<Fragment>
			<Row className="d-flex justify-content-center pb-3">
				<Col className="col-md-3 mr-md-3">
					<Link to="/" className="btn btn-primary btn-block">
						Home
					</Link>
				</Col>
				<Col className="col-md-2 mr-md-3">
					<Link
						to={`/post/${request.match.params.id}/edit`}
						className="btn btn-success btn-block"
					>
						Edit Post
					</Link>
				</Col>
				<Col className="col-md-3">
					<Button
						className="btn-block btn-danger"
						onClick={onDeleteClick}
					>
						Delete
					</Button>
				</Col>
			</Row>
		</Fragment>
	);

	const HomeButton = (
		<Fragment>
			<Row className="d-flex justify-content-center pb-3">
				<Col className="col-sm-12 com-md-3">
					<Link to="/" className="btn btn-primary btn-block">
						Home
					</Link>
				</Col>
			</Row>
		</Fragment>
	);

	const Body = (
		<>
			{userId === creatorId ? EditButton : HomeButton}
			<Row className="border-bottom border-top border-primary p-3 d-flex justify-content-between">
				{(() => {
					if (postDetail && postDetail.creator) {
						return (
							<Fragment>
								<div className="font-weight-bold text-big">
									<span className="mr-3">
										<Button color="info">
											{postDetail.category.categoryName}
										</Button>
									</span>
									{postDetail.title}
								</div>
								<div className="align-self-end">
									{postDetail.creator.name}
								</div>
							</Fragment>
						);
					}
				})()}
			</Row>
			{postDetail && postDetail.comments ? (
				<Fragment>
					<div className="d-flex justify-content-end align-items-baseline small">
						<FontAwesomeIcon icon={faPencilAlt} />
						&nbsp;
						<span>{postDetail.date}</span>
						&nbsp;&nbsp;
						<FontAwesomeIcon icon={faCommentDots} />
						&nbsp;
						<span>{postDetail.comments.length}</span>
						&nbsp;&nbsp;
						<FontAwesomeIcon icon={faMouse} />
						<span>{postDetail.views}</span>
					</div>
					<Row className="mb-3">
						<CKEditor
							editor={BallonEditor} // just use viewer.
							data={postDetail.contents}
							config={editorConfiguration}
							disabled="true"
						/>
					</Row>
				</Fragment>
			) : (
				<h1>Hi</h1>
			)}
		</>
	);

	return (
		<div>
			<Helmet title={`Post | ${title}`} />
			{loading === true ? GrowingSpinner : Body}
		</div>
	);
};

export default PostDetail;
