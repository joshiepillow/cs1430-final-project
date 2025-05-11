import tensorflow as tf
from .constants import INPUT_SHAPE, OUTPUT_CLASSES
from tensorflow.keras.layers import (
    InputLayer,
    Conv2D,
    MaxPooling2D,
    Flatten,
    Dense,
    Dropout,
    BatchNormalization,
)
from tensorflow.keras.regularizers import l2


# best checkpoint checkpoints/model_v3/2025-05-11-09-06-36/epoch_11_0.70.weights.h5
def createModel(compile_model=True):
    model = tf.keras.Sequential(
        [
            InputLayer(shape=INPUT_SHAPE),
            Conv2D(32, (3, 3), activation="relu", kernel_regularizer=l2(1e-4)),
            BatchNormalization(),
            MaxPooling2D((2, 2)),
            Conv2D(64, (3, 3), activation="relu", kernel_regularizer=l2(1e-4)),
            BatchNormalization(),
            MaxPooling2D((2, 2)),
            Conv2D(128, (3, 3), activation="relu", kernel_regularizer=l2(1e-4)),
            BatchNormalization(),
            MaxPooling2D((2, 2)),
            Flatten(),
            Dense(512, activation="relu", kernel_regularizer=l2(1e-4)),
            Dropout(0.2),
            Dense(512, activation="relu", kernel_regularizer=l2(1e-4)),
            Dropout(0.2),
            Dense(OUTPUT_CLASSES, activation="softmax"),
        ]
    )

    if compile_model:
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
            loss="sparse_categorical_crossentropy",
            metrics=["sparse_categorical_accuracy"],
        )

        model.summary()

    return model
