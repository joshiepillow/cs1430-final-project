import tensorflow as tf
import os
import pandas as pd
from PIL import Image
from constants import INPUT_SHAPE
from sklearn.model_selection import train_test_split
import numpy as np
from sklearn.preprocessing import LabelEncoder
import tqdm


class Dataset:
    def __init__(self, dataset_path, imgs_per_class=3000):
        self.dataset_path = dataset_path
        self.imgs_per_class = imgs_per_class
        self.dataset = self._load_dataset()
        self.label_encoder = LabelEncoder()
        self.metadata["word"] = self.label_encoder.fit_transform(self.metadata["word"])
        self.random_translation = tf.keras.layers.RandomTranslation(
            0.1, 0.1, fill_mode="reflect"
        )
        self.random_zoom = tf.keras.layers.RandomZoom(0.1, 0.1, fill_mode="reflect")

    def _load_dataset(self):
        csv_path = os.path.join(self.dataset_path, "master_doodle_dataframe.csv")
        self.metadata = pd.read_csv(
            csv_path, usecols=lambda column: column != "drawing"
        )  # dont load the drawing column because it is too large

        if self.imgs_per_class < 3000:
            self.metadata = (
                self.metadata.groupby("word")
                .head(self.imgs_per_class)
                .reset_index(drop=True)
            )

        return self.metadata

    def _load_image(self, img_path):
        full_path = os.path.join(self.dataset_path, img_path)
        img = Image.open(full_path)
        if img is None:
            raise FileNotFoundError(f"Image not found at path: {full_path}")

        img = np.array(img, dtype=np.float32)
        img = img / 255.0
        img = np.expand_dims(img, axis=-1)

        return img

    def _load_images_from_metadata(self, metadata):
        images = []
        for path in tqdm.tqdm(metadata["image_path"], desc="Loading images"):
            path = path.replace("data", "doodle", 1)
            img = self._load_image(path)
            images.append(img)
        return np.array(images, dtype=np.float32)

    # def get_tf_dataset(self, metadata, batch_size=32, shuffle=True, preprocess=True):
    #     images = self._load_images_from_metadata(metadata)
    #     labels = metadata["word"].tolist()

    #     dataset = tf.data.Dataset.from_tensor_slices((images, labels))

    #     def _augment(image, label):
    #         if preprocess:
    #             image = self.preprocess(image)

    #         return image, label

    #     dataset = dataset.map(_augment, num_parallel_calls=tf.data.AUTOTUNE)

    #     if shuffle:
    #         dataset = dataset.shuffle(buffer_size=len(images))

    #     dataset = dataset.batch(batch_size)
    #     dataset = dataset.prefetch(tf.data.AUTOTUNE)

    #     return dataset

    def get_tf_dataset(
        self, metadata, batch_size=32, shuffle=True, cache_path="/tmp/tf_cache"
    ):
        image_paths = metadata["image_path"].tolist()
        labels = metadata["word"].tolist()

        dataset = tf.data.Dataset.from_tensor_slices((image_paths, labels))

        def _load(img_path, label):
            img_path = tf.strings.regex_replace(img_path, "^data", "doodle")
            img_path = tf.strings.join([self.dataset_path, img_path], separator=os.sep)

            img = tf.io.read_file(img_path)
            img = tf.image.decode_png(img, channels=1)
            img = tf.image.convert_image_dtype(img, tf.float32)

            img = tf.image.resize(img, INPUT_SHAPE[:2])

            return img, label

        dataset = dataset.map(_load, num_parallel_calls=tf.data.AUTOTUNE)

        dataset = dataset.cache(cache_path)

        if shuffle:
            dataset = dataset.shuffle(buffer_size=len(image_paths))

        dataset = dataset.map(self._tf_augment, num_parallel_calls=tf.data.AUTOTUNE)

        dataset = dataset.batch(batch_size)
        dataset = dataset.prefetch(tf.data.AUTOTUNE)

        return dataset

    def _tf_augment(self, img, label):
        img = tf.image.random_flip_left_right(img)
        img = tf.image.random_flip_up_down(img)

        img = tf.image.rot90(
            img, k=tf.random.uniform(shape=[], minval=0, maxval=4, dtype=tf.int32)
        )

        img = self.random_translation(img)
        img = self.random_zoom(img)

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

    def get_name_from_label(self, label):
        return self.label_encoder.inverse_transform([label])[0]

    def preprocess(self, img: np.ndarray) -> np.ndarray:
        """
        img: np.ndarray of float32 values in range [0, 1]
        """
        return img
