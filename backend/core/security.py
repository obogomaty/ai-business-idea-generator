import jwt
import requests
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.config import settings

security = HTTPBearer()

# Cache JWKS to avoid fetching on every request
_jwks_cache = {}

def get_jwks():
    if not _jwks_cache:
        response = requests.get(settings.CLERK_JWKS_URL)
        response.raise_for_status()
        _jwks_cache.update(response.json())
    return _jwks_cache

async def get_current_user(
    creds: HTTPAuthorizationCredentials = Security(security)
) -> dict:
    """Verify Clerk JWT manually using JWKS"""
    token = creds.credentials
    
    try:
        # Get the key ID from the token header
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        
        if not kid:
            raise HTTPException(status_code=401, detail="Invalid token header")

        # Find the matching public key
        jwks = get_jwks()
        public_key = None
        for key in jwks.get("keys", []):
            if key.get("kid") == kid:
                public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
                break
        
        if not public_key:
            raise HTTPException(status_code=401, detail="Public key not found")

        # Decode and verify the token
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=settings.CLERK_JWKS_URL.split("/.well-known")[0] # Use Issuer as audience
        )
        
        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Auth error: {str(e)}")
