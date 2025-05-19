""" Cache """
from functools import wraps
from collections import defaultdict
from typing import Any, Callable


FUNC_CACHE = defaultdict(tuple)
DATA_CACHE = defaultdict(str)

async def cache_request(func: Callable) -> Any:
    """ Memoize function calls and cache result to prevent repeating the same
        network request multiple times
    """
    @wraps(func)  # Make memoizer look like func (docs, name, etc)
    async def memoizer(*args, **kwargs):
        """ Track function calls to avoid repeating the same request """
        prev_args = FUNC_CACHE[func.__qualname__]
        new_args = args, kwargs

        # Only send network requests when func arguments are different from the previous
        if new_args != prev_args:
            result = await func(*args, **kwargs)  # Make request
            FUNC_CACHE[func.__qualname__] = args, kwargs  # Track function call
            DATA_CACHE[func.__qualname__] = result  # Cache result
        else:
            result = DATA_CACHE[func.__qualname__]  # Get cached data
        
        return result
    return memoizer
            