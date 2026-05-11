import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Clerk
    CLERK_JWKS_URL: str = os.getenv("CLERK_JWKS_URL", "")
    
    # Groq AI (Free Tier) - Using your gsk_ key
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_BASE_URL: str = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    
    # Optional: Keep xAI/Grok vars for later (commented out)
    # XAI_API_KEY: str = os.getenv("XAI_API_KEY", "")
    # XAI_BASE_URL: str = os.getenv("XAI_BASE_URL", "https://api.x.ai/v1")
    # XAI_MODEL: str = os.getenv("XAI_MODEL", "grok-2-latest")

settings = Settings()