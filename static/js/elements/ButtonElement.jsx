import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

export default class ButtonElement extends Component {
    render() {
        return (
            <Button variant="danger" style={this.props.styleObject}>Button</Button>
        )
    }
};