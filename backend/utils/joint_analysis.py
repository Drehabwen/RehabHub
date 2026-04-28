from typing import Dict, List, Optional, Union, Any
import math
from .math_utils import (
    calculate_angle, calculate_signed_angle, calculate_midpoint, 
    get_pixel_coords, calculate_vector_3d, calculate_angle_3d, 
    calculate_midpoint_3d, normalize_3d, cross_product_3d, dot_product_3d, magnitude_3d,
    calculate_angle_between_vectors_2d, calculate_signed_angle_between_vectors_2d
)
from .rom_convention import normalize_rom_direction

# MediaPipe Pose Landmark Indices
LANDMARKS = {
    'NOSE': 0,
    'LEFT_SHOULDER': 11,
    'RIGHT_SHOULDER': 12,
    'LEFT_ELBOW': 13,
    'RIGHT_ELBOW': 14,
    'LEFT_WRIST': 15,
    'RIGHT_WRIST': 16,
    'LEFT_PINKY': 17,
    'RIGHT_PINKY': 18,
    'LEFT_INDEX': 19,
    'RIGHT_INDEX': 20,
    'LEFT_THUMB': 21,
    'RIGHT_THUMB': 22,
    'LEFT_HIP': 23,
    'RIGHT_HIP': 24,
    'LEFT_KNEE': 25,
    'RIGHT_KNEE': 26,
    'LEFT_ANKLE': 27,
    'RIGHT_ANKLE': 28,
    'LEFT_HEEL': 29,
    'RIGHT_HEEL': 30,
    'LEFT_FOOT_INDEX': 31,
    'RIGHT_FOOT_INDEX': 32,
    'LEFT_EAR': 7,
    'RIGHT_EAR': 8,
}


def _landmark_point(landmarks: List[Dict[str, float]], index: int) -> Optional[Dict[str, float]]:
    if not landmarks or index >= len(landmarks):
        return None
    point = landmarks[index]
    if point is None:
        return None
    return {
        "x": point.get("x", 0.0),
        "y": point.get("y", 0.0),
        "z": point.get("z", 0.0),
    }


def _midpoint_3d(p1: Dict[str, float], p2: Dict[str, float]) -> Dict[str, float]:
    return {
        "x": (p1["x"] + p2["x"]) / 2,
        "y": (p1["y"] + p2["y"]) / 2,
        "z": (p1["z"] + p2["z"]) / 2,
    }


def _vector_3d(p1: Dict[str, float], p2: Dict[str, float]) -> Dict[str, float]:
    return {
        "x": p2["x"] - p1["x"],
        "y": p2["y"] - p1["y"],
        "z": p2["z"] - p1["z"],
    }


def _project_to_plane(vector: Dict[str, float], plane: str) -> Dict[str, float]:
    if plane == "xy":
        return {"x": vector["x"], "y": vector["y"], "z": 0.0}
    if plane == "yz":
        return {"x": 0.0, "y": vector["y"], "z": vector["z"]}
    return {"x": vector["x"], "y": 0.0, "z": vector["z"]}


def _safe_angle_between(v1: Dict[str, float], v2: Dict[str, float]) -> float:
    angle = calculate_angle_3d(v1, v2)
    return angle if math.isfinite(angle) else 0.0


def _deviation_from_same_line(v1: Dict[str, float], v2: Dict[str, float]) -> float:
    angle = _safe_angle_between(v1, v2)
    return min(angle, abs(180 - angle))


def _deviation_from_straight(v1: Dict[str, float], v2: Dict[str, float]) -> float:
    return abs(180 - _safe_angle_between(v1, v2))


def _same_line_on_plane(v1: Dict[str, float], v2: Dict[str, float], plane: str) -> float:
    return _deviation_from_same_line(_project_to_plane(v1, plane), _project_to_plane(v2, plane))


def _straight_on_plane(v1: Dict[str, float], v2: Dict[str, float], plane: str) -> float:
    return _deviation_from_straight(_project_to_plane(v1, plane), _project_to_plane(v2, plane))


def _signed_angle_on_plane(v1: Dict[str, float], v2: Dict[str, float], plane: str) -> float:
    p1 = _project_to_plane(v1, plane)
    p2 = _project_to_plane(v2, plane)

    if plane == "xy":
        cross = p1["x"] * p2["y"] - p1["y"] * p2["x"]
        dot = p1["x"] * p2["x"] + p1["y"] * p2["y"]
    elif plane == "yz":
        cross = p1["y"] * p2["z"] - p1["z"] * p2["y"]
        dot = p1["y"] * p2["y"] + p1["z"] * p2["z"]
    else:
        cross = p1["x"] * p2["z"] - p1["z"] * p2["x"]
        dot = p1["x"] * p2["x"] + p1["z"] * p2["z"]

    if not math.isfinite(cross) or not math.isfinite(dot):
        return 0.0
    return math.degrees(math.atan2(cross, dot))


def _rotation_magnitude_from_signed(signed_angle: float, direction: str) -> float:
    if direction == "internal_rotation":
        return max(0.0, signed_angle)
    if direction == "external_rotation":
        return max(0.0, -signed_angle)
    return abs(signed_angle)


def _rotation_on_plane(
    v1: Dict[str, float],
    v2: Dict[str, float],
    plane: str,
    direction: str,
    side: Optional[str],
) -> float:
    raw_signed = _signed_angle_on_plane(v1, v2, plane)
    side_normalized = raw_signed if side == "left" else -raw_signed
    return _rotation_magnitude_from_signed(side_normalized, direction)


def _negate(vector: Dict[str, float]) -> Dict[str, float]:
    return {
        "x": -vector["x"],
        "y": -vector["y"],
        "z": -vector["z"],
    }


def _project_onto_plane_with_normal(vector: Dict[str, float], normal: Dict[str, float]) -> Dict[str, float]:
    normal_unit = normalize_3d(normal)
    projection = dot_product_3d(vector, normal_unit)
    return {
        "x": vector["x"] - projection * normal_unit["x"],
        "y": vector["y"] - projection * normal_unit["y"],
        "z": vector["z"] - projection * normal_unit["z"],
    }


