import pytest
from fastapi import status


def test_login_success(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@aicte-india.org", "password": "admin@2026"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["role"] == "ADMIN"
    assert data["full_name"] == "Dr. Abhay Jere"


def test_login_invalid_password(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@aicte-india.org", "password": "wrongpassword"}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Incorrect email or password" in response.json()["detail"]


def test_login_nonexistent_user(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "unknown@aicte-india.org", "password": "anypassword"}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_institution_login_success(client):
    response = client.post(
        "/api/v1/auth/institution-login",
        json={
            "email": "registrar@apextech-pune.ac.in",
            "access_key": "apex@compliance2026",
            "institution_id": "1-10492811"
        }
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "INSTITUTION_REPRESENTATIVE"
    assert data["institution_id"] == "1-10492811"


def test_institution_login_invalid_key(client):
    response = client.post(
        "/api/v1/auth/institution-login",
        json={
            "email": "registrar@apextech-pune.ac.in",
            "access_key": "wrong_key_123",
            "institution_id": "1-10492811"
        }
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_auth_me_endpoint(client, admin_token):
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "admin@aicte-india.org"
    assert data["role"] == "ADMIN"


def test_unauthenticated_request_rejected(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_institution_cross_access_denied(client, apex_inst_token):
    # Apex Representative (PID: 1-10492811) attempting to access Dr. B.R. Ambedkar Institute (PID: 1-28491022) complaints
    response = client.get(
        "/api/v1/institutions/1-28491022/complaints",
        headers={"Authorization": f"Bearer {apex_inst_token}"}
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "Access Denied" in response.json()["detail"]
