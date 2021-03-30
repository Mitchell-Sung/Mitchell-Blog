import React, { Fragment, useState, useCallback, useEffect } from 'react';
import { Navbar, Container, NavbarToggler, Collapse, Nav } from 'reactstrap';
import {Link} from 'react-router-dom';
import LoginModal from '../components/auth/LoginModal';
import { useDispatch, useSelector } from 'react-redux';
import { LOGOUT_REQUEST } from '../redux/types';

const AppNavbar = () => {
    // s24
    const [isOpen, setIsOpen] = useState(false); 
    const { isAuthenticated, user, userRole } = useSelector((state) => state.auth); 
    console.log(userRole, "UserRole");

    const dispatch = useDispatch();

    const onLogout = useCallback(() => {
        dispatch({
            type: LOGOUT_REQUEST
        });
    }, [dispatch]);

    useEffect(() => {
        setIsOpen(false);
    }, [user]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Fragment>
            <Navbar color='dark' dark expand='lg' className='sticky-top'>
                <Container>
                    <Link to='/' className='text-white text-decoration-none'>
                        Blog Project (Mitchell's Blog)
                    </Link>
                    <NavbarToggler onClick={handleToggle}/>
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className='ml-auto d-flex justify-content-arount' navbar>
                            {isAuthenticated ? (
                                <h1 className='text-white'>authLink</h1>
                            ) : (
                                <LoginModal/>
                            )}
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        </Fragment>
    );
};

export default AppNavbar;

// Notes:

// ?? {link} from react-router-dom ??

// ?? className command ??

// 