def _signed_angle_about_axis(
    base_vector: Dict[str, float],
    target_vector: Dict[str, float],
    axis: Dict[str, float],
) -> float:
    axis_unit = normalize_3d(axis)
    base_projected = normalize_3d(_project_onto_plane_with_normal(base_vector, axis_unit))
    target_projected = normalize_3d(_project_onto_plane_with_normal(target_vector, axis_unit))

    if magnitude_3d(base_projected) == 0 or magnitude_3d(target_projected) == 0:
        return 0.0

    cross = cross_product_3d(base_projected, target_projected)
    dot = dot_product_3d(base_projected, target_projected)
    return math.degrees(math.atan2(dot_product_3d(cross, axis_unit), dot))


def _angle_magnitude_between(base_vector: Dict[str, float], target_vector: Dict[str, float], axis: Dict[str, float]) -> float:
    return abs(_signed_angle_about_axis(base_vector, target_vector, axis))


def _build_torso_frame(landmarks: List[Dict[str, float]]) -> Optional[Dict[str, Dict[str, float]]]:
    left_shoulder = _landmark_point(landmarks, LANDMARKS["LEFT_SHOULDER"])
    right_shoulder = _landmark_point(landmarks, LANDMARKS["RIGHT_SHOULDER"])
    left_hip = _landmark_point(landmarks, LANDMARKS["LEFT_HIP"])
    right_hip = _landmark_point(landmarks, LANDMARKS["RIGHT_HIP"])

    if not all([left_shoulder, right_shoulder, left_hip, right_hip]):
        return None

    shoulder_mid = _midpoint_3d(left_shoulder, right_shoulder)
    hip_mid = _midpoint_3d(left_hip, right_hip)
    up_seed = normalize_3d(_vector_3d(hip_mid, shoulder_mid))
    right_seed = normalize_3d(_vector_3d(left_shoulder, right_shoulder))
    forward_seed = normalize_3d(cross_product_3d(right_seed, up_seed))

    if magnitude_3d(up_seed) == 0 or magnitude_3d(right_seed) == 0 or magnitude_3d(forward_seed) == 0:
        return None

    nose = _landmark_point(landmarks, LANDMARKS["NOSE"])
    if nose:
        face_hint = _vector_3d(shoulder_mid, nose)
        if dot_product_3d(face_hint, forward_seed) < 0:
            forward_seed = _negate(forward_seed)

    right_axis = normalize_3d(cross_product_3d(up_seed, forward_seed))
    up_axis = normalize_3d(cross_product_3d(forward_seed, right_axis))
    forward_axis = normalize_3d(cross_product_3d(right_axis, up_axis))

    if magnitude_3d(right_axis) == 0 or magnitude_3d(up_axis) == 0 or magnitude_3d(forward_axis) == 0:
        return None

    return {
        "left_shoulder": left_shoulder,
        "right_shoulder": right_shoulder,
        "left_hip": left_hip,
        "right_hip": right_hip,
        "shoulder_mid": shoulder_mid,
        "hip_mid": hip_mid,
        "up": up_axis,
        "down": _negate(up_axis),
        "right": right_axis,
        "left": _negate(right_axis),
        "forward": forward_axis,
        "backward": _negate(forward_axis),
    }


def _directional_magnitude(signed_value: float, positive_direction: str, requested_direction: str) -> float:
    if requested_direction == positive_direction:
        return max(0.0, signed_value)
    return max(0.0, -signed_value)


def _first_projected_nonzero(
    normal: Dict[str, float],
    *candidates: Optional[Dict[str, float]],
) -> Optional[Dict[str, float]]:
    for candidate in candidates:
        if not candidate:
            continue
        projected = normalize_3d(_project_onto_plane_with_normal(candidate, normal))
        if magnitude_3d(projected) > 0:
            return projected
    return None


def _signed_toward_positive_hints(
    reference: Dict[str, float],
    target: Dict[str, float],
    axis: Dict[str, float],
    *positive_hints: Optional[Dict[str, float]],
) -> float:
    signed = _signed_angle_about_axis(reference, target, axis)
    for hint in positive_hints:
        if not hint:
            continue
        hint_signed = _signed_angle_about_axis(reference, hint, axis)
        if abs(hint_signed) > 1e-6:
            return signed if hint_signed > 0 else -signed
    return signed


def _calculate_cervical_canonical(
    direction: str,
    working_landmarks: List[Dict[str, float]],
) -> Optional[float]:
    frame = _build_torso_frame(working_landmarks)
    if not frame:
        return None

    nose = _landmark_point(working_landmarks, LANDMARKS["NOSE"])
    left_ear = _landmark_point(working_landmarks, LANDMARKS["LEFT_EAR"])
    right_ear = _landmark_point(working_landmarks, LANDMARKS["RIGHT_EAR"])
    if not all([nose, left_ear, right_ear]):
        return None

    ear_mid = _midpoint_3d(left_ear, right_ear)
    neck_axis = _vector_3d(frame["shoulder_mid"], ear_mid)
    face_axis = _vector_3d(ear_mid, nose)

    if direction in ["flexion", "extension"]:
        signed = _signed_angle_about_axis(frame["up"], neck_axis, frame["right"])
        return _directional_magnitude(signed, "flexion", direction)

    if direction in ["left-lateral-flexion", "right-lateral-flexion"]:
        signed = _signed_angle_about_axis(frame["up"], neck_axis, frame["backward"])
        return _directional_magnitude(signed, "right-lateral-flexion", direction)

    if direction in ["left-rotation", "right-rotation"]:
        signed = _signed_angle_about_axis(frame["forward"], face_axis, frame["up"])
        return _directional_magnitude(signed, "right-rotation", direction)

    return None


def _calculate_shoulder_canonical(
    direction: str,
    side: str,
    working_landmarks: List[Dict[str, float]],
) -> Optional[float]:
    frame = _build_torso_frame(working_landmarks)
    if not frame:
        return None

    shoulder = _landmark_point(working_landmarks, LANDMARKS["LEFT_SHOULDER"] if side == "left" else LANDMARKS["RIGHT_SHOULDER"])
    elbow = _landmark_point(working_landmarks, LANDMARKS["LEFT_ELBOW"] if side == "left" else LANDMARKS["RIGHT_ELBOW"])
    wrist = _landmark_point(working_landmarks, LANDMARKS["LEFT_WRIST"] if side == "left" else LANDMARKS["RIGHT_WRIST"])
    if not all([shoulder, elbow]):
        return None

    upper_arm = _vector_3d(shoulder, elbow)

    if direction in ["flexion", "extension"]:
        signed = _signed_angle_about_axis(frame["down"], upper_arm, frame["left"])
        return _directional_magnitude(signed, "flexion", direction)

    if direction in ["abduction", "adduction"]:
        signed = _signed_angle_about_axis(frame["down"], upper_arm, frame["backward"])
        return _directional_magnitude(signed, "abduction", direction)

    if direction in ["internal-rotation", "external-rotation"] and wrist:
        forearm = _vector_3d(elbow, wrist)
        reference = _project_onto_plane_with_normal(frame["forward"], upper_arm)
        if magnitude_3d(reference) == 0:
            reference = _project_onto_plane_with_normal(frame["up"], upper_arm)
        signed = _signed_angle_about_axis(reference, forearm, upper_arm)
        signed = signed if side == "right" else -signed
        return _directional_magnitude(signed, "external-rotation", direction)

    return None


def _calculate_hip_canonical(
    direction: str,
    side: str,
    working_landmarks: List[Dict[str, float]],
) -> Optional[float]:
    frame = _build_torso_frame(working_landmarks)
    if not frame:
        return None

    hip = _landmark_point(working_landmarks, LANDMARKS["LEFT_HIP"] if side == "left" else LANDMARKS["RIGHT_HIP"])
    knee = _landmark_point(working_landmarks, LANDMARKS["LEFT_KNEE"] if side == "left" else LANDMARKS["RIGHT_KNEE"])
    ankle = _landmark_point(working_landmarks, LANDMARKS["LEFT_ANKLE"] if side == "left" else LANDMARKS["RIGHT_ANKLE"])
    if not all([hip, knee]):
        return None

    thigh = _vector_3d(hip, knee)

    if direction in ["flexion", "extension"]:
        signed = _signed_angle_about_axis(frame["down"], thigh, frame["left"])
        return _directional_magnitude(signed, "flexion", direction)

    if direction in ["abduction", "adduction"]:
        signed = _signed_angle_about_axis(frame["down"], thigh, frame["backward"])
        return _directional_magnitude(signed, "abduction", direction)

    if direction in ["internal-rotation", "external-rotation"] and ankle:
        shank = _vector_3d(knee, ankle)
        reference = _project_onto_plane_with_normal(frame["forward"], thigh)
        if magnitude_3d(reference) == 0:
            reference = _project_onto_plane_with_normal(frame["up"], thigh)
        signed = _signed_angle_about_axis(reference, shank, thigh)
        signed = signed if side == "right" else -signed
        return _directional_magnitude(signed, "external-rotation", direction)

    return None


def _calculate_elbow_canonical(
    direction: str,
    side: str,
    working_landmarks: List[Dict[str, float]],
) -> Optional[float]:
    if direction not in ["flexion", "extension"]:
        return None

    frame = _build_torso_frame(working_landmarks)
    if not frame:
        return None

    shoulder = _landmark_point(working_landmarks, LANDMARKS["LEFT_SHOULDER"] if side == "left" else LANDMARKS["RIGHT_SHOULDER"])
    elbow = _landmark_point(working_landmarks, LANDMARKS["LEFT_ELBOW"] if side == "left" else LANDMARKS["RIGHT_ELBOW"])
    wrist = _landmark_point(working_landmarks, LANDMARKS["LEFT_WRIST"] if side == "left" else LANDMARKS["RIGHT_WRIST"])
    if not all([shoulder, elbow, wrist]):
        return None

    upper_arm = normalize_3d(_vector_3d(elbow, shoulder))
    forearm = _vector_3d(elbow, wrist)
    if magnitude_3d(upper_arm) == 0 or magnitude_3d(forearm) == 0:
        return None

    lateral_seed = frame["left"] if side == "left" else frame["right"]
    hinge_axis = _first_projected_nonzero(
        upper_arm,
        lateral_seed,
        frame["right"],
        frame["left"],
        frame["up"],
        frame["forward"],
    )
    if not hinge_axis:
        return None

    reference = _negate(upper_arm)
    signed = _signed_toward_positive_hints(
        reference,
        forearm,
        hinge_axis,
        frame["forward"],
        frame["up"],
        frame["backward"],
    )
    return _directional_magnitude(signed, "flexion", direction)


def _calculate_knee_canonical(
    direction: str,
    side: str,
    working_landmarks: List[Dict[str, float]],
) -> Optional[float]:
    if direction not in ["flexion", "extension"]:
        return None

    frame = _build_torso_frame(working_landmarks)
    if not frame:
        return None

    hip = _landmark_point(working_landmarks, LANDMARKS["LEFT_HIP"] if side == "left" else LANDMARKS["RIGHT_HIP"])
    knee = _landmark_point(working_landmarks, LANDMARKS["LEFT_KNEE"] if side == "left" else LANDMARKS["RIGHT_KNEE"])
    ankle = _landmark_point(working_landmarks, LANDMARKS["LEFT_ANKLE"] if side == "left" else LANDMARKS["RIGHT_ANKLE"])
    if not all([hip, knee, ankle]):
        return None

    thigh = normalize_3d(_vector_3d(knee, hip))
    shank = _vector_3d(knee, ankle)
    if magnitude_3d(thigh) == 0 or magnitude_3d(shank) == 0:
        return None

    lateral_seed = frame["left"] if side == "left" else frame["right"]
    hinge_axis = _first_projected_nonzero(
        thigh,
        lateral_seed,
        frame["right"],
        frame["left"],
        frame["up"],
    )
    if not hinge_axis:
        return None

    reference = _negate(thigh)
    signed = _signed_toward_positive_hints(
        reference,
        shank,
        hinge_axis,
        frame["backward"],
        frame["down"],
        frame["forward"],
    )
    return _directional_magnitude(signed, "flexion", direction)


