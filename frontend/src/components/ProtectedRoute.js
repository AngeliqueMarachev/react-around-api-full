import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ children, loggedIn, ...props }) => {
    const token = localStorage.getItem('jwt');
    return (
        <Route {...props} >
            {token || loggedIn ? children : <Redirect to={'/signin'} />}
        </Route>
    );
}

export default ProtectedRoute;