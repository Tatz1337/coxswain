from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json
import os
import shutil
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to restrict origins if needed
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

DATA_PATH = "data/my_world.json"

class Character(BaseModel):
    name: str
    race: str
    affiliation: str
    description: str
    age: int
    title: str
    alignment: str
    image_url: str = None  # Optional field for the image URL

class Item(BaseModel):
    name: str
    type: str
    rarity: str
    description: str

class Location(BaseModel):
    name: str
    region: str
    description: str
    danger_level: str

class Event(BaseModel):  # Step 1: Add Event model
    name: str
    date: str
    location: str
    description: str

def load_world():
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH, "r") as f:
            return json.load(f)
    else:
        # Step 2: Include "Events" in the default data structure
        return {"Characters": [], "Items": [], "Locations": [], "Events": []}

def save_world(data):
    with open(DATA_PATH, "w") as f:
        json.dump(data, f, indent=4)

@app.get("/")
def serve_index():
    return FileResponse("static/index.html")

@app.get("/characters")
def get_characters():
    data = load_world()
    return data["Characters"]

@app.post("/characters")
def add_character(character: dict):
    data = load_world()
    if not character.get("name"):
        raise HTTPException(status_code=400, detail="Character name is required.")
    if not character.get("image_url"):
        character["image_url"] = "/uploads/placeholder_char.png"  # Default image

    data["Characters"].append(character)
    save_world(data)
    return {"message": "Character added successfully!"}

@app.put("/character/{name}")
def update_character(name: str, updated_data: dict):
    data = load_world()
    character = next((c for c in data["Characters"] if c["name"] == name), None)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    # Update the character's fields
    for key, value in updated_data.items():
        if key in character:
            character[key] = value

    save_world(data)
    return {"message": f"Character '{name}' updated successfully!"}

@app.delete("/character/{name}")
def delete_character(name: str):
    data = load_world()
    character = next((c for c in data["Characters"] if c["name"] == name), None)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    data["Characters"].remove(character)
    save_world(data)
    return {"message": f"Character '{name}' deleted successfully!"}

@app.get("/items")
def get_items():
    data = load_world()
    return data["Items"]

@app.post("/items")
def add_item(item: Item):
    data = load_world()
    data["Items"].append(item.dict())
    save_world(data)
    return {"message": "Item added!"}

