from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router

app = FastAPI(
    title="RehabHub AI Backend",
    description="Python backend for RehabHub movement analysis",
    version="0.1.0"
)

# 配置 CORS，允许前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 生产环境请修改为具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to RehabHub Python Backend"}

@app.get("/health")
def health_check():
    from datetime import datetime, timezone

    return {
        "code": 200,
        "message": "ok",
        "data": {"status": "ok", "version": "0.1.0"},
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
