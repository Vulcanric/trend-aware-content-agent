""" Utilize Bright Data web unlocker MCP server """
import os
import httpx
from functools import cache
from dotenv import load_dotenv
from typing import Callable, Dict, Optional


load_dotenv()

BRIGHT_DATA_API = "https://api.brightdata.com"
BRIGHT_DATA_TOKEN = os.getenv("BRIGHT_DATA_TOKEN")
BRIGHT_DATA_PROXY_ZONE = os.getenv("BRIGHT_DATA_PROXY_ZONE")
BRIGHT_DATA_HEADERS = {
    "Authorization": f"Bearer {BRIGHT_DATA_TOKEN}",
    "Content-Type": "application/json"
}


# @cache
def search_with_bright_data(prompt: str) -> str:
    """ Search the web using Bright Data's SERP API with AI integration
        Retrieve timely and relevant web data on the issued prompt.
    """
    print("Search with Bright Data: Running")

    PROMPT = f"Current information on: {prompt}"
    PARAMS = {
        "dataset_id": "gd_m7aof0k82r803d5bjm",
        "include_errors": False
    }
    payload = {
        "input": [
            {
                "url": "https://chatgpt.com/?hint=search",
                "prompt": PROMPT,
                "sources_not_required": True,
                "web_search": True
            }
        ],
        "custom_output_fields": ["answer_text_markdown"]
    }

    result = ""
    try:
        res = httpx.post(
            f"{BRIGHT_DATA_API}/datasets/v3/scrape",
            json=payload,
            params=PARAMS,
            headers=BRIGHT_DATA_HEADERS,
            timeout=120.0
        )
        print("Search Result: ", res.text, res.json())
        res.raise_for_status()
        result = res.json().get("answer_text_markdown")
    except httpx.HTTPStatusError as e:
        print(f"HTTP error occured: {e.response.status_code} - {e.response.text}")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        return result


async def scrape_with_bright_data(
        session: httpx.AsyncClient, country_code: Optional[str], url: str, processor: Callable
    ) -> str:
    """ Scrape web data with Bright Data's MCP web unlocker API.
        Process the data and return the output
    """
    print(f"Started Task: {url}")
    cc = country_code

    payload = {
        "method": "GET",
        "url": url,
        "zone": BRIGHT_DATA_PROXY_ZONE,
        "format": "raw",
        "country": cc.lower() if cc else ""
    }
    errors = [
        "Request Failed (bad_endpoint): Requested site is not available for immediate access mode in accordance with robots.txt. Ask your account manager to get full access for targeting this site"
    ]

    try:
        res = await session.post(f"{BRIGHT_DATA_API}/request", json=payload, headers=BRIGHT_DATA_HEADERS)
        print("STATUS: ", res.status_code)
        if res.is_error or res.text in errors:
            print(f"Bright Data error: {res.status_code} - {res.text}")
            res = await session.get(f"{url}{f"&gl={cc}" if cc else ""}")

        res.raise_for_status()
        return processor(res.text)

    except httpx.HTTPStatusError as e:
        print(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
        return ""

    print(f"Ended Task: {url}")


@cache
def get_user_country(host: str) -> Dict:
    """ Get user country based on IP
    """
    payload = {
        "fields": "status,countryCode",
    }
    json = {}
    try:
        res = httpx.get(f"http://ip-api.com/json/{host}", payload=payload)
        res.raise_for_status()
        json = res.json()
    except httpx.HTTPStatusError:
        pass
    finally:
        return json

# async def scrape_with_bright_data(trend_scrapers: List[Dict[str, callable | Dict]]) -> str:
#     """ Scrape web apps with Bright Data's MCP web unlocker API
#     """
#     # HEADERS = {
#     #     "Authorization": f"Bearer {BRIGHT_DATA_TOKEN}",
#     #     "Content-Type": "application/json"
#     # }

#     async with httpx.AsyncClient() as client:
#         trend_tasks = [scraper["func"](client, **scraper["args"]) for scraper in trend_scrapers]
#         trend_results = asyncio.gather(*trend_tasks)
#         return trend_results
