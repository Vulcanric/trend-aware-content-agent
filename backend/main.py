""" Trend-Aware Content Generator API """
import json
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from httpx import AsyncClient
from bright_data import scrape_with_bright_data
from trend_scrapers import get_reddit_trending, get_youtube_trending
from agents import content_generator, trend_extractor
from models import ContentSetting


api = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://localhost:8501",
]

api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@api.get("/api/trends")
async def get_trends():
    """ Get current topics that are trending on the internet
    """
    sources = [
        ("https://www.reddit.com/r/all/hot.json?limit=30", get_reddit_trending, False),
        ("https://www.youtube.com/feed/trending", get_youtube_trending, False)
    ]
    async with AsyncClient() as session:
        tasks = [scrape_with_bright_data(session, *trend_source) for trend_source in sources]
        results = await asyncio.gather(*tasks)  # Nested lists [[],[],...]
        raw_trends = [trend for result in results for trend in result ]
        trends = json.loads(trend_extractor(json.dumps(raw_trends)))

    return {"trends": trends}


@api.post("/api/generate")
def generate_content(setting: ContentSetting):
    """ Generate content with LLM
    """
    trend = setting.trend
    format = setting.format
    audience = setting.audience
    mood = setting.mood

    content = content_generator(trend, format, audience, mood)
    return {"content": content}
