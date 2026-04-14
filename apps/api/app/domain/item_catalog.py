from __future__ import annotations

from typing import Final

SUPPORTED_ITEM_CATEGORIES: Final[dict[str, dict[str, int | str]]] = {
    "卷纸": {"unit": "提", "safety_stock_days": 7},
    "抽纸": {"unit": "包", "safety_stock_days": 7},
    "垃圾袋": {"unit": "卷", "safety_stock_days": 7},
    "洗衣液": {"unit": "瓶", "safety_stock_days": 10},
    "洗洁精": {"unit": "瓶", "safety_stock_days": 10},
    "牙膏": {"unit": "支", "safety_stock_days": 10},
    "猫粮": {"unit": "袋", "safety_stock_days": 7},
    "狗粮": {"unit": "袋", "safety_stock_days": 7},
    "猫砂": {"unit": "袋", "safety_stock_days": 10},
    "尿不湿": {"unit": "包", "safety_stock_days": 14},
    "湿巾": {"unit": "包", "safety_stock_days": 10},
}


def list_item_catalog() -> list[dict[str, int | str]]:
    return [
        {
            "category": category,
            "unit": values["unit"],
            "safety_stock_days": values["safety_stock_days"],
        }
        for category, values in SUPPORTED_ITEM_CATEGORIES.items()
    ]


def get_item_catalog(category: str) -> dict[str, int | str] | None:
    return SUPPORTED_ITEM_CATEGORIES.get(category)
