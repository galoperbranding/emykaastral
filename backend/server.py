from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from backend.emy import EmyAI
import sqlite3
from typing import List, Optional
from datetime import datetime

app = FastAPI(title="Emyka Astral API", description="API para IA y CRM", version="1.0.0")

# --- DATABASE SETUP ---
DB_NAME = "emyka_crm.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            birth_date TEXT,
            birth_place TEXT,
            birth_time TEXT,
            service_type TEXT,
            email TEXT,
            phone TEXT,
            status TEXT DEFAULT 'pending',
            created_at TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# --- MODELS ---
class OrderCreate(BaseModel):
    full_name: str
    birth_date: str
    birth_place: str
    birth_time: str
    service_type: str
    email: str
    phone: str

class Order(OrderCreate):
    id: int
    status: str
    created_at: str

class ChatRequest(BaseModel):
    message: str
    user_id: str = "anonymous"

class ChatResponse(BaseModel):
    response: str
    sender: str = "Emy"

class OrderStatusUpdate(BaseModel):
    status: str

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instancia de la IA
emy_brain = EmyAI()

# --- ENDPOINTS ---

@app.get("/")
def read_root():
    return {"message": "Emyka Astral API (IA + CRM) Running ✨"}

# Chat Endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, tone: str = "default"):
    # Validación y sanitización de entrada
    user_message = request.message.strip()
    if not user_message or len(user_message) < 2:
        return ChatResponse(response="Por favor, escribe una pregunta o mensaje más claro para que pueda ayudarte.")
    if len(user_message) > 500:
        return ChatResponse(response="Tu mensaje es demasiado largo. ¿Podrías resumirlo?")
    # Opcional: filtrar caracteres peligrosos
    dangerous_patterns = ["<script>", "</script>", "SELECT ", "INSERT ", "DELETE ", "UPDATE ", "DROP ", "--", "/*", "*/", "<iframe", "onerror=", "onload="]
    lowered = user_message.lower()
    if any(pat.lower() in lowered for pat in dangerous_patterns):
        return ChatResponse(response="Tu mensaje contiene caracteres no permitidos. Por favor, intenta de nuevo con una pregunta válida.")
    try:
        response_text = emy_brain.process_message(user_message, getattr(request, 'user_id', 'anonymous'), tone)
        return ChatResponse(response=response_text)
    except Exception:
        # Respuesta empática personalizada en caso de error
        fallback_error = (
            "Lo siento, mi conexión con las estrellas es débil en este momento. ✨ "
            "No puedo responderte ahora, pero puedes intentar de nuevo en unos minutos o contactarnos para recibir tu Manual Personal."
        )
        return ChatResponse(response=fallback_error)

# CRM Endpoints
@app.post("/api/orders", response_model=Order)
def create_order(order: OrderCreate):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    created_at = datetime.now().isoformat()
    
    cursor.execute('''
        INSERT INTO orders (full_name, birth_date, birth_place, birth_time, service_type, email, phone, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)
    ''', (order.full_name, order.birth_date, order.birth_place, order.birth_time, order.service_type, order.email, order.phone, created_at))
    
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return Order(id=new_id, status='pending', created_at=created_at, **order.dict())

@app.get("/api/orders", response_model=List[Order])
def get_orders():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM orders ORDER BY id DESC')
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

@app.put("/api/orders/{order_id}/status")
def update_order_status(order_id: int, status_update: OrderStatusUpdate):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('UPDATE orders SET status = ? WHERE id = ?', (status_update.status, order_id))
    conn.commit()
    conn.close()
    return {"message": "Status updated"}

if __name__ == "__main__":
    import uvicorn
    # Ejecutar en puerto 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