def _calculate_ankle_canonical(
    direction: str,
    side: str,
    working_landmarks: List[Dict[str, float]],
) -> Optional[float]:
    if direction not in ["dorsiflexion", "plantarflexion"]:
        return None

    frame = _build_torso_frame(working_landmarks)
    if not frame:
        return None

    knee = _landmark_point(working_landmarks, LANDMARKS["LEFT_KNEE"] if side == "left" else LANDMARKS["RIGHT_KNEE"])
    ankle = _landmark_point(working_landmarks, LANDMARKS["LEFT_ANKLE"] if side == "left" else LANDMARKS["RIGHT_ANKLE"])
    foot = _landmark_point(working_landmarks, LANDMARKS["LEFT_FOOT_INDEX"] if side == "left" else LANDMARKS["RIGHT_FOOT_INDEX"])
    if not all([knee, ankle, foot]):
        return None

    shank = normalize_3d(_vector_3d(ankle, knee))
    foot_vector = _vector_3d(ankle, foot)
    if magnitude_3d(shank) == 0 or magnitude_3d(foot_vector) == 0:
        return None

    lateral_seed = frame["left"] if side == "left" else frame["right"]
    hinge_axis = _first_projected_nonzero(
        shank,
        lateral_seed,
        frame["right"],
        frame["left"],
    )
    if not hinge_axis:
        return None

    neutral_foot = _first_projected_nonzero(
        hinge_axis,
        frame["forward"],
        frame["backward"],
    )
    if not neutral_foot:
        return None

    signed = _signed_toward_positive_hints(
        neutral_foot,
        foot_vector,
        hinge_axis,
        shank,
        frame["up"],
    )
    return _directional_magnitude(signed, "dorsiflexion", direction)


def _normalize_rom_plugin_direction(joint_type: str, direction: str) -> str:
    canonical_direction = normalize_rom_direction(joint_type, direction)

    if joint_type == "cervical":
        mapping = {
            "left-rotation": "internal_rotation",
            "right-rotation": "external_rotation",
            "left-lateral-flexion": "abduction",
            "right-lateral-flexion": "adduction",
        }
        return mapping.get(canonical_direction, canonical_direction)

    if joint_type == "wrist":
        mapping = {
            "radial-deviation": "abduction",
            "ulnar-deviation": "adduction",
        }
        canonical_direction = mapping.get(canonical_direction, canonical_direction)

    if joint_type == "ankle":
        mapping = {
            "dorsiflexion": "flexion",
            "plantarflexion": "extension",
        }
        canonical_direction = mapping.get(canonical_direction, canonical_direction)

    return canonical_direction.replace("-", "_")


def _calculate_rom_plugin_joint_angle(
    joint_type: str,
    direction: str,
    landmarks: List[Dict[str, float]],
    side: Optional[str] = None,
    world_landmarks: Optional[List[Dict[str, float]]] = None,
) -> Optional[float]:
    working_landmarks = world_landmarks if world_landmarks and len(world_landmarks) > 0 else landmarks
    canonical_direction = normalize_rom_direction(joint_type, direction)
    normalized_direction = _normalize_rom_plugin_direction(joint_type, direction)
    if not working_landmarks or len(working_landmarks) <= LANDMARKS["RIGHT_FOOT_INDEX"]:
        return None

    def point(name: str) -> Optional[Dict[str, float]]:
        return _landmark_point(working_landmarks, LANDMARKS[name])

    try:
        if joint_type == "cervical":
            canonical_direction = {
                "abduction": "left-lateral-flexion",
                "adduction": "right-lateral-flexion",
                "internal_rotation": "left-rotation",
                "external_rotation": "right-rotation",
            }.get(normalized_direction, normalized_direction)
            return _calculate_cervical_canonical(canonical_direction, working_landmarks)

        side = "right" if side == "right" else "left"
        if joint_type == "shoulder":
            canonical_direction = normalized_direction.replace("_", "-")
            canonical = _calculate_shoulder_canonical(canonical_direction, side, working_landmarks)
            if canonical is not None:
                return canonical

        if joint_type == "hip":
            canonical_direction = normalized_direction.replace("_", "-")
            canonical = _calculate_hip_canonical(canonical_direction, side, working_landmarks)
            if canonical is not None:
                return canonical

        if joint_type == "elbow":
            canonical = _calculate_elbow_canonical(canonical_direction, side, working_landmarks)
            if canonical is not None:
                return canonical

        if joint_type == "knee":
            canonical = _calculate_knee_canonical(canonical_direction, side, working_landmarks)
            if canonical is not None:
                return canonical

        if joint_type == "ankle":
            canonical = _calculate_ankle_canonical(canonical_direction, side, working_landmarks)
            if canonical is not None:
                return canonical

        shoulder = point("LEFT_SHOULDER" if side == "left" else "RIGHT_SHOULDER")
        elbow = point("LEFT_ELBOW" if side == "left" else "RIGHT_ELBOW")
        wrist = point("LEFT_WRIST" if side == "left" else "RIGHT_WRIST")
        hip = point("LEFT_HIP" if side == "left" else "RIGHT_HIP")
        knee = point("LEFT_KNEE" if side == "left" else "RIGHT_KNEE")
        ankle = point("LEFT_ANKLE" if side == "left" else "RIGHT_ANKLE")
        foot = point("LEFT_FOOT_INDEX" if side == "left" else "RIGHT_FOOT_INDEX")
        hand = point("LEFT_INDEX" if side == "left" else "RIGHT_INDEX")
        contra_shoulder = point("RIGHT_SHOULDER" if side == "left" else "LEFT_SHOULDER")
        contra_hip = point("RIGHT_HIP" if side == "left" else "LEFT_HIP")

        if joint_type == "shoulder":
            if not all([shoulder, elbow, hip, contra_shoulder]):
                return None
            torso_vector = _vector_3d(shoulder, hip)
            arm_vector = _vector_3d(shoulder, elbow)
            shoulder_line = _vector_3d(shoulder, contra_shoulder)
            if normalized_direction in ["flexion", "extension"]:
                return _same_line_on_plane(torso_vector, arm_vector, "yz")
            if normalized_direction in ["abduction", "adduction"]:
                return _same_line_on_plane(torso_vector, arm_vector, "xy")
            return _rotation_on_plane(shoulder_line, arm_vector, "xz", normalized_direction, side)

        if joint_type == "elbow":
            if not all([shoulder, elbow, wrist]):
                return None
            upper_arm = _vector_3d(elbow, shoulder)
            forearm = _vector_3d(elbow, wrist)
            if normalized_direction in ["flexion", "extension"]:
                return _straight_on_plane(upper_arm, forearm, "yz")
            if normalized_direction in ["abduction", "adduction"]:
                return _straight_on_plane(upper_arm, forearm, "xy")
            return _rotation_on_plane(upper_arm, forearm, "xz", normalized_direction, side)

        if joint_type == "wrist":
            if not all([elbow, wrist, hand]):
                return None
            forearm = _vector_3d(wrist, elbow)
            hand_vector = _vector_3d(wrist, hand)
            if normalized_direction in ["flexion", "extension"]:
                return _straight_on_plane(forearm, hand_vector, "yz")
            if normalized_direction in ["abduction", "adduction"]:
                return _straight_on_plane(forearm, hand_vector, "xy")
            return _rotation_on_plane(forearm, hand_vector, "xz", normalized_direction, side)

        if joint_type == "hip":
            if not all([shoulder, hip, knee, contra_hip]):
                return None
            trunk = _vector_3d(hip, shoulder)
            thigh = _vector_3d(hip, knee)
            pelvis_line = _vector_3d(hip, contra_hip)
            if normalized_direction in ["flexion", "extension"]:
                return _straight_on_plane(trunk, thigh, "yz")
            if normalized_direction in ["abduction", "adduction"]:
                return _straight_on_plane(trunk, thigh, "xy")
            return _rotation_on_plane(pelvis_line, thigh, "xz", normalized_direction, side)

        if joint_type == "knee":
            if not all([hip, knee, ankle]):
                return None
            thigh = _vector_3d(knee, hip)
            shank = _vector_3d(knee, ankle)
            if normalized_direction in ["flexion", "extension"]:
                return _straight_on_plane(thigh, shank, "yz")
            if normalized_direction in ["abduction", "adduction"]:
                return _straight_on_plane(thigh, shank, "xy")
            return _rotation_on_plane(thigh, shank, "xz", normalized_direction, side)

        if joint_type == "ankle":
            if not all([knee, ankle, foot]):
                return None
            shank = _vector_3d(ankle, knee)
            foot_vector = _vector_3d(ankle, foot)
            if normalized_direction in ["flexion", "extension"]:
                return _same_line_on_plane(shank, foot_vector, "yz")
            if normalized_direction in ["abduction", "adduction"]:
                return _same_line_on_plane(shank, foot_vector, "xy")
            return _rotation_on_plane(shank, foot_vector, "xz", normalized_direction, side)
    except Exception:
        return None

    return None

def calculate_joint_angle(
    joint_type: str,
    direction: str,
    landmarks: List[Dict[str, float]],
    width: int,
    height: int,
    side: Optional[str] = None,
    world_landmarks: Optional[List[Dict[str, float]]] = None,
    calculation_profile: Optional[str] = None,
) -> Optional[float]:
    if not landmarks or len(landmarks) == 0:
        return None

    try:
        direction = normalize_rom_direction(joint_type, direction)
        if joint_type == "cervical":
            canonical = _calculate_cervical_canonical(direction, world_landmarks if world_landmarks else landmarks)
            if canonical is not None:
                return canonical

        if joint_type == "shoulder" and side:
            canonical = _calculate_shoulder_canonical(direction, side, world_landmarks if world_landmarks else landmarks)
            if canonical is not None:
                return canonical

        if joint_type == "hip" and side:
            canonical = _calculate_hip_canonical(direction, side, world_landmarks if world_landmarks else landmarks)
            if canonical is not None:
                return canonical

        if joint_type == "elbow" and side:
            canonical = _calculate_elbow_canonical(direction, side, world_landmarks if world_landmarks else landmarks)
            if canonical is not None:
                return canonical

        if joint_type == "knee" and side:
            canonical = _calculate_knee_canonical(direction, side, world_landmarks if world_landmarks else landmarks)
            if canonical is not None:
                return canonical

        if joint_type == "ankle" and side:
            canonical = _calculate_ankle_canonical(direction, side, world_landmarks if world_landmarks else landmarks)
            if canonical is not None:
                return canonical

        if calculation_profile == "rom-plugin":
            return _calculate_rom_plugin_joint_angle(
                joint_type=joint_type,
                direction=direction,
                landmarks=landmarks,
                side=side,
                world_landmarks=world_landmarks,
            )
        if joint_type == 'cervical':
            return calculate_cervical_rom(direction, landmarks, width, height, world_landmarks)
        elif joint_type == 'shoulder':
            return calculate_shoulder_rom(direction, side, landmarks, width, height)
        elif joint_type == 'thoracolumbar':
            return calculate_thoracolumbar_rom(direction, landmarks, width, height)
        elif joint_type == 'elbow':
            return calculate_elbow_rom(direction, side, landmarks, width, height)
        elif joint_type == 'wrist':
            return calculate_wrist_rom(direction, side, landmarks, width, height)
        elif joint_type == 'hip':
            return calculate_hip_rom(direction, side, landmarks, width, height)
        elif joint_type == 'knee':
            return calculate_knee_rom(direction, side, landmarks, width, height)
        elif joint_type == 'ankle':
            return calculate_ankle_rom(direction, side, landmarks, width, height)
        else:
            return None
    except Exception as e:
        print(f"Error calculating angle for {joint_type} {direction}: {e}")
        return None

