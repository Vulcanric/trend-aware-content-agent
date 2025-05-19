""" Utilize Bright Data web unlocker MCP server """
import os
import httpx
from dotenv import load_dotenv
from typing import List, Dict, Callable


load_dotenv()

BRIGHT_DATA_TOKEN = os.getenv("BRIGHT_DATA_TOKEN")
BRIGHT_DATA_PROXY_ZONE = os.getenv("BRIGHT_DATA_PROXY_ZONE")
BRIGHT_DATA_URL = "https://api.brightdata.com/request"
BRIGHT_DATA_HEADERS = {
    "Authorization": f"Bearer {BRIGHT_DATA_TOKEN}",
    "Content-Type": "application/json"
}
PAYLOAD = {
    "method": "GET",
    "url": "",  # To be filled by trend scrapers
    "zone": BRIGHT_DATA_PROXY_ZONE,
    "format": "raw",
    "country": "us"
}


async def scrape_with_bright_data(
        session: httpx.AsyncClient, url: str, processor: Callable, brd: bool = True
    ) -> str:
    """ Scrape web data with Bright Data's MCP web unlocker API.
        Process the data and return the output
    """
    print(f"Started Task: {url}")

    try:
        if brd:
            PAYLOAD["url"] = url
            print("PAYLOAD: ", PAYLOAD)
            res = await session.post(BRIGHT_DATA_URL, json=PAYLOAD, headers=BRIGHT_DATA_HEADERS)
            res.raise_for_status()
            return processor(res.text)
        else:
            res = await session.get(url)
            res.raise_for_status()
            return processor(res.text)

    except httpx.HTTPStatusError as e:
        print(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
        return ""

    print(f"Ended Task: {url}")


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
