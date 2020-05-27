import cv2
import numpy as np
import json
import os
import tensorflow.compat.v1 as tf
tf.disable_v2_behavior()
import time
import math

imageBox = []
dropDown = []
div = []
inputBox = []
video = []
text = []
button = []
modResponse = []
aux = []

path_ckpt = os.path.join(os.getcwd(), "frozen_inference_graph_ssd_0.33.pb")

detection_graph = tf.Graph()
with detection_graph.as_default():
    od_graph_def = tf.GraphDef()
    with tf.gfile.GFile(path_ckpt, 'rb') as fid:
        serialized_graph = fid.read()
        od_graph_def.ParseFromString(serialized_graph)
        tf.import_graph_def(od_graph_def, name='')

    sess = tf.Session(graph=detection_graph)

#warmup the model
detection_boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
detection_scores = detection_graph.get_tensor_by_name('detection_scores:0')
detection_classes = detection_graph.get_tensor_by_name('detection_classes:0')
num_detections = detection_graph.get_tensor_by_name('num_detections:0')
image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')

image = np.zeros([300, 300, 3], dtype=int)
image_expanded = np.expand_dims(image, axis=0)
start_time = time.time()
(boxes, scores, classes, num) = sess.run(
[detection_boxes, detection_scores, detection_classes, num_detections],
feed_dict={image_tensor: image_expanded})
print(time.time()-start_time)

def get_bounding_contour(id, boundingBox):
    x, y, w, h = boundingBox[id]
    bbx, bbz = 0, -1

    for i, cont in enumerate(boundingBox):
            if id != i:
                if (x > boundingBox[i][0] and y > boundingBox[i][1] and x+w < boundingBox[i][0] + boundingBox[i][2] and
                y+h < boundingBox[i][1] + boundingBox[i][3] and bbx < boundingBox[i][0]):
                    bbx = boundingBox[i][0]
                    bbz = i

    return bbz

def find_contours(contours, hierarchy):
    required = []
    boundingBox = []

    for i, cnt in enumerate(contours):
        if hierarchy[0,i,3] == -1 and cv2.contourArea(cnt) > 50:
            required.append(cnt)
            x,y,w,h = cv2.boundingRect(cnt)
            boundingBox.append([x, y, w, h]) 

    return required, boundingBox

def classify_contours(required, boundingBox):
    noOfElements = [0] * len(required)
    hasText = [False] * len(required)
    isClassified = [False] * len(required)
    button_text = {}
    for i, cnt in enumerate(required):
        if not isClassified[i]:
            approx = cv2.approxPolyDP(cnt, 0.04*cv2.arcLength(cnt, True), True)
            boundingContour = get_bounding_contour(i, boundingBox)

            if (len(approx) == 2):
                text.append(i)
                isClassified[i] = True

                if (boundingContour != -1):
                    noOfElements[boundingContour] += 1
                    button_text[boundingContour] = i
                    hasText[boundingContour] = True
            
            elif (len(approx)==3):
                typeOfTriangle = 0
                approxCoords = approx.ravel()
                isClassified[i] = True
                isClassified[boundingContour] = True

                if (abs(approxCoords[0] - approxCoords[2]) < 10 or abs(approxCoords[2] - approxCoords[4]) < 10 or 
                abs(approxCoords[4] - approxCoords[0]) < 10):
                    typeOfTriangle = 1
                
                if (typeOfTriangle == 1):
                    video.append(boundingContour)
                    bBoundingContour = get_bounding_contour(boundingContour, boundingBox)
                    
                    if (bBoundingContour != -1):
                        noOfElements[bBoundingContour] += 1
                
                else:
                    dropDown.append(boundingContour)
                    bBoundingContour = get_bounding_contour(boundingContour, boundingBox)
                    
                    if (bBoundingContour != -1):
                        noOfElements[bBoundingContour] += 1
            
            else:
                if (boundingContour != -1):
                    noOfElements[boundingContour] += 1


    for i in range(len(required)):
        if not isClassified[i]:
            isClassified[i] = True
            
            if noOfElements[i] > 1:
                div.append(i)
            
            elif noOfElements[i] == 1:
                if (hasText[i] == True):
                    button.append(i)
                    text.remove(button_text[button[-1]])
                else:
                    div.append(i)
        
            elif noOfElements[i] == 0:
                inputBox.append(i)

