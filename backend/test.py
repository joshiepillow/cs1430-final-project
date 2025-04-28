from PIL import Image

from model import constants, modelV1
import numpy as np
import os

MODELS_AND_WEIGHTS = [
    ["easy", modelV1.createModel, "model_v1_1.45.weights.h5"],
]


def loadModels():
    models = {}
    for model_name, model_func, weights_path in MODELS_AND_WEIGHTS:
        model = model_func(compile_model=False)
        model.load_weights(os.path.join("model", weights_path))
        model.trainable = False
        models[model_name] = model
    return models


models = loadModels()
image = Image.open("temp.png")
np_array = np.array(image, dtype=np.float32)
image = np.expand_dims(np_array, axis=-1)
image = np.expand_dims(image, axis=0)

prediction = models["easy"](image, training=False)[0]
print(prediction)

real = Image.open("model/data/doodle/guitar/4505824867123200.png")
real = real.resize(constants.IMAGE_SIZE)
real = np.array(real, dtype=np.float32)
real = np.expand_dims(real, axis=-1)
real = np.expand_dims(real, axis=0)

pred = models["easy"](real, training=False)[0]
print(pred)

import tensorflow as tf

tf_real = tf.io.read_file("model/data/doodle/guitar/4505824867123200.png")
tf_real = tf.image.decode_png(tf_real, channels=1)
tf_real = tf.image.resize(tf_real, constants.IMAGE_SIZE)
tf_real = tf.image.convert_image_dtype(tf_real, tf.float32)
tf_real.set_shape(constants.INPUT_SHAPE)

tf_real = tf.expand_dims(tf_real, axis=0)

tf_pred = models["easy"](tf_real, training=False)[0]
print(tf_pred)
