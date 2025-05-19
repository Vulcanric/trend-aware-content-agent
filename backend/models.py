""" JSON Schema Models """
from pydantic import BaseModel
from typing import List, Optional


class Trend(BaseModel):
    """ Trend Schema """
    trends: List[str]


class ContentSetting(BaseModel):
    """ Content """
    trend: str
    format: str
    audience: str
    mood: Optional[str] = "normal"

