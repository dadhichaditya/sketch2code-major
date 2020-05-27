from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, emit
import base64
import detect_objects as od

app = Flask(__name__, static_folder="static/dist", template_folder="static")
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on('canvas frame')
def receiveFrame(data):
    #review the slicing of string
    base64String = bytes(data[22:], encoding='utf-8')
    with open("image.png", "wb") as fh:
        fh.write(base64.decodebytes(base64String))    
    # predict output class from received frame
    # and send corresponding data back to client

    #add true parameter for showing boxes on window
    response = od.detect_objects_from_image("image.png")
    print(response)
    emit('output class', response, broadcast=True, include_self=False)

@socketio.on('connect')
def test_connect():
    emit('my_response', {'data': 'Connected'})

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

if __name__ == "__main__":
    socketio.run(app, debug=True)