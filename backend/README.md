# API

## Installation

```bash
pip install -r requirements.txt
```

Or just:

```bash
pip install flask flask-cors pandas
```

## Running the server

To run server, make sure you are in the backend directory and run:

```bash
python api.py
```

# Model

## Downloading dataset

Make sure you are in the `/backend/model` directory and run the command to download the dataset:

```bash
curl -L -o data/doodle-dataset.zip\
  https://www.kaggle.com/api/v1/datasets/download/ashishjangra27/doodle-dataset
```

Then unzip the dataset there.

Linux/Mac:

```bash
unzip -q data/doodle-dataset.zip -d data/
```

Then you can delete the zip file:

```bash
rm data/doodle-dataset.zip
```

## Training the model

In the `/backend/model` directory, run the following command to see what args there are:

```bash
python3 main.py -h
```


Notes:

- Created api
- Created main running file for easy training
- Created model.py for model creation
- Created dataset.py for dataset creation
- Set up entire training pipeline

- Reached big technical cahllenge of dataset being way too large to fit in memory
  - Need to do on-the-fly data generation
  - Currently trying to do on-the-fly loading + caching of raw images in tmp