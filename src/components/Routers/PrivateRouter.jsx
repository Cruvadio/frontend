import {Redirect, Route, withRouter} from "react-router-dom";
import React from "react";
import {connect} from "react-redux";
import {compose} from "redux";

function PrivateRoute({ children, isAuthenticate, ...rest }) {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                isAuthenticate ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}

let mapStateToProps = state => ({
    isAuthenticate: state.auth.isAuthenticate,
})

export default compose(connect(mapStateToProps), withRouter)(PrivateRoute);