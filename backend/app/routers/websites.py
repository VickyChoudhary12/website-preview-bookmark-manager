import logging

logger = logging.getLogger(__name__)
import ipaddress
import socket
from urllib.parse import urlsplit

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Website
from app.schemas.website import WebsiteCreate, WebsiteResponse
from app.core.dependencies import get_current_user
from app.services.screenshot_service import capture_screenshot


router = APIRouter(prefix="/websites", tags=["Websites"])


def validate_public_url(url: str):
    parsed = urlsplit(url)

    if parsed.scheme not in ("http", "https"):
        raise HTTPException(
            status_code=400,
            detail="Only HTTP and HTTPS URLs are allowed"
        )

    hostname = parsed.hostname

    if not hostname:
        raise HTTPException(
            status_code=400,
            detail="Invalid website URL"
        )

    if hostname.lower() == "localhost":
        raise HTTPException(
            status_code=400,
            detail="Local addresses are not allowed"
        )

    try:
        addresses = socket.getaddrinfo(
            hostname,
            None,
            type=socket.SOCK_STREAM
        )

        for address in addresses:
            ip = ipaddress.ip_address(address[4][0])

            if not ip.is_global:
                raise HTTPException(
                    status_code=400,
                    detail="Private or internal addresses are not allowed"
                )

    except socket.gaierror:
        raise HTTPException(
            status_code=400,
            detail="Unable to resolve website hostname"
        )


@router.post("/preview", response_model=WebsiteResponse)
def create_website_preview(
    website_data: WebsiteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    url = str(website_data.url)

    validate_public_url(url)

    try:
        screenshot_path = capture_screenshot(url)

        new_website = Website(
            user_id=current_user.id,
            url=url,
            screenshot_path=screenshot_path
        )

        db.add(new_website)
        db.commit()
        db.refresh(new_website)

        return new_website

    except HTTPException:
        raise

    except Exception:
        db.rollback()
        logger.exception("Website preview generation failed")

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to generate website preview"
        )


@router.get("/", response_model=list[WebsiteResponse])
def get_saved_websites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    websites = db.query(Website).filter(
        Website.user_id == current_user.id
    ).order_by(Website.created_at.desc()).all()

    return websites
