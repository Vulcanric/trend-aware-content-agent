""" Defines all Agents """
import os
from together import Together
from dotenv import load_dotenv
from bright_data import search_with_bright_data
# from time import sleep


load_dotenv()
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")

client = Together(api_key=TOGETHER_API_KEY)

def content_generator(trend: str, content_format: str, target_audience: str, mood: str) -> str:
    """ Agent: Content Generator\n
        Generates content in the format specified by the parameter `content_format`
        for audience of type `target_audience`
    """
    print("Content Generator: Running")

    # sleep(20)
    # return "I will not generate anything for you! 😤"

    if not trend:
        return "No trend provided."

    SYSTEM_PROMPT = f"""
    You are a world-class content creator skilled at creating the best and creative contents.
    Your task is to generate unique and engaging content based on the provided trend.
    You should consider the format, target audience, and tone specified in the request.
    You should also ensure that the content is well-structured and formatted in a markdown syntax.
    You should not include any irrelevant information or noise in your response.
    RULE: Only return the content
    """

    details = f"Format: {content_format}. Audience: {target_audience}. Tone: {mood}"
    info = search_with_bright_data(trend)  # Get more context on the trend
    print("INFO: ", info)

    prompt = f"""
    Generate a unique content ({details}) for this trending topic: {trend}.

    For more context, you can use the information below:
    {
        info if info else "No additional information available on this trend."
    }
    """

    response = client.chat.completions.create(
        model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
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
    You should also ensure that the extracted topics are clean and must tell a story.
    You should return the extracted topics in a list format.
    You should only return the list of extracted topics.
    Returned topics must not be less than 15.
    Your response is going to be parsed by a JSON decoder, so don't tell me any other thing
    IMPORTANT RULE: Always reply in valid json format List[str], no code blocks, no thought, and no explanation.
    ---
    {raw_data}
    """
    response = client.chat.completions.create(
        model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
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
