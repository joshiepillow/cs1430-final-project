from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)  # Enable CORS


@app.route("/process-image", methods=["POST"])
def process_image():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    imageFile = request.files["image"]

    try:
        image = Image.open(imageFile)

        width, height = image.size
        res = {"width": width, "height": height, "format": image.format}

        return jsonify(res), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()
