"""Instagram shortcode -> media id -> insights URL (pure maths, no network).
  python tools/media_id.py DPxyz123AbC [more shortcodes]"""
import sys

ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"  # base64url


def media_id(shortcode):
    n = 0
    for ch in shortcode.split("?")[0].strip("/").split("/")[-1][:11]:
        n = n * 64 + ALPHABET.index(ch)
    return n


def insights_url(shortcode):
    return f"https://www.instagram.com/insights/media/{media_id(shortcode)}/"


if __name__ == "__main__":
    for s in sys.argv[1:]:
        print(s, media_id(s), insights_url(s))