def calculate_cervical_rom(direction, landmarks, width, height, world_landmarks=None):
    if world_landmarks and len(world_landmarks) > 0:
        nose = world_landmarks[LANDMARKS['NOSE']]
        left_ear = world_landmarks[LANDMARKS['LEFT_EAR']]
        right_ear = world_landmarks[LANDMARKS['RIGHT_EAR']]
        left_shoulder = world_landmarks[LANDMARKS['LEFT_SHOULDER']]
        right_shoulder = world_landmarks[LANDMARKS['RIGHT_SHOULDER']]
        
        ear_mid = calculate_midpoint_3d(left_ear, right_ear)
        shoulder_mid = calculate_midpoint_3d(left_shoulder, right_shoulder)
        hip_mid = calculate_midpoint_3d(world_landmarks[LANDMARKS['LEFT_HIP']], world_landmarks[LANDMARKS['RIGHT_HIP']])

        torso_up = normalize_3d(calculate_vector_3d(hip_mid, shoulder_mid))
        torso_right = normalize_3d(calculate_vector_3d(left_shoulder, right_shoulder))
        torso_forward = cross_product_3d(torso_right, torso_up)
        torso_right_ortho = normalize_3d(cross_product_3d(torso_up, torso_forward))

        if direction in ['flexion', 'extension']:
            neck_vector = calculate_vector_3d(shoulder_mid, ear_mid)
            dot_right = dot_product_3d(neck_vector, torso_right_ortho)
            neck_sagittal = {
                "x": neck_vector["x"] - dot_right * torso_right_ortho["x"],
                "y": neck_vector["y"] - dot_right * torso_right_ortho["y"],
                "z": neck_vector["z"] - dot_right * torso_right_ortho["z"]
            }
            y_sag = dot_product_3d(neck_sagittal, torso_up)
            x_sag = dot_product_3d(neck_sagittal, torso_forward)
            angle_sag = math.atan2(x_sag, y_sag) * (180 / math.pi)
            return angle_sag if direction == 'flexion' else -angle_sag

        elif direction in ['left-lateral-flexion', 'right-lateral-flexion']:
            neck_vector = calculate_vector_3d(shoulder_mid, ear_mid)
            dot_fwd = dot_product_3d(neck_vector, torso_forward)
            neck_coronal = {
                "x": neck_vector["x"] - dot_fwd * torso_forward["x"],
                "y": neck_vector["y"] - dot_fwd * torso_forward["y"],
                "z": neck_vector["z"] - dot_fwd * torso_forward["z"]
            }
            y_cor = dot_product_3d(neck_coronal, torso_up)
            x_cor = dot_product_3d(neck_coronal, torso_right_ortho)
            angle_cor = math.atan2(x_cor, y_cor) * (180 / math.pi)
            return angle_cor if direction == 'right-lateral-flexion' else -angle_cor

        elif direction in ['left-rotation', 'right-rotation']:
            ear_line = calculate_vector_3d(left_ear, right_ear)
            dot_up = dot_product_3d(ear_line, torso_up)
            ear_transverse = {
                "x": ear_line["x"] - dot_up * torso_up["x"],
                "y": ear_line["y"] - dot_up * torso_up["y"],
                "z": ear_line["z"] - dot_up * torso_up["z"]
            }
            x_trans = dot_product_3d(ear_transverse, torso_right_ortho)
            y_trans = dot_product_3d(ear_transverse, torso_forward)
            angle_rot = math.atan2(y_trans, x_trans) * (180 / math.pi)
            return angle_rot if direction == 'left-rotation' else -angle_rot

    # 2D Fallback
    nose = get_pixel_coords(landmarks[LANDMARKS['NOSE']], width, height)
    left_ear = get_pixel_coords(landmarks[LANDMARKS['LEFT_EAR']], width, height)
    right_ear = get_pixel_coords(landmarks[LANDMARKS['RIGHT_EAR']], width, height)
    ear_mid = calculate_midpoint(left_ear, right_ear)
    
    left_shoulder = get_pixel_coords(landmarks[LANDMARKS['LEFT_SHOULDER']], width, height)
    right_shoulder = get_pixel_coords(landmarks[LANDMARKS['RIGHT_SHOULDER']], width, height)
    shoulder_mid = calculate_midpoint(left_shoulder, right_shoulder)
    
    left_hip = get_pixel_coords(landmarks[LANDMARKS['LEFT_HIP']], width, height)
    right_hip = get_pixel_coords(landmarks[LANDMARKS['RIGHT_HIP']], width, height)
    hip_mid = calculate_midpoint(left_hip, right_hip)

    if direction in ['flexion', 'extension']:
        v_torso = {"x": shoulder_mid["x"] - hip_mid["x"], "y": shoulder_mid["y"] - hip_mid["y"]}
        v_head = {"x": ear_mid["x"] - shoulder_mid["x"], "y": ear_mid["y"] - shoulder_mid["y"]}
        angle_rad = math.atan2(v_head["y"], v_head["x"]) - math.atan2(v_torso["y"], v_torso["x"])
        angle_deg = math.degrees(angle_rad)
        while angle_deg <= -180: angle_deg += 360
        while angle_deg > 180: angle_deg -= 360
        is_facing_left = nose["x"] < left_ear["x"]
        return -angle_deg if is_facing_left else angle_deg
    
    elif direction in ['left-rotation', 'right-rotation']:
        n = landmarks[LANDMARKS['NOSE']]
        le = landmarks[LANDMARKS['LEFT_EAR']]
        re = landmarks[LANDMARKS['RIGHT_EAR']]
        if 'z' not in n or 'z' not in le or 'z' not in re: return 0.0
        mid_ear_z = (le['z'] + re['z']) / 2
        mid_ear_x = (le['x'] + re['x']) / 2
        vec_head = {"x": n['x'] - mid_ear_x, "z": n['z'] - mid_ear_z}
        z_scale = 2.5
        yaw_angle = math.atan2(vec_head['x'], -vec_head['z'] * z_scale) * (180 / math.pi)
        return -yaw_angle if direction == 'left-rotation' else yaw_angle

    elif direction in ['left-lateral-flexion', 'right-lateral-flexion']:
        v_torso = {"x": shoulder_mid["x"] - hip_mid["x"], "y": shoulder_mid["y"] - hip_mid["y"]}
        v_head = {"x": ear_mid["x"] - shoulder_mid["x"], "y": ear_mid["y"] - shoulder_mid["y"]}
        angle_rad = math.atan2(v_head["y"], v_head["x"]) - math.atan2(v_torso["y"], v_torso["x"])
        angle_deg = math.degrees(angle_rad)
        while angle_deg <= -180: angle_deg += 360
        while angle_deg > 180: angle_deg -= 360
        return -angle_deg

    return 0.0

