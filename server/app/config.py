import os
from dotenv import load_dotenv

load_dotenv()

# Leave these blank/unset for local development — mock OAuth mode will be used instead.
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
APPLE_CLIENT_ID = os.getenv("APPLE_CLIENT_ID", "")

# When True, /auth/google and /auth/apple accept mock tokens (mock_google_..., mock_apple_...)
# without contacting real Google/Apple servers. Set to False once real OAuth keys are added.
ALLOW_MOCK_OAUTH = os.getenv("ALLOW_MOCK_OAUTH", "true").lower() == "true"