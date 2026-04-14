from __future__ import annotations

import re

PLATFORM_KEYWORDS = {
    "京东": "京东",
    "淘宝": "淘宝",
    "天猫": "天猫",
    "拼多多": "拼多多",
    "抖音": "抖音",
}

PRICE_PATTERNS = [
    re.compile(r"(?:实付|到手|支付|合计|总价)\s*(?:[:：])?\s*(?:¥|￥)?\s*(\d+(?:\.\d{1,2})?)"),
    re.compile(r"(?:¥|￥)\s*(\d+(?:\.\d{1,2})?)"),
]

QUANTITY_PATTERNS = [
    re.compile(r"[xX*＊]\s*(\d+(?:\.\d+)?)"),
    re.compile(r"(\d+(?:\.\d+)?)\s*(?:件|瓶|袋|卷|包|提|支|盒|桶|个)"),
]

TITLE_PREFIXES = ("商品", "宝贝", "名称")


def _clean_title(text: str) -> str | None:
    lines = [line.strip(" -:：") for line in text.splitlines() if line.strip()]
    for line in lines:
        if any(keyword in line for keyword in PLATFORM_KEYWORDS):
            continue
        if any(pattern.search(line) for pattern in PRICE_PATTERNS):
            continue
        if any(prefix in line for prefix in ("订单", "支付", "下单", "时间")):
            continue
        for title_prefix in TITLE_PREFIXES:
            if line.startswith(title_prefix):
                line = line.split(":", 1)[-1].split("：", 1)[-1].strip()
        if line:
            return line[:200]
    return lines[0][:200] if lines else None


def _find_platform(text: str) -> str | None:
    for keyword, platform in PLATFORM_KEYWORDS.items():
        if keyword in text:
            return platform
    return None


def _find_first_number(text: str, patterns: list[re.Pattern[str]]) -> float | None:
    for pattern in patterns:
        match = pattern.search(text)
        if match:
            return float(match.group(1))
    return None


def parse_order_text(text: str) -> dict[str, str | float | None]:
    normalized = re.sub(r"\s+", " ", text).strip()
    return {
        "platform": _find_platform(text),
        "sku_title": _clean_title(text) or (normalized[:200] if normalized else None),
        "quantity": _find_first_number(text, QUANTITY_PATTERNS),
        "total_price": _find_first_number(text, PRICE_PATTERNS),
    }
