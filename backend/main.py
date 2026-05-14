# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from routers import ideas
# from webhooks import router as webhook_router

# # ... existing app setup ...
# app.include_router(webhook_router)

# app = FastAPI(title="SaaS Backend")

# # CORS: Allow frontend to call backend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"], #  Change to your Vercel URL in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.include_router(ideas.router)

# @app.get("/health")
# def health_check():
#     return {"status": "ok"}


# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ideas
from webhooks import router as webhook_router

# 1️⃣ Initialize the app FIRST
app = FastAPI(title="SaaS Backend")

# 2️⃣ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  #  Change to your Vercel frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3️⃣ Include routers AFTER the app is created
app.include_router(ideas.router)          # Your AI generation routes
app.include_router(webhook_router)        # Stripe webhook at /stripe-webhook

@app.get("/health")
def health_check():
    return {"status": "ok"}
