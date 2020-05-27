import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

export default class DropdownElement extends Component {
    render() {
        return (
            <Dropdown>
                <Dropdown.Toggle variant="info" id="dropdown-basic" style={this.props.styleObject}>
                    Dropdown
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="">Chintu</Dropdown.Item>
                    <Dropdown.Item href="">Tanishq</Dropdown.Item>
                    <Dropdown.Item href="">Mangu</Dropdown.Item>
                    <Dropdown.Item href="">Pragun</Dropdown.Item>
                    <Dropdown.Item href="">Nikhat</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    }
};
