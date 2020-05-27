import React, { Component } from 'react';

export default class VideoElement extends Component {
    render() {
        return (
            <div
                className="video"
                style={{
                    position: "absolute",
                    top: this.props.styleObject.top,
                    left: this.props.styleObject.left,
                    width: this.props.styleObject.width,
                    height: this.props.styleObject.height,
                    zIndex: this.props.styleObject.zIndex
                }}
                >
                <iframe
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%"
                    }}
                    src="https://www.youtube.com/embed/CQ_eDE0OMds"
                    frameBorder="0"
                />
            </div>
        )
    }
};

