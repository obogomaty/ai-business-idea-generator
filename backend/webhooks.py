# backend/webhooks.py
import os
import stripe
import httpx
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")

router = APIRouter()

async def update_clerk_metadata(user_id: str, metadata: dict):
    """Updates public metadata for a Clerk user via Management API"""
    async with httpx.AsyncClient() as client:
        response = await client.patch(
            f"https://api.clerk.com/v1/users/{user_id}",
            headers={
                "Authorization": f"Bearer {CLERK_SECRET_KEY}",
                "Content-Type": "application/json",
            },
            json={"public_metadata": metadata},
        )
        response.raise_for_status()
        return response.json()

@router.post("/stripe-webhook")
async def handle_stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    # 1️⃣ Verify Stripe signature (security)
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # 2️⃣ Handle payment events
    if event.type == "checkout.session.completed":
        session = event.data.object
        clerk_user_id = session.metadata.get("clerk_user_id")
        if not clerk_user_id:
            return JSONResponse(content={"status": "ignored_no_user"}, status_code=200)

        await update_clerk_metadata(clerk_user_id, {
            "plan": "pro",
            "subscriptionStatus": "active",
            "stripeCustomerId": session.customer,
        })

    elif event.type in ["customer.subscription.updated", "customer.subscription.deleted"]:
        sub = event.data.object
        clerk_user_id = sub.metadata.get("clerk_user_id")
        if not clerk_user_id:
            return JSONResponse(content={"status": "ignored_no_user"}, status_code=200)

        is_active = sub.status == "active"
        await update_clerk_metadata(clerk_user_id, {
            "plan": "pro" if is_active else "free",
            "subscriptionStatus": "active" if is_active else "inactive",
        })

    return JSONResponse(content={"status": "success"}, status_code=200)
