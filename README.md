# Worldbuilding Program

This is a worldbuilding application that allows users to create and manage their own fictional universes. Users can add and edit characters, items, locations, and events, all of which are stored in an easily editable JSON file.

## Features

- Add and manage **characters**, **items**, **locations**, and **events**.
- Data is stored in a simple, human-readable JSON format.
- Backend powered by **FastAPI** and **Uvicorn** for high performance.
- Frontend styled with **Tailwind CSS** for a modern and responsive design.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/worldbuilding-program.git
    cd worldbuilding-program
    ```

2. Install backend dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3. Install frontend dependencies:
    ```bash
    npm install
    ```

## Usage

1. Start the backend server:
    ```bash
     uvicorn main:app --reload --host 127.0.0.1 --port 8000
    ```

2. Start the frontend development server:
    ```bash
    npm run dev
    ```

3. Open your browser and navigate to `http://localhost:3000` to start building your world.

## JSON Structure

The program uses a JSON file to store data. Below is an example structure:

```json
{
  "characters": [],
  "items": [],
  "locations": [],
  "events": []
}
```

## Technologies Used

- **Backend**: FastAPI, Uvicorn
- **Frontend**: Tailwind CSS
- **Data Storage**: JSON

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).