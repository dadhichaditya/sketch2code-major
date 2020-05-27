import React, { Component } from 'react';
import Holder from 'react-holder-component';

export default class DropdownElement extends Component {
    render() {
        return (
            <Holder
                width={this.props.styleObject.width}
                height={this.props.styleObject.height}
                style={{position: "absolute",
                top: this.props.styleObject.top,
                left: this.props.styleObject.left,
                width: this.props.styleObject.width,
                height: this.props.styleObject.height, 
                zIndex: this.props.styleObject.zIndex}}
            />
        )
    }
};