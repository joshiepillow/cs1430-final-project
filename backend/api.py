from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from model import modelV1
from model.constants import IMAGE_SIZE
from model.classLabels import INDEX_TO_LABELS
import numpy as np
import os

app = Flask(__name__)
CORS(app)

MODELS_AND_WEIGHTS = [
    ["easy", modelV1.createModel, "model_v1_1.45.weights.h5"],
]


def loadModels():
    models = {}
    for model_name, model_func, weights_path in MODELS_AND_WEIGHTS:
        model = model_func(compile_model=False)
        model.load_weights(os.path.join("model", weights_path))
        models[model_name] = model
    return models


models = loadModels()


@app.route("/process-image", methods=["POST"])
def process_image():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files["image"]

    try:
        image = Image.open(image_file)
        image = image.convert("RGBA")
        white_background = Image.new("RGBA", image.size, "WHITE")
        image = Image.alpha_composite(white_background, image).convert("L")
        image = image.resize(IMAGE_SIZE)
        np_image = np.array(image, dtype=np.float32)
        np_image = np.expand_dims(np_image, axis=-1)
        np_image = np.expand_dims(np_image, axis=0)

        predictions = {}
        for i, val in enumerate(models["easy"](np_image, training=False)[0]):
            predictions[INDEX_TO_LABELS[i]] = float(val)
        # predictions = dict(
        #     sorted(predictions.items(), key=lambda item: item[1], reverse=True)
        # )
        # print("top 5 predictions:")
        # for i, (key, value) in enumerate(predictions.items()):
        #     if i < 5:
        #         print(f"{key}: {value}")
        #     else:
        #         break

        return jsonify(predictions), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()
