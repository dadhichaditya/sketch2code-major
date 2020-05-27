import React, { Component } from 'react';


class DivElement extends Component {
    render() { 
        return ( 
        <div 
        style={{
            position: "absolute",
            top: this.props.styleObject.top,
            left: this.props.styleObject.left,
            width: this.props.styleObject.width,
            height: this.props.styleObject.height, 
            zIndex: this.props.styleObject.zIndex,
            backgroundColor: "#E0E0E0",
            borderRadius: "10px"
        }}
        >
        </div> 
    );
    }
}
 
export default DivElement;