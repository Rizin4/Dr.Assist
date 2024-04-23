
# Rasa Chatbot Project

This project utilizes Rasa, an open-source conversational AI framework, to build and deploy a chatbot.

## Setup Instructions

### Python Version

Ensure you have Python 3.10 installed, as Rasa currently supports up to Python 3.10.

### Create Virtual Environment

```bash
python3.10 -m venv rasa_venv
```

### Activate Virtual Environment

- **Windows**:

  ```bash
  .\rasa_venv\Scripts\activate
  ```

- **Unix/MacOS/Linux**:

  ```bash
  source rasa_venv/bin/activate
  ```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Train Chatbot Model

```bash
rasa train
```

### Start Action Server

Activate the virtual environment for the action server and navigate to your chatbot directory:

```bash
rasa run actions
```

### Run Rasa Server

```bash
rasa run --enable-api --cors "*" --jwt-secret "SECRET_KEY" --debug
```
Replace SECRET_KEY with your own key

### Install Redis

Install Redis for persistent tracker store and lock store.

### Configuration

- **Set Redis Credentials**: Update `endpoints.yml` with your Redis username and password.
- **Set JWT Key**: Update jwt_key and jwt_method in under the sockeio channel in `credentials.yml` with your key and required algorithm.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
