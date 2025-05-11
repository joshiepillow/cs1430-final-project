import tensorflow as tf
from constants import INPUT_SHAPE, OUTPUT_CLASSES
from tensorflow.keras.regularizers import l2
from tensorflow.keras.layers import (
    InputLayer,
    Conv2D,
    MaxPooling2D,
    Flatten,
    Dense,
    Dropout,
    BatchNormalization,
)

def createModel(compile_model=True):
    model = tf.keras.Sequential(
        [
            InputLayer(shape=INPUT_SHAPE),
            Conv2D(32, (3, 3), activation="relu"),
            MaxPooling2D((2, 2)),
            Conv2D(64, (3, 3), activation="relu"),
            BatchNormalization(),
            MaxPooling2D((2, 2)),
            Conv2D(128, (3, 3), activation="relu"),
            MaxPooling2D((2, 2)),
            Flatten(),
            Dense(256, activation="relu", kernel_regularizer=l2(0.01)),
            Dropout(0.3),
            Dense(256, activation="relu"),
            Dropout(0.2),
            Dense(OUTPUT_CLASSES, activation="softmax"),
        ]
    )

    if compile_model:
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=3* 1e-5),
            loss="sparse_categorical_crossentropy",
            metrics=["sparse_categorical_accuracy"],
        )

        model.summary()

    return model
