import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet'; // Change the name top of the browser.
import {
	POST_DELETE_REQUEST,
	POST_DETAIL_LOADING_REQUEST,
	USER_LOADING_REQUEST,
} from '../../redux/types';
import { Button, Col, Container, Row } from 'reactstrap';
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
import Comments from '../../components/comments/Comments'; // s48

const PostDetail = (request) => {
	const dispatch = useDispatch();
	const { postDetail, creatorId, title, loading } = useSelector(
		(state) => state.post
	);
	const { userId, userName } = useSelector((state) => state.auth);
	// s48
	const { comments } = useSelector((state) => state.comment); // check redux for "comments"

	// console.log(request);

	useEffect(() => {
		dispatch({
			type: POST_DETAIL_LOADING_REQUEST,
			payload: request.match.params.id,
		});
		dispatch({
			type: USER_LOADING_REQUEST,
			payload: localStorage.getItem('token'),
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
		<Fragment>
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
					{/* s48 */}
					<Row>
						<Container className="mb-3 border border-blue rounded">
							{Array.isArray(comments)
								? comments.map(
										({
											contents,
											creator,
											date,
											_id,
											creatorName,
										}) => (
											<div key={_id}>
												<Row className="justify-content-between p-2">
													<div className="font-weight-bold">
														{creatorName
															? creatorName
															: creator}
													</div>
													<div className="text-small">
														<span className="font-weight-bold">
															{date.split(' ')[0]}
														</span>
														<span className="font-weight-light">
															{' '}
															{date.split(' ')[1]}
														</span>
													</div>
												</Row>
												<Row className="p-2">
													<div>{contents}</div>
												</Row>
												<hr />
											</div>
										)
								  )
								: 'Creator'}
							<Comments
								id={request.match.params.id}
								userId={userId}
								userName={userName}
							/>
						</Container>
						{/* e48 */}
					</Row>
				</Fragment>
			) : (
				<h1>Hi</h1>
			)}
		</Fragment>
	);

	return (
		<div>
			<Helmet title={`Post | ${title}`} />
			{loading === true ? GrowingSpinner : Body}
		</div>
	);
};

export default PostDetail;
