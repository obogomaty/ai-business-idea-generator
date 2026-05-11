import os
from openai import AsyncOpenAI
from core.config import settings  # ← Import settings

# Initialize Groq client
groq_client = AsyncOpenAI(
    api_key=settings.GROQ_API_KEY,  # ← Use settings.GROQ_API_KEY
    base_url=settings.GROQ_BASE_URL  # ← Use settings.GROQ_BASE_URL
)

async def generate_idea_stream(prompt: str):
    """Stream business ideas using Groq (Free Tier)"""
    model = settings.GROQ_MODEL  # ← Use settings.GROQ_MODEL
    
    stream = await groq_client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        stream=True,
        max_tokens=500,
        temperature=0.7
    )
    
    async for chunk in stream:
        if chunk.choices and chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content