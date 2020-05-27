import React, { Component } from 'react';

export default class TextElement extends Component {
    render() {
        let text;
        if(this.props.styleObject.width < 100) {
            text = "Text";
        } else if(this.props.styleObject.width < 150) {
            text = "lorem ipsum";
        } else {
            text = "lorem ipsum dolor sit";
        }

        return (
            <div style={this.props.styleObject}>
                {text}
            </div>
        )
    }
};