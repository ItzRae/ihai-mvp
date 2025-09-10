# models.py
from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import passlib.hash 

# ----------------- USER TABLE -----------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    role = Column(String(32), nullable=False, default="volunteer")  # e.g., "admin", "user"
    password_hash = Column(String(255), nullable=False)

    def verify_password(self, password: str):
        return passlib.hash.bcrypt.verify(password, self.password_hash) # verify actual password against stored hash

    # relationships
    shifts = relationship("Shift", back_populates="user", cascade="all, delete-orphan")
    tokens = relationship("TokenTransaction", back_populates="user", cascade="all, delete-orphan")

# ----------------- SHIFT TABLE -----------------
class Shift(Base):
    __tablename__ = "shifts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    host_site = Column(String(100), nullable=True, default="")  # e.g., "Community Center", optional
    date_created = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    date_last_modified = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    task = Column(String, nullable=False)

    # store as DateTime; FastAPI/Pydantic will serialize to/from strings
    start_time = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=True)

    approved = Column(Boolean, default=False, nullable=False)

    # relationships
    user = relationship("User", back_populates="shifts")
    tokens = relationship("TokenTransaction", back_populates="shift")

# ----------------- TOKEN TRANSACTION TABLE -----------------
class TokenTransaction(Base):
    __tablename__ = "tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    shift_id = Column(Integer, ForeignKey("shifts.id"), nullable=True)

    # "earn" or "spend"
    type = Column(String, nullable=False)
    amount = Column(Float, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # relationships
    user = relationship("User", back_populates="tokens")
    shift = relationship("Shift", back_populates="tokens")