def show_classes_in_window(img, response):
    color = [ (173, 13, 106), (0, 255, 0), (255, 0, 0), (0, 255, 255), (0, 165, 255), (0, 0, 255) ]

    cv2.putText(img, "drop down", (20, 30), cv2.FONT_HERSHEY_PLAIN, 2.0, color[0])
    cv2.putText(img, "div", (240, 30), cv2.FONT_HERSHEY_PLAIN, 2.0, color[1])
    cv2.putText(img, "input box", (350, 30), cv2.FONT_HERSHEY_PLAIN, 2.0, color[2])
    cv2.putText(img, "video", (530, 30), cv2.FONT_HERSHEY_PLAIN, 2.0, color[3])
    cv2.putText(img, "text", (620, 30), cv2.FONT_HERSHEY_PLAIN, 2.0, color[4])
    cv2.putText(img, "button", (770, 30), cv2.FONT_HERSHEY_PLAIN, 2.0, color[5])
    for i in range(len(response)-1):
        for j in range(len(response[i])):
            x, y, w, h = response[len(response)-1][response[i][j]]
            cv2.rectangle(img, (x,y),(x+w,y+h), color[i], 3)

    cv2.imshow('img',img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def modify_response(response, z_index):
    types = ['drop down', 'div', 'input box', 'video', 'text', 'button']

    for i in range(len(modResponse)):
        modResponse[i]['z_index'] = z_index[modResponse[i]['id']]
    for i in range(len(response)-1):
        for j in range(len(response[i])):
            x, y, w, h = response[len(response)-1][response[i][j]]
            data = {}
            data['id'] = response[i][j]
            data['type'] = types[i]
            data['x'] = x
            data['y'] = y
            data['w'] = w
            data['h'] = h
            data['z_index'] = z_index[response[i][j]]
            modResponse.append(data)

def calculate_iou(x1l, y1l, w, h, box):
    x1r = w + x1l
    y1r = h + y1l
    x2l, y2l, we, he = box
    x2r = we + x2l
    y2r = he + y2l

    x1i = max(x1l, x2l)
    y1i = max(y1l, y2l)
    x2i = min(x1r, x2r)
    y2i = min(y1r, y2r)
    wi = (x2i-x1i)
    hi = (y2i-y1i)
    interArea = max(wi, 0)*max(hi, 0)

    b1Area = w*h
    b2Area = we*he
    unionArea = b1Area+b2Area-interArea

    iou = interArea/unionArea
    return iou

def delete_redundant(x, y, w, h, response):
    maxIOU = 0
    z = -1
    types = -1
    index = -1
    box = []

    for i in range(len(inputBox)):
        iou = calculate_iou(x, y, w, h, response[6][inputBox[i]])
        if (maxIOU < iou):
            types = 2
            z = i
            index = inputBox[i]
            maxIOU = iou
            box = response[6][inputBox[i]]
    for i in range(len(div)):
        iou = calculate_iou(x, y, w, h, response[6][div[i]])
        if (maxIOU < iou):
            types = 1
            z = i
            index = div[i]
            maxIOU = iou
            box = response[6][div[i]]
    for i in range(len(button)):
        iou = calculate_iou(x, y, w, h, response[6][button[i]])
        if (maxIOU < iou):
            types = 5
            index = button[i]
            z = i
            maxIOU = iou
            box = response[6][button[i]]
    del response[types][z]
    return box, index

def object_detect(image, response):
    image_expanded = np.expand_dims(image, axis=0)
    
    detection_boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
    detection_scores = detection_graph.get_tensor_by_name('detection_scores:0')
    detection_classes = detection_graph.get_tensor_by_name('detection_classes:0')
    num_detections = detection_graph.get_tensor_by_name('num_detections:0')
    image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')

    start_time = time.time()
    (boxes, scores, classes, num) = sess.run(
    [detection_boxes, detection_scores, detection_classes, num_detections],
    feed_dict={image_tensor: image_expanded})
    print(time.time()-start_time)
    print ("The fps is ", 1/(time.time()-start_time))
    print("")

    scores = np.squeeze(scores, axis=0)
    scores = scores[scores > 0.75]
    boxes = np.squeeze(boxes, axis=0)
    boxes = boxes[0:len(scores), :]
    height, width, channels = image.shape 
    
    for i in range(len(scores)):
        x = boxes[i][1] * width
        y = boxes[i][0] * height
        w = (boxes[i][3] - boxes[i][1]) * width
        h = (boxes[i][2] - boxes[i][0]) * height

        box, index = delete_redundant(x, y, w, h, response)
        auxList = []
        auxList.append(index)
        auxList.append(math.floor(box[2]) * math.floor(box[3]))
        aux.append(auxList)
        
        data = {}
        data['id'] = index
        data['type'] = 'image'
        data['x'] = math.floor(box[0])
        data['y'] = math.floor(box[1])
        data['w'] = math.floor(box[2])
        data['h'] = math.floor(box[3])

        modResponse.append(data)

def create_aux_list(response):
    for i in range(len(response)-1):
        for j in range(len(response[i])):
            auxList = []
            auxList.append(response[i][j])
            w = response[len(response)-1][response[i][j]][2]
            h = response[len(response)-1][response[i][j]][3]
            auxList.append(w*h)
            aux.append(auxList)

def compute_z_index(boundingBox):
    z_index = {}
    for i in range(len(aux)):
        box = get_bounding_contour(aux[i][0], boundingBox)
        if (box == -1):
            z_index[aux[i][0]] = 1
        else:
            z_index[aux[i][0]] = z_index[box] + 1
    
    return z_index

def detect_objects_from_image(imagePath, debug = False):

    imageBox.clear()
    dropDown.clear()
    div.clear()
    inputBox.clear()
    video.clear()
    text.clear()
    button.clear()
    modResponse.clear()
    aux.clear()

    img = cv2.imread(imagePath)
    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    ret,thresh = cv2.threshold(gray,50,255,1)
    dilate = cv2.dilate(thresh,None)
    erode = cv2.erode(dilate,None)


    contours,hierarchy = cv2.findContours(erode,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_SIMPLE)
    
    requiredContours, contoursBB = find_contours(contours, hierarchy)

    classify_contours(requiredContours, contoursBB)

    response = []
    response.append(dropDown)
    response.append(div)
    response.append(inputBox)
    response.append(video)
    response.append(text)
    response.append(button)
    response.append(contoursBB)

    object_detect(img, response)
    create_aux_list(response)
    aux.sort(key=lambda x: x[1], reverse=True)
    z_index = compute_z_index(contoursBB)
    modify_response(response, z_index)

    jsonResponse = json.dumps(modResponse)

    if debug:
        show_classes_in_window(img, response)

    return jsonResponse
