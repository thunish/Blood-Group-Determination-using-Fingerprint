from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import cv2
from tensorflow.keras.preprocessing.image import load_img, save_img, img_to_array
from tensorflow import keras
import uuid
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
model = tf.keras.models.load_model("./model/model.h5")

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocessing(file_path):
    img=load_img(file_path, target_size=(64, 64))
    img=tf.image.rgb_to_grayscale(img)
    img_array=keras.preprocessing.image.img_to_array(img)
    img_array = img_array / 255.0
    img_array=np.expand_dims(img_array, axis=0)
    return img_array

class_names = ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-']

@app.route('/predict', methods=["POST"])
def predict():
    if 'file' not in request.files: 
        return jsonify({
            "msg":"File not found"
        }), 401
    file=request.files['file']
    if file.filename == '':
        return jsonify({
            "msg":"No file selected"
        }), 402
    if file and not allowed_file(file.filename):
        return jsonify({
            "msg":"Invalid file type. Allowed file type are .png, .jpg, .bmp, .jpeg"
        }), 410
    filename=str(uuid.uuid4())+"_"+str(secure_filename(file.filename))
    file_path=os.path.join("./uploads", str(filename))
    file.save(file_path)
    try:
        img=preprocessing(file_path)

        predictions=model.predict(img)
        predicted_class=int(np.argmax(predictions[0]))
        predicted_label=class_names[predicted_class]
        confidence=float(np.argmax(predictions[0]))

        return jsonify({
            "msg":"The blood group prediction is successfull",
            "predicted_class": predicted_class,
            "predicted_label": predicted_label,
            "confidence": confidence
        }), 200

    except Exception as e:
        return jsonify({
            "msg":"There is some internla error",
            "error":str(e)
        }), 500
    
if __name__=='__main__':
    print("The server is live on port 3000")
    app.run(debug=False, host='0.0.0.0', port=3000)