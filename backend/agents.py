""" Defines all Agents """
import os
from together import Together
from dotenv import load_dotenv
from models import Trend


load_dotenv()
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")

client = Together(api_key=TOGETHER_API_KEY)

def content_generator(trend: str, content_format: str, target_audience: str, mood: str) -> str:
    """ Agent: Content Generator\n
        Generates content in the format specified by the parameter `content_format`
        for audience of type `target_audience`
    """
    print("Content Generator: Running")

    if not trend:
        return "No trend provided."

    details = f"Format: {content_format}. Audience: {target_audience}. Mood: {mood}"
    prompt = f"""
    Generate a unique content ({details}) for this trending topic: {trend}.
    IMPORTANT RULE: Your response must be well structured and formatted in a markdown syntax
    """

    response = client.chat.completions.create(
        model="meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
        messages=[
            {
                "role": "system",
                "content": "You're a world-class content creator"
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        max_tokens=1024,
        temperature=1.0,
    )

    return response.choices[0].message.content


def trend_extractor(raw_data: str) -> str:
    """ Agent: Trend Extractor\n
        Extracts trending topics from raw, impure, and unstructured data.
    """
    print("Trend Extractor: Running")
    prompt = f"""
    The data below contains trends.
    Your goal is to extract trending topics from it and refine it as needed.
    The data may contain noise, irrelevant information, or unstructured text.
    Your task is to identify and extract the relevant trending topics from the data.
    You should focus on the most relevant and popular topics that are currently trending.
    You should also ensure that the extracted topics are in a clean and structured format.
    You should not include any irrelevant information or noise in your response.
    You should return the extracted topics in a list format.
    You should only return the list of extracted topics.
    Returned topics must not be less that 10
    IMPORTANT RULE: Always reply in valid json format List[str], no code blocks.
    ---
    {raw_data}
    """
    response = client.chat.completions.create(
        model="meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        max_tokens=1024,
        teperature=1.0,
    )

    raw_response = response.choices[0].message.content
    print("TOPICS: ", raw_response)
    return raw_response