def calculate_shoulder_rom(direction, side, landmarks, width, height):
    if not side: return 0.0
    get_p = lambda idx: get_pixel_coords(landmarks[idx], width, height)
    shoulder = get_p(LANDMARKS['LEFT_SHOULDER'] if side == 'left' else LANDMARKS['RIGHT_SHOULDER'])
    elbow = get_p(LANDMARKS['LEFT_ELBOW'] if side == 'left' else LANDMARKS['RIGHT_ELBOW'])
    hip = get_p(LANDMARKS['LEFT_HIP'] if side == 'left' else LANDMARKS['RIGHT_HIP'])
    opp_shoulder = get_p(LANDMARKS['RIGHT_SHOULDER'] if side == 'left' else LANDMARKS['LEFT_SHOULDER'])
    wrist = get_p(LANDMARKS['LEFT_WRIST'] if side == 'left' else LANDMARKS['RIGHT_WRIST'])

    if direction in ['flexion', 'extension']:
        # Vector from shoulder to hip (representing the torso)
        v_torso = {"x": hip["x"] - shoulder["x"], "y": hip["y"] - shoulder["y"]}
        # Vector from shoulder to elbow (representing the upper arm)
        v_arm = {"x": elbow["x"] - shoulder["x"], "y": elbow["y"] - shoulder["y"]}
        
        # Calculate signed angle from torso to arm
        angle = calculate_signed_angle_between_vectors_2d(v_torso, v_arm)
        
        # In a typical side view (facing left/right):
        # Forward movement (flexion) and backward movement (extension)
        # The sign depends on which way the user is facing.
        # We'll return the absolute angle for now as a simple ROM measure,
        # but the direction could be used to separate them.
        if direction == 'flexion':
            return abs(angle) if angle > 0 else 0.0 # Adjusted based on test results
        else:
            return abs(angle) if angle < 0 else 0.0

    elif direction in ['abduction', 'adduction']:
        v_torso = {"x": hip["x"] - shoulder["x"], "y": hip["y"] - shoulder["y"]}
        v_arm = {"x": elbow["x"] - shoulder["x"], "y": elbow["y"] - shoulder["y"]}
        angle = calculate_signed_angle_between_vectors_2d(v_torso, v_arm)
        
        # Based on test: v_torso (0, 0.3), v_arm (-0.3, 0) -> angle 90
        # For left shoulder, abduction (away from body) is 90
        if side == 'left':
            if direction == 'abduction': return max(0, angle)
            else: return max(0, -angle)
        else:
            if direction == 'abduction': return max(0, -angle)
            else: return max(0, angle)

    elif direction in ['internal-rotation', 'external-rotation']:
        # Simplified rotation logic using 2D projection
        # angle between forearm and torso line
        return abs(calculate_angle(shoulder, elbow, wrist) - 90)
    return 0.0

def calculate_thoracolumbar_rom(direction, landmarks, width, height):
    get_p = lambda idx: get_pixel_coords(landmarks[idx], width, height)
    l_shoulder = get_p(LANDMARKS['LEFT_SHOULDER'])
    r_shoulder = get_p(LANDMARKS['RIGHT_SHOULDER'])
    shoulder_mid = calculate_midpoint(l_shoulder, r_shoulder)
    
    l_hip = get_p(LANDMARKS['LEFT_HIP'])
    r_hip = get_p(LANDMARKS['RIGHT_HIP'])
    hip_mid = calculate_midpoint(l_hip, r_hip)

    # Vector from hip to shoulder (representing the torso)
    v_torso = {"x": shoulder_mid["x"] - hip_mid["x"], "y": shoulder_mid["y"] - hip_mid["y"]}
    
    if direction in ['flexion', 'extension']:
        # In side view, we compare torso vector to vertical
        # Assuming facing side, vertical is (0, -1)
        v_vertical = {"x": 0, "y": -1}
        angle = calculate_angle_between_vectors_2d(v_vertical, v_torso)
        
        # Determine if it's flexion or extension based on relative position
        # This usually requires knowing which way the user is facing.
        # For simplicity, we'll return the absolute deviation from vertical.
        return angle

    elif direction in ['left-lateral-flexion', 'right-lateral-flexion']:
        # In front view, compare torso vector to vertical
        v_vertical = {"x": 0, "y": -1}
        angle = calculate_signed_angle_between_vectors_2d(v_vertical, v_torso)
        
        if direction == 'right-lateral-flexion':
            return max(0, angle)
        else:
            return max(0, -angle)

    return 0.0

def calculate_elbow_rom(direction, side, landmarks, width, height):
    if not side: return 0.0
    get_p = lambda idx: get_pixel_coords(landmarks[idx], width, height)
    shoulder = get_p(LANDMARKS['LEFT_SHOULDER'] if side == 'left' else LANDMARKS['RIGHT_SHOULDER'])
    elbow = get_p(LANDMARKS['LEFT_ELBOW'] if side == 'left' else LANDMARKS['RIGHT_ELBOW'])
    wrist = get_p(LANDMARKS['LEFT_WRIST'] if side == 'left' else LANDMARKS['RIGHT_WRIST'])
    
    # Vector from elbow to shoulder (upper arm)
    v_upper = {"x": shoulder["x"] - elbow["x"], "y": shoulder["y"] - elbow["y"]}
    # Vector from elbow to wrist (forearm)
    v_forearm = {"x": wrist["x"] - elbow["x"], "y": wrist["y"] - elbow["y"]}
    
    angle = calculate_signed_angle_between_vectors_2d(v_upper, v_forearm)
    
    # Fully extended is 180 degrees. Let's normalize so 0 is fully extended.
    if angle > 0: norm_angle = 180 - angle
    else: norm_angle = 180 + angle
    
    if direction == 'flexion':
        return abs(norm_angle)
    elif direction == 'extension':
        # Extension beyond straight is hyperextension, usually small or 0
        return max(0, -norm_angle) if angle > 0 else max(0, norm_angle) # Simplified
    
    return abs(norm_angle)

