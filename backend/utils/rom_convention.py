from typing import Dict


ROM_DIRECTION_ALIASES: Dict[str, str] = {
    "internal_rotation": "internal-rotation",
    "external_rotation": "external-rotation",
    "left_rotation": "left-rotation",
    "right_rotation": "right-rotation",
    "left_lateral_flexion": "left-lateral-flexion",
    "right_lateral_flexion": "right-lateral-flexion",
    "radial_deviation": "radial-deviation",
    "ulnar_deviation": "ulnar-deviation",
    "plantar_flexion": "plantarflexion",
}


ROM_JOINT_DIRECTIONS: Dict[str, tuple[str, ...]] = {
    "cervical": (
        "flexion",
        "extension",
        "left-lateral-flexion",
        "right-lateral-flexion",
        "left-rotation",
        "right-rotation",
    ),
    "shoulder": (
        "flexion",
        "extension",
        "abduction",
        "adduction",
        "internal-rotation",
        "external-rotation",
    ),
    "elbow": (
        "flexion",
        "extension",
    ),
    "wrist": (
        "flexion",
        "extension",
        "radial-deviation",
        "ulnar-deviation",
    ),
    "hip": (
        "flexion",
        "extension",
        "abduction",
        "adduction",
        "internal-rotation",
        "external-rotation",
    ),
    "knee": (
        "flexion",
        "extension",
    ),
    "ankle": (
        "dorsiflexion",
        "plantarflexion",
    ),
    "thoracolumbar": (
        "flexion",
        "extension",
        "left-lateral-flexion",
        "right-lateral-flexion",
    ),
}


def normalize_rom_direction(joint_type: str, direction: str) -> str:
    if direction in ROM_DIRECTION_ALIASES:
        direction = ROM_DIRECTION_ALIASES[direction]

    if joint_type == "cervical":
        mapping = {
            "abduction": "left-lateral-flexion",
            "adduction": "right-lateral-flexion",
            "internal_rotation": "left-rotation",
            "external_rotation": "right-rotation",
            "internal-rotation": "left-rotation",
            "external-rotation": "right-rotation",
        }
        direction = mapping.get(direction, direction)

    if joint_type == "wrist":
        mapping = {
            "abduction": "radial-deviation",
            "adduction": "ulnar-deviation",
        }
        direction = mapping.get(direction, direction)

    if joint_type == "ankle":
        mapping = {
            "flexion": "dorsiflexion",
            "extension": "plantarflexion",
        }
        direction = mapping.get(direction, direction)

    return direction
