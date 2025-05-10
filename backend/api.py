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

        augmented_images = [image]
        for angle in [-15, -5, 5, 15]:
            augmented_images.append(
                image.rotate(angle, resample=Image.BICUBIC, fillcolor=255)
            )
        for shift_x in [-25, 25]:
            for shift_y in [-25, 25]:
                augmented_images.append(
                    image.transform(
                        image.size,
                        Image.AFFINE,
                        (1, 0, shift_x, 0, 1, shift_y),
                        resample=Image.BICUBIC,
                        fillcolor=255,
                    )
                )
        for zoom_factor in [0.8, 1.2]:
            zoomed_image = image.resize(
                (
                    int(image.size[0] * zoom_factor),
                    int(image.size[1] * zoom_factor),
                ),
                resample=Image.BICUBIC,
            )
            new_image = Image.new("L", image.size, 255)
            x_offset = (image.size[0] - zoomed_image.size[0]) // 2
            y_offset = (image.size[1] - zoomed_image.size[1]) // 2
            new_image.paste(zoomed_image, (x_offset, y_offset))
            augmented_images.append(new_image)

        augmented_arrays = [
            np.expand_dims(
                np.array(aug_image.resize(IMAGE_SIZE), dtype=np.float32), axis=-1
            )
            for aug_image in augmented_images
        ]

        image_batch = np.stack(augmented_arrays, axis=0)

        batch_predictions = models["easy"](image_batch, training=False)
        predictions = {}
        for single_prediction in batch_predictions:
            for i, val in enumerate(single_prediction):
                label = INDEX_TO_LABELS[i]
                predictions[label] = predictions.get(label, 0) + float(val)

        # output_dir = "api_augment"
        # os.makedirs(output_dir, exist_ok=True)
        # for idx, aug_image in enumerate(augmented_images):
        #     output_path = os.path.join(output_dir, f"augmented_{idx}.png")
        #     aug_image.save(output_path)

        total = sum(predictions.values())
        predictions = {key: val / total for key, val in predictions.items()}

        return jsonify(predictions), 200

    except Exception as e:
        import traceback

        traceback.print_exc()

        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()
