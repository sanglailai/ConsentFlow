# backend/main.py

from fastapi import FastAPI, Request
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# 建立 FastAPI 应用
app = FastAPI()

# 允许前端连接
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化数据库 (SQLite)
DATABASE_URL = "sqlite:///../consent.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)

# 定义 ORM 数据表结构
Base = declarative_base()

class ConsentLog(Base):
    __tablename__ = "consent_logs"

    id = Column(Integer, primary_key=True)
    user_id = Column(String)
    consent_type = Column(String)       # e.g. 'ads', 'analytics'
    status = Column(String)             # 'accepted' or 'rejected'
    timestamp = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# 定义 Pydantic 输入模型
class ConsentInput(BaseModel):
    user_id: str
    consent_type: str
    status: str

# 接受用户同意记录 POST /submit-consent
@app.post("/submit-consent")
async def submit_consent(consent: ConsentInput):
    db = SessionLocal()
    log = ConsentLog(
        user_id=consent.user_id,
        consent_type=consent.consent_type,
        status=consent.status
    )
    db.add(log)
    db.commit()
    db.close()
    return {"message": "✅ 同意状态已记录"}

# 查看同意记录 GET /consent-logs
@app.get("/consent-logs")
async def get_logs():
    db = SessionLocal()
    logs = db.query(ConsentLog).order_by(ConsentLog.timestamp.desc()).all()
    db.close()
    return [
        {
            "user_id": log.user_id,
            "consent_type": log.consent_type,
            "status": log.status,
            "timestamp": log.timestamp.isoformat()
        }
        for log in logs
    ]
@app.get("/")
async def root():
    return {"message": "✅ 后端正常运行中！"}


# 审计日志导出接口（用于前端 Audit 页面）
@app.get("/audit/logs")
async def audit_logs():
    db = SessionLocal()
    logs = db.query(ConsentLog).order_by(ConsentLog.timestamp.desc()).all()
    db.close()
    return [
        {
            "user_id": log.user_id,
            "action": f"{log.consent_type}:{log.status}",
            "timestamp": log.timestamp.isoformat()
        }
        for log in logs
    ]
