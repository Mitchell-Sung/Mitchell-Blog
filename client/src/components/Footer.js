import React from 'react';
import { Row, Col } from 'reactstrap';

const Footer = () => {
	const thisYear = () => {
		const year = new Date().getFullYear();
		return year;
	};

	return (
		<div id="main-footer" className="text-center p-2">
			<Row>
				<Col>
					<p>
						Copyright &copy;<span>{thisYear()}</span>
					</p>
				</Col>
			</Row>
		</div>
	);
};

export default Footer;

// Notes:
// <Row> and <Col>???
// Footer > Router.js > App.js > Index.js / how to find the reactstrap like row and col.