def calculate_knee_rom(direction, side, landmarks, width, height):
    if not side: return 0.0
    get_p = lambda idx: get_pixel_coords(landmarks[idx], width, height)
    hip = get_p(LANDMARKS['LEFT_HIP'] if side == 'left' else LANDMARKS['RIGHT_HIP'])
    knee = get_p(LANDMARKS['LEFT_KNEE'] if side == 'left' else LANDMARKS['RIGHT_KNEE'])
    ankle = get_p(LANDMARKS['LEFT_ANKLE'] if side == 'left' else LANDMARKS['RIGHT_ANKLE'])
    
    # Vector from knee to hip (thigh)
    v_thigh = {"x": hip["x"] - knee["x"], "y": hip["y"] - knee["y"]}
    # Vector from knee to ankle (calf)
    v_calf = {"x": ankle["x"] - knee["x"], "y": ankle["y"] - knee["y"]}
    
    angle = calculate_signed_angle_between_vectors_2d(v_thigh, v_calf)
    
    # Normalize so 0 is straight (180 degrees)
    if angle > 0: norm_angle = 180 - angle
    else: norm_angle = 180 + angle
    
    return abs(norm_angle)

def calculate_hip_rom(direction, side, landmarks, width, height):
    if not side: return 0.0
    get_p = lambda idx: get_pixel_coords(landmarks[idx], width, height)
    shoulder = get_p(LANDMARKS['LEFT_SHOULDER'] if side == 'left' else LANDMARKS['RIGHT_SHOULDER'])
    hip = get_p(LANDMARKS['LEFT_HIP'] if side == 'left' else LANDMARKS['RIGHT_HIP'])
    knee = get_p(LANDMARKS['LEFT_KNEE'] if side == 'left' else LANDMARKS['RIGHT_KNEE'])
    
    # Vector from hip to shoulder (torso)
    v_torso = {"x": shoulder["x"] - hip["x"], "y": shoulder["y"] - hip["y"]}
    # Vector from hip to knee (thigh)
    v_thigh = {"x": knee["x"] - hip["x"], "y": knee["y"] - hip["y"]}
    
    angle = calculate_signed_angle_between_vectors_2d(v_torso, v_thigh)
    
    # Normalize so 0 is straight
    if angle > 0: norm_angle = 180 - angle
    else: norm_angle = 180 + angle
    
    if direction == 'flexion':
        return abs(norm_angle) if norm_angle > 0 else 0.0
    elif direction == 'extension':
        return abs(norm_angle) if norm_angle < 0 else 0.0
        
    return abs(norm_angle)

def calculate_wrist_rom(direction, side, landmarks, width, height):
    if not side: return 0.0
    get_p = lambda idx: get_pixel_coords(landmarks[idx], width, height)
    elbow = get_p(LANDMARKS['LEFT_ELBOW'] if side == 'left' else LANDMARKS['RIGHT_ELBOW'])
    wrist = get_p(LANDMARKS['LEFT_WRIST'] if side == 'left' else LANDMARKS['RIGHT_WRIST'])
    index = get_p(LANDMARKS['LEFT_INDEX'] if side == 'left' else LANDMARKS['RIGHT_INDEX'])
    
    # Vector from wrist to elbow (forearm)
    v_forearm = {"x": elbow["x"] - wrist["x"], "y": elbow["y"] - wrist["y"]}
    # Vector from wrist to index finger (hand)
    v_hand = {"x": index["x"] - wrist["x"], "y": index["y"] - wrist["y"]}
    
    angle = calculate_signed_angle_between_vectors_2d(v_forearm, v_hand)
    
    # When forearm and hand are aligned, angle is 180 (signed angle will be 180 or -180)
    # Let's normalize so that 0 is aligned
    if angle > 0: angle -= 180
    else: angle += 180
    
    if direction == 'flexion':
        return abs(angle)
    elif direction == 'extension':
        return abs(angle)
    elif direction == 'ulnar-deviation':
        # Vector from wrist to elbow (forearm)
        v_forearm = {"x": elbow["x"] - wrist["x"], "y": elbow["y"] - wrist["y"]}
        # Vector from wrist to pinky finger
        pinky = get_p(LANDMARKS['LEFT_PINKY'] if side == 'left' else LANDMARKS['RIGHT_PINKY'])
        v_pinky = {"x": pinky["x"] - wrist["x"], "y": pinky["y"] - wrist["y"]}
        angle = calculate_signed_angle_between_vectors_2d(v_forearm, v_pinky)
        # Normalize and determine deviation
        return abs(angle - 180) if angle > 0 else abs(angle + 180)
    elif direction == 'radial-deviation':
        # Vector from wrist to elbow (forearm)
        v_forearm = {"x": elbow["x"] - wrist["x"], "y": elbow["y"] - wrist["y"]}
        # Vector from wrist to thumb
        thumb = get_p(LANDMARKS['LEFT_THUMB'] if side == 'left' else LANDMARKS['RIGHT_THUMB'])
        v_thumb = {"x": thumb["x"] - wrist["x"], "y": thumb["y"] - wrist["y"]}
        angle = calculate_signed_angle_between_vectors_2d(v_forearm, v_thumb)
        return abs(angle - 180) if angle > 0 else abs(angle + 180)
    
    return abs(angle)

def calculate_ankle_rom(direction, side, landmarks, width, height):
    if not side: return 0.0
    get_p = lambda idx: get_pixel_coords(landmarks[idx], width, height)
    knee = get_p(LANDMARKS['LEFT_KNEE'] if side == 'left' else LANDMARKS['RIGHT_KNEE'])
    ankle = get_p(LANDMARKS['LEFT_ANKLE'] if side == 'left' else LANDMARKS['RIGHT_ANKLE'])
    foot = get_p(LANDMARKS['LEFT_FOOT_INDEX'] if side == 'left' else LANDMARKS['RIGHT_FOOT_INDEX'])
    
    # Vector from ankle to knee
    v_calf = {"x": knee["x"] - ankle["x"], "y": knee["y"] - ankle["y"]}
    # Vector from ankle to foot
    v_foot = {"x": foot["x"] - ankle["x"], "y": foot["y"] - ankle["y"]}
    
    angle = calculate_signed_angle_between_vectors_2d(v_calf, v_foot)
    
    # Neutral ankle is ~90 degrees. Normalize so 0 is neutral.
    # angle is likely around 90 or -90.
    if angle > 0: norm_angle = 90 - angle
    else: norm_angle = -90 - angle
    
    if direction == 'dorsiflexion':
        return abs(norm_angle) # Simplified
    elif direction == 'plantarflexion':
        return abs(norm_angle) # Simplified
        
    return abs(norm_angle)
