
from datetime import datetime

from pydantic import BaseModel, HttpUrl, ConfigDict


class WebsiteCreate(BaseModel):
    url: HttpUrl


class WebsiteResponse(BaseModel):
    id: int
    url: str
    screenshot_path: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
