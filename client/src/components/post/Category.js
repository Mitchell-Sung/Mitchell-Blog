import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button } from 'reactstrap';

/*
 *  [s53]
 */
const Category = ({ posts }) => {
	// console.log(posts);
	return (
		<Fragment>
			{Array.isArray(posts)
				? posts.map(({ _id, categoryName, posts }) => (
						<div key={_id} className="mx-1 mt-1 my_category">
							<Link
								to={`/post/category/${categoryName}`}
								className="text-dark text-decoration-none"
							>
								<span className="ml-1">
									<Button color="info">
										{categoryName}{' '}
										<Badge color="light">
											{posts.length}
										</Badge>
									</Button>
								</span>
							</Link>
						</div>
				  ))
				: ''}
		</Fragment>
	);
};

export default Category;
