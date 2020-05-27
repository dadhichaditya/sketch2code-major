import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';

export default class InputBoxElement extends Component {
    render() {
        return (
            <Form.Control style={this.props.styleObject} placeholder="MAJOR PROJECT" />
        )
    }
};
