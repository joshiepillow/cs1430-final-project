import tensorflow as tf
import os
import pandas as pd
from PIL import Image
from constants import INPUT_SHAPE
from sklearn.model_selection import train_test_split
import numpy as np
from classLabels import LABELS_TO_INDEX
import tqdm
import sys


class Dataset:
    def __init__(self, dataset_path, imgs_per_class=3000):
        self.dataset_path = dataset_path
        self.imgs_per_class = imgs_per_class
        self._load_metadata()

        self.random_translation = tf.keras.layers.RandomTranslation(
            0.1, 0.1, fill_mode="reflect"
        )
        self.random_zoom = tf.keras.layers.RandomZoom(0.1, 0.1, fill_mode="reflect")
        self.didPrint = False

    def _load_metadata(self):
        csv_path = os.path.join(self.dataset_path, "master_doodle_dataframe.csv")
        self.metadata = pd.read_csv(
            csv_path, usecols=lambda column: column == "word" or column == "image_path"
        )

        # drop rows with unused labels
        self.metadata = self.metadata[
            self.metadata["word"].isin(LABELS_TO_INDEX.keys())
        ]

        if self.imgs_per_class < 3000:
            self.metadata = (
                self.metadata.groupby("word")
                .head(self.imgs_per_class)
                .reset_index(drop=True)
            )

        self.metadata["word"] = self.metadata["word"].map(lambda x: LABELS_TO_INDEX[x])

        return self.metadata

    def get_tf_dataset(self, metadata, cache_path, batch_size=32, shuffle=True):
        if shuffle:
            metadata = metadata.sample(frac=1, random_state=42).reset_index(drop=True)

        image_paths = metadata["image_path"].tolist()
        labels = metadata["word"].tolist()

        dataset = tf.data.Dataset.from_tensor_slices((image_paths, labels))

        def _load(img_path, label):
            img_path = tf.strings.regex_replace(img_path, "^data", "doodle")
            img_path = tf.strings.join([self.dataset_path, img_path], separator=os.sep)

            img = tf.io.read_file(img_path)
            img = tf.image.decode_png(img, channels=1)
            img = tf.image.resize(img, INPUT_SHAPE[:2])

            img = tf.image.convert_image_dtype(img, tf.float32)

            return img, label

        dataset = dataset.map(_load, num_parallel_calls=tf.data.AUTOTUNE)

        dataset = dataset.cache(cache_path)

        dataset = dataset.map(self._tf_augment, num_parallel_calls=tf.data.AUTOTUNE)

        dataset = dataset.batch(batch_size)
        dataset = dataset.prefetch(tf.data.AUTOTUNE)

        return dataset

    def _tf_augment(self, img, label):
        # img = tf.image.random_flip_left_right(img)

        # degrees = tf.random.uniform([], minval=-20, maxval=20, dtype=tf.float32)
        # radians = degrees * (tf.constant(3.14159265359) / 180.0)
        # img = tfa.image.rotate(img, radians, fill_mode="reflect")

        # img = self.random_translation(img)
        # img = self.random_zoom(img)

        return img, label

    def split_data(self, test_size=0.1, val_size=0.1):
        train_val_data, test_data = train_test_split(
            self.metadata,
            test_size=test_size,
            random_state=42,
            stratify=self.metadata["word"],
        )
        train_data, val_data = train_test_split(
            train_val_data,
            test_size=val_size / (1 - test_size),
            random_state=42,
            stratify=train_val_data["word"],
        )
        return train_data, val_data, test_data

    def preprocess(self, img: np.ndarray) -> np.ndarray:
        """
        img: np.ndarray of float32 values in range [0, 1]
        """
        return img
