import React, { Fragment } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppNavbar from '../components/AppNavbar'; 

const MyRouter = () => {
    return (
        <Fragment>
            <AppNavbar/>
            <Header/>
                <h1>Hello Body</h1>
            <Footer/>
        </Fragment>
    );
};

export default MyRouter;