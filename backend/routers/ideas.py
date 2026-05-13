# # backend/routers/ideas.py
# from fastapi import APIRouter
# from fastapi.responses import StreamingResponse
# from core.grok import generate_idea_stream

# router = APIRouter()

# @router.get("/api")
# async def generate_idea():
#     """Public endpoint: Streams business ideas via SSE (auth disabled for testing)"""
    
#     async def event_generator():
#         try:
#             # Send initial message
#             yield "  Generating your idea...\n\n"
            
#             prompt = "You are a creative business strategist. Generate ONE innovative, actionable business idea for the AI agent economy. Format in markdown with headings, bullets, and bold. Keep it under 300 words."
            
#             async for chunk in generate_idea_stream(prompt):
#                 #  Proper SSE format: " " prefix + double newline
#                 safe_chunk = chunk.replace("\n", "\\n").replace("data:", "")
#                 yield f" {safe_chunk}\n\n"
                
#         except Exception as e:
#             #  Yield errors INSIDE the stream (not as HTTP exceptions)
#             print(f" STREAM ERROR: {e}")
#             yield f"  Error: {str(e)}\n\n"
    
#     return StreamingResponse(
#         event_generator(),
#         media_type="text/event-stream",  #  CRITICAL: This tells browser it's SSE
#         headers={
#             "Cache-Control": "no-cache",
#             "Connection": "keep-alive",
#             "X-Accel-Buffering": "no",  # Disable Nginx buffering
#         }
#     )


# backend/routers/ideas.py
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from core.grok import generate_idea_stream

router = APIRouter()

@router.get("/api")
async def generate_idea():
    """Streams business ideas via SSE"""

    async def event_generator():
        try:
            # Initial message (SSE format MUST include data:)
            yield f"data: 🚀 Generating your idea...\n\n"

            prompt = (
                 "You are a creative business strategist. "
                 "Generate ONE innovative, actionable business idea for the AI agent economy. "
                 "Format in markdown with headings, bullets, and bold. "
                 "Keep it under 300 words."
 
            )

            # Stream AI response
            async for chunk in generate_idea_stream(prompt):
                safe_chunk = (
                    chunk.replace("\n", "\\n")
                         .replace("data:", "")
                )
                yield f"data: {safe_chunk}\n\n"

        except Exception as e:
            print(f"STREAM ERROR: {e}")
            yield f"data:  Error: {str(e)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )