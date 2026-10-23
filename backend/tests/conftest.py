import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.base import Base
from app.db.session import get_db
from app.seed.seeder import seed_database
from app.services.auth_service import AuthService
from app.models.user import User

# Use an in-memory SQLite database with StaticPool so all connections share the same memory DB
TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def admin_token(db_session) -> str:
    user = db_session.query(User).filter(User.email == "admin@aicte-india.org").first()
    return AuthService.generate_token(user)


@pytest.fixture
def officer_token(db_session) -> str:
    user = db_session.query(User).filter(User.email == "m.sundaram@aicte-india.org").first()
    return AuthService.generate_token(user)


@pytest.fixture
def reviewer_token(db_session) -> str:
    user = db_session.query(User).filter(User.email == "anuradha.sen@aicte-india.org").first()
    return AuthService.generate_token(user)


@pytest.fixture
def apex_inst_token(db_session) -> str:
    user = db_session.query(User).filter(User.email == "registrar@apextech-pune.ac.in").first()
    return AuthService.generate_token(user)


@pytest.fixture
def braite_inst_token(db_session) -> str:
    user = db_session.query(User).filter(User.email == "director@braite-hyd.edu.in").first()
    return AuthService.generate_token(user)
