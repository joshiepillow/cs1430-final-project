import tensorflow as tf
from constants import INPUT_SHAPE, OUTPUT_CLASSES
from tensorflow.keras.layers import InputLayer, Conv2D, MaxPooling2D, Flatten, Dense


def createModel():
    model = tf.keras.Sequential(
        [
            InputLayer(shape=INPUT_SHAPE),
            Conv2D(32, (3, 3), activation="relu"),
            MaxPooling2D((2, 2)),
            Conv2D(64, (3, 3), activation="relu"),
            MaxPooling2D((2, 2)),
            Conv2D(64, (3, 3), activation="relu"),
            MaxPooling2D((2, 2)),
            Flatten(),
            Dense(512, activation="relu"),
            Dense(OUTPUT_CLASSES, activation="softmax"),
        ]
    )

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss="sparse_categorical_crossentropy",
        metrics=["sparse_categorical_accuracy"],
    )

    model.summary()

    return model
