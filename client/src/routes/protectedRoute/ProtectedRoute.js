import React, { Component } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

/**
 *  [s52] Edit a post
 */
export const EditProtectedRoute = ({ component: Component, ...rest }) => {
	const { userId } = useSelector((state) => state.auth);
	const { creatorId } = useSelector((state) => state.post);

	return (
		<Route
			{...rest}
			render={(props) => {
				if (userId === creatorId) {
					return <Component {...props} />;
				} else {
					return (
						<Redirect
							to={{
								pathname: '/',
								state: { from: props.location },
							}}
						/>
					);
				}
			}}
		/>
	);
};

/**
 * 	[s58] Profile Protected Route
 */
export const ProfileProtectedRoute = ({ component: Component, ...rest }) => {
	const { userName } = useSelector((state) => state.auth); // login userName
	// console.log(userName);

	return (
		<Route
			{...rest}
			render={(props) => {
				if (props.match.params.userName === userName) {
					return <Component {...props} />;
				} else {
					return (
						<Redirect
							to={{
								pathname: '/',
								state: { from: props.location },
							}}
						/>
					);
				}
			}}
		/>
	);
};
