import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/*Private router to enable custom routing*/
const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
          {...rest}
          render = { props => (sessionStorage.getItem('access-token') !== null) 
            ? <Component {...props} {...rest}/>
          : <Redirect to={{ pathname: "/", state: { from: props.location }}} />  }
        />
      )
};
  
export default PrivateRoute;