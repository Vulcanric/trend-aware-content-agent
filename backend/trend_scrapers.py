""" Scrape popular platforms for trending content
"""
import json
from bs4 import BeautifulSoup
from typing import List


def get_reddit_trending(raw_data) -> List[str]:
    """ Scrape reddit for trending/popular contents
        Returns list of topics
    """
    # url = "https://www.reddit.com/r/all/hot.json?limit=5"
    if not raw_data:
        return []

    data = json.loads(raw_data)
    titles = [post["data"]["title"] for post in data["data"]["children"]]
    print("REDDIT: ", titles)
    return titles


def get_youtube_trending(raw_data: str) -> List[str]:
    """ Scrape youtube for trending contents
    """
    if not raw_data:
        return []

    # url = "https://www.youtube.com/feed/trending"
    soup = BeautifulSoup(raw_data, "html.parser")  # Parse HTML first

    titles = []

    try:
        for script in soup.find_all("script"):
            if "var ytInitialData" in script.text:
                start = script.text.find("var ytInitialData") + len("var ytInitialData = ")
                end = script.text.rfind("};") + 1
                raw_json = script.text[start:end]
                data = json.loads(raw_json)
                videos = data["contents"]["twoColumnBrowseResultsRenderer"]["tabs"][0]["tabRenderer"]["content"]["sectionListRenderer"]\
                ["contents"][0]["itemSectionRenderer"]["contents"][0]["shelfRenderer"]["content"]["expandedShelfContentsRenderer"]\
                    ["items"]
                for item in videos:
                    try:
                        title = item["videoRenderer"]["title"]["runs"][0]["text"]
                        print("TITLE: ", title)
                        titles.append(title)
                        if len(titles) >= 30:  # Limit
                            break
                    except:
                        continue
                break
    except Exception as e:
        print(f"Error parsing YouTube data: {e}")
    finally:
        print("YOUTTUBE: ", titles)
        return titles
