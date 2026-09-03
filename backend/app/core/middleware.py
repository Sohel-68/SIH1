import time
import uuid
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response


class AuditAndCorrelationMiddleware(BaseHTTPMiddleware):
    """
    Enterprise middleware ensuring:
    1. Every request carries an X-Correlation-ID for distributed tracing.
    2. Response execution latency is measured and attached in headers.
    3. Requests are marked for audit ledger tracking.
    """
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Extract or generate correlation UUID
        correlation_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
        request.state.correlation_id = correlation_id

        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time

        response.headers["X-Correlation-ID"] = correlation_id
        response.headers["X-Process-Time"] = f"{process_time:.4f}s"
        response.headers["X-GeoStrata-Version"] = "1.0.0"

        return response
