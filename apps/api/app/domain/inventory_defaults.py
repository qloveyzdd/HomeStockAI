from __future__ import annotations

DEFAULT_CYCLE_DAYS = {
    "卷纸": 21,
    "抽纸": 21,
    "垃圾袋": 21,
    "洗衣液": 30,
    "洗洁精": 30,
    "牙膏": 30,
    "猫粮": 20,
    "狗粮": 20,
    "猫砂": 18,
    "尿不湿": 14,
    "湿巾": 20,
}

BABY_CATEGORIES = {"尿不湿", "湿巾"}
PET_CATEGORY_KEYS = {
    "猫粮": "猫",
    "猫砂": "猫",
    "狗粮": "狗",
}


def get_default_cycle_days(category: str) -> int:
    return DEFAULT_CYCLE_DAYS.get(category, 21)


def get_adjusted_cycle_days(category: str, household_size: int, has_pet: bool, pet_type: str | None, has_baby: bool) -> float:
    cycle_days = float(get_default_cycle_days(category))
    multiplier = 1.0

    if household_size >= 4:
        multiplier *= 1.3
    elif household_size == 3:
        multiplier *= 1.15

    if category in BABY_CATEGORIES and has_baby:
        multiplier *= 1.25

    pet_key = PET_CATEGORY_KEYS.get(category)
    normalized_pet_type = (pet_type or "").strip()
    if pet_key and has_pet and (not normalized_pet_type or pet_key in normalized_pet_type):
        multiplier *= 1.2

    return max(cycle_days / multiplier, 1.0)
