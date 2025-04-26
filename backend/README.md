# API

## Installation

```bash
pip install -r requirements.txt
```

Or just install flask cause we should have all the other dependencies already installed:

```bash
pip install flask flask-cors
```

## Running the server

To run server, make sure you are in the backend directory and run:

```bash
python api.py
```

# Model

## Downloading dataset

Make sure you are in the `/backend/model` directory and run:

```bash
curl -L -o data/doodle-dataset.zip\
  https://www.kaggle.com/api/v1/datasets/download/ashishjangra27/doodle-dataset
```

Then unqip the dataset there.