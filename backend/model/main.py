import argparse
import os

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
from tensorflow.keras.callbacks import ModelCheckpoint, TensorBoard
import modelV1
from dataset import Dataset
import datetime

MODEL_VERSION_MAP = {
    "v1": modelV1.createModel,
}

DATASET_PATH = "data"
CHECKPOINTS_DIR = "checkpoints"
LOGS_DIR = "logs"


def parse_args():
    parser = argparse.ArgumentParser(description="Train or evaluate the model.")
    parser.add_argument(
        "mode", choices=["train", "evaluate"], help="Mode: train or evaluate"
    )
    parser.add_argument(
        "model_version",
        type=str,
        help="Model version",
        choices=MODEL_VERSION_MAP.keys(),
    )
    parser.add_argument(
        "--checkpoint_path", type=str, help="Path to load model checkpoint"
    )
    parser.add_argument(
        "--imgs-per-class",
        type=int,
        default=25,
        help="Number of images per class to use for training (max 3000)",
    )
    return parser.parse_args()


def main(args):
    model = MODEL_VERSION_MAP[args.model_version]()

    if args.checkpoint_path:
        model.load_weights(args.checkpoint_path)
        print(f"Loaded checkpoint from {args.checkpoint_path}")

    dataset = Dataset(DATASET_PATH, args.imgs_per_class)
    train_data, val_data, test_data = dataset.split_data()

    if args.mode == "train":
        model_info_path = os.path.join(
            f"model_{args.model_version}",
            datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S"),
        )

        checkpoint_dir = os.path.join(CHECKPOINTS_DIR, model_info_path)
        os.makedirs(checkpoint_dir, exist_ok=True)
        log_dir = os.path.join(LOGS_DIR, model_info_path)
        os.makedirs(log_dir, exist_ok=True)
        print(f"Model checkpoints will be saved to {checkpoint_dir}")
        print(f"TensorBoard logs will be saved to {log_dir}")

        print("Loading training and validation datasets...")
        train_tf_dataset = dataset.get_tf_dataset(
            train_data, batch_size=32, shuffle=True  # , preprocess=True
        )
        val_tf_dataset = dataset.get_tf_dataset(
            val_data, batch_size=32, shuffle=False  # , preprocess=True
        )

        checkpoint_callback = ModelCheckpoint(
            filepath=os.path.join(
                CHECKPOINTS_DIR,
                f"model_{args.model_version}_{{epoch:02d}}_{{val_loss:.2f}}.weights.h5",
            ),
            save_best_only=True,
            save_weights_only=True,
            monitor="val_loss",
            mode="min",
            verbose=1,
        )
        tensorboard_callback = TensorBoard(
            log_dir=LOGS_DIR, update_freq="batch", profile_batch=0
        )

        print(f"Training model version {args.model_version}...")
        model.fit(
            train_tf_dataset,
            validation_data=val_tf_dataset,
            epochs=10,
            callbacks=[checkpoint_callback, tensorboard_callback],
        )
    elif args.mode == "evaluate":
        print(f"Evaluating model version {args.model_version}...")
        test_tf_dataset = dataset.get_tf_dataset(
            test_data, batch_size=32, shuffle=False  # , preprocess=False
        )
        # Add evaluation logic here


if __name__ == "__main__":
    main(parse_args())