@app.put("/items/{name}")
def update_item(name: str, updated_item: dict):
    data = load_world()
    item = next((i for i in data["Items"] if i["name"] == name), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Update the item's fields
    for key, value in updated_item.items():
        if key in item:
            item[key] = value

    save_world(data)
    return {"message": "Item updated successfully!"}

@app.delete("/items/{name}")
def delete_item(name: str):
    data = load_world()
    item = next((i for i in data["Items"] if i["name"] == name), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    data["Items"].remove(item)
    save_world(data)
    return {"message": f"Item '{name}' deleted successfully!"}

@app.get("/locations")
def get_locations():
    data = load_world()
    return data["Locations"]

@app.post("/locations")
def add_location(location: Location):
    data = load_world()
    data["Locations"].append(location.dict())
    save_world(data)
    return {"message": "Location added!"}

@app.put("/location/{name}")
def update_location(name: str, updated_data: dict):
    data = load_world()
    location = next((l for l in data["Locations"] if l["name"] == name), None)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    # Update the location's fields
    for key, value in updated_data.items():
        if key in location:
            location[key] = value

    save_world(data)
    return {"message": f"Location '{name}' updated successfully!"}

@app.delete("/location/{name}")
def delete_location(name: str):
    data = load_world()
    location = next((l for l in data["Locations"] if l["name"] == name), None)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    data["Locations"].remove(location)
    save_world(data)
    return {"message": f"Location '{name}' deleted successfully!"}

@app.get("/events")  # Step 3: Add GET endpoint for events
def get_events():
    data = load_world()
    return data["Events"]

@app.post("/events")  # Step 4: Add POST endpoint for events
def add_event(event: Event):
    data = load_world()
    data["Events"].append(event.dict())
    save_world(data)
    return {"message": "Event added!"}

@app.put("/event/{name}")
def update_event(name: str, updated_data: dict):
    data = load_world()
    event = next((e for e in data["Events"] if e["name"] == name), None)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Update the event's fields
    for key, value in updated_data.items():
        if key in event:
            event[key] = value

    save_world(data)
    return {"message": f"Event '{name}' updated successfully!"}

@app.delete("/event/{name}")
def delete_event(name: str):
    data = load_world()
    event = next((e for e in data["Events"] if e["name"] == name), None)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    data["Events"].remove(event)
    save_world(data)
    return {"message": f"Event '{name}' deleted successfully!"}

@app.get("/stats")
def get_stats():
    data = load_world()
    return {
        "Characters": len(data["Characters"]),
        "Items": len(data["Items"]),
        "Locations": len(data["Locations"]),
        "Events": len(data["Events"])
    }

@app.get("/item/{name}", response_class=HTMLResponse)
def get_item(name: str):
    data = load_world()
    item = next((i for i in data["Items"] if i["name"] == name), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    html_content = f"""
    <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4" data-field="name">{item['name']}</h2>
        <p><strong>Type:</strong> <span data-field="type">{item['type']}</span></p>
        <p><strong>Rarity:</strong> <span data-field="rarity">{item['rarity']}</span></p>
        <p><strong>Description:</strong> <span data-field="description">{item['description']}</span></p>
        <img src="{item.get('image_url', '/uploads/default-image.png')}" alt="{item['name']}" class="mt-4 rounded-lg shadow-lg" style="max-width: 300px;">
    </div>
    """
    return HTMLResponse(content=html_content)

@app.get("/character/{name}", response_class=HTMLResponse)
def get_character(name: str):
    data = load_world()
    character = next((c for c in data["Characters"] if c["name"] == name), None)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    html_content = f"""
    <div>
        <h2 class="text-2xl font-bold mb-4" data-field="name">{character['name']}</h2>
        <p><strong>Title:</strong> <span data-field="title">{character['title']}</span></p>
        <p><strong>Race:</strong> <span data-field="race">{character['race']}</span></p>
        <p><strong>Affiliation:</strong> <span data-field="affiliation">{character['affiliation']}</span></p>
        <p><strong>Alignment:</strong> <span data-field="alignment">{character['alignment']}</span></p>
        <p><strong>Age:</strong> <span data-field="age">{character['age']}</span></p>
        <p><strong>Description:</strong> <span data-field="description">{character['description']}</span></p>
    </div>
    """
    return HTMLResponse(content=html_content)

@app.get("/location/{name}", response_class=HTMLResponse)
def get_location(name: str):
    data = load_world()
    location = next((l for l in data["Locations"] if l["name"] == name), None)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    html_content = f"""
    <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4" data-field="name">{location['name']}</h2>
        <p><strong>Region:</strong> <span data-field="region">{location['region']}</span></p>
        <p><strong>Danger Level:</strong> <span data-field="danger_level">{location['danger_level']}</span></p>
        <p><strong>Description:</strong> <span data-field="description">{location['description']}</span></p>
        <img src="{location.get('image_url', '/uploads/default-image.png')}" alt="{location['name']}" class="mt-4 rounded-lg shadow-lg" style="max-width: 300px;">
    </div>
    """
    return HTMLResponse(content=html_content)

@app.get("/event/{name}", response_class=HTMLResponse)
def get_event(name: str):
    data = load_world()
    event = next((e for e in data["Events"] if e["name"] == name), None)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    html_content = f"""
    <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4" data-field="name">{event['name']}</h2>
        <p><strong>Date:</strong> <span data-field="date">{event['date']}</span></p>
        <p><strong>Location:</strong> <span data-field="location">{event['location']}</span></p>
        <p><strong>Description:</strong> <span data-field="description">{event['description']}</span></p>
        <img src="{event.get('image_url', '/uploads/default-image.png')}" alt="{event['name']}" class="mt-4 rounded-lg shadow-lg" style="max-width: 300px;">
    </div>
    """
    return HTMLResponse(content=html_content)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        print(f"Received file: {file.filename}")  # Log the file name
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        print(f"File saved to: {file_path}")  # Log the save location
        return {"file_url": f"/uploads/{file.filename}"}
    except Exception as e:
        print(f"Error uploading file: {e}")  # Log the error
        return {"error": "Failed to upload file"}, 500

@app.options("/upload")
async def upload_options():
    return {"message": "OPTIONS request successful"}

@app.get("/data/my_world.json")
def get_data_file():
    return FileResponse("data/my_world.json")
