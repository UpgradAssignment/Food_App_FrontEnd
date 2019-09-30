import React, { Component } from 'react';
import Header from '../../common/Header/Header';

class Profile extends Component {
    render() {
        return (
        <div>
            <Header baseUrl={this.props.baseUrl} searchChangeHandler={this.applyFilter}/>
            This is Profile Page
        </div>
        )
    }
}

export default Profile;