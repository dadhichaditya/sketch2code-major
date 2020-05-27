import React, { Component } from "react";
import { SketchField, Tools } from 'react-sketch';
import { BlockPicker } from 'react-color';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineWidth: 5,
            lineColor: 'black',
            backgroundColor: '#DFDDC7',
            fillWithBackgroundColor: false,
            tool: Tools.Rectangle,
            canUndo: false,
            canRedo: false,
            sketchWidth: "100%",
            sketchHeight: 1000,
            defaultColors: ['#DFDDC7', '#F47373', '#697689', '#37D67A', '#2CCCE4', '#555555', '#dce775', '#ff8a65', '#ba68c8']
        }
        this.canvasRef = React.createRef();
    }

    handleSketchChange(event) {
        // console.log(event);
        if(!event || event.type === "mouseup") {
            let prev = this.state.canUndo;
            let now = this.canvasRef.canUndo();
            if(prev !== now) {
                this.setState({ canUndo: now });
            }
            const socket = this.props.socket;
            let base64 = this.canvasRef.toDataURL();
            socket.emit('canvas frame', base64);
        }
    }
    
    handleUndo() {
        this.canvasRef.undo();
        this.setState({
            canUndo: this.canvasRef.canUndo(),
            canRedo: this.canvasRef.canRedo()
        });
    }

    handleRedo() {
        this.canvasRef.redo();
        this.setState({
            canUndo: this.canvasRef.canUndo(),
            canRedo: this.canvasRef.canRedo()
        });
    }

    clearCanvas() {
        this.canvasRef.clear();
        this.setState({
            backgroundColor: '#DFDDC7',
            fillWithBackgroundColor: false,
            canUndo: this.canvasRef.canUndo(),
            canRedo: this.canvasRef.canRedo()
        });
    }

    selectTool(event) {
        var toolSelected = this.state.tool;
        if(event.target.innerText === "Pencil")
            toolSelected = Tools.Pencil;
        else if(event.target.innerText === "Line")
            toolSelected = Tools.Line;
        else if(event.target.innerText === "Rectangle")
            toolSelected = Tools.Rectangle;
        this.setState({
            tool: toolSelected
        });
    }

    render() {
        return (
            <div style={{ backgroundColor: "#607d8b"}}>
                <Row>
                    <Col>
                        <Navbar bg="dark" variant="dark" expand="lg">
                            <Navbar.Brand href="#home">Sketch To Code</Navbar.Brand>
                        </Navbar>
                    </Col>
                </Row>
                <Row style={{ margin: "auto", marginTop: "20px"}}>
                    <Col xs={12} sm={8} md={8}>
                        <SketchField 
                            name='sketch'
                            lineColor={this.state.lineColor}
                            lineWidth={this.state.lineWidth}
                            backgroundColor={this.state.fillWithBackgroundColor ? this.state.backgroundColor : 'transparent'}
                            width={this.state.sketchWidth}
                            height={this.state.sketchHeight}
                            tool={this.state.tool}
                            onChange={this.handleSketchChange.bind(this)}
                            ref={(ref) => { this.canvasRef = ref }}
                        />
                    </Col>
                    <Col xs={12} sm={4} md={4}>
                        <Card>
                            <ButtonGroup>
                                <Button 
                                    style={{ width: "33.3%" }} 
                                    variant="light" 
                                    onClick={this.handleUndo.bind(this)} 
                                    disabled={!this.state.canUndo}
                                >
                                    Undo
                                </Button>
                                <Button 
                                    style={{ width: "33.3%" }} 
                                    variant="light" 
                                    onClick={this.handleRedo.bind(this)} 
                                    disabled={!this.state.canRedo}
                                >
                                    Redo
                                </Button>
                                <Button 
                                    style={{ width: "33.3%" }} 
                                    variant="light" 
                                    onClick={this.clearCanvas.bind(this)}
                                >
                                    Clear
                                </Button>
                            </ButtonGroup>
                        </Card>
                        <br/>
                        <Accordion defaultActiveKey="1">
                            <Card bg="light">
                                <Accordion.Toggle as={Card.Header} eventKey="0">
                                    <Card.Title>Tools</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Available tools</Card.Subtitle>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <ListGroup variant="flush" style={{ cursor: "pointer" }}>
                                        <ListGroup.Item onClick={this.selectTool.bind(this)}>Pencil</ListGroup.Item>
                                        <ListGroup.Item onClick={this.selectTool.bind(this)}>Line</ListGroup.Item>
                                        <ListGroup.Item onClick={this.selectTool.bind(this)}>Rectangle</ListGroup.Item>
                                    </ListGroup>
                                </Accordion.Collapse>
                            </Card>
                            <br/>
                            <Card bg="light">
                                <Accordion.Toggle as={Card.Header} eventKey="1">
                                    <Card.Title>Background</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Background of drawing</Card.Subtitle>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>
                                        <Form.Check 
                                            type="switch"
                                            id="custom-switch"
                                            label="Background Color"
                                            onChange={() => this.setState({fillWithBackgroundColor : !this.state.fillWithBackgroundColor})}
                                        />
                                        <br/>
                                        <BlockPicker
                                            colors={this.state.defaultColors}
                                            color={this.state.backgroundColor}
                                            onChange={(color) => this.setState({ backgroundColor: color.hex })}
                                        />
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Canvas;
