from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ideas

app = FastAPI(title="SaaS Backend")

# CORS: Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 🔒 Change to your Vercel URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ideas.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
