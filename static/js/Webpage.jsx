import React, { Component } from 'react';
import ButtonElement from './elements/ButtonElement';
import InputBoxElement from './elements/InputBoxElement';
import DropdownElement from './elements/DropdownElement';
import ImageElement from './elements/ImageElement';
import VideoElement from './elements/VideoElement';
import TextElement from './elements/TextElement';
import DivElement from './elements/DivElement';

class Webpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DOMElements: []
        };
    }

    componentDidMount() {
        const socket = this.props.socket;
        socket.on('output class', (data) => {     
            //console.log(data)
            var jsonData = JSON.parse(data)
            this.setState({DOMElements: jsonData});
        });
    }
    
    render() {
        let elements = [];
        const toDraw = this.state.DOMElements;
        console.log(toDraw);
        for (let i = 0; i < toDraw.length; i++) {
            const elementStyle = {
                position: "absolute",
                top: toDraw[i].y,
                left: toDraw[i].x,
                width: toDraw[i].w,
                height: toDraw[i].h,
                zIndex: toDraw[i].z_index
            }

            if (toDraw[i].type === 'input box') {
                elements.push(<InputBoxElement styleObject={elementStyle} key={toDraw[i].id} />)
            }
            else if (toDraw[i].type === 'video') {
                elements.push(<VideoElement styleObject={elementStyle} key={toDraw[i].id} />)
            }
            else if (toDraw[i].type === 'drop down') {
                elements.push(<DropdownElement styleObject={elementStyle} key={toDraw[i].id} />)
            }
            else if (toDraw[i].type === 'text') {
                elements.push(<TextElement styleObject={elementStyle} key={toDraw[i].id} />)
            }
            else if (toDraw[i].type === 'button') {
                elements.push(<ButtonElement styleObject={elementStyle} key={toDraw[i].id} />)
            }
            else if (toDraw[i].type === 'image') {
                elements.push(<ImageElement styleObject={elementStyle} key={toDraw[i].id} />)
            }
            else if (toDraw[i].type === 'div') {
                elements.push(<DivElement styleObject={elementStyle} key={toDraw[i].id} />)
            }
        }
        return (
            <div id="container">
                {elements}
            </div>
        )
    }
}

export default Webpage;