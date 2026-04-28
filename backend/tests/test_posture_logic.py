import os
import sys

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.posture_analysis import analyze_posture
from models import Landmark


def test_analyze_posture_side_annotations():
    landmarks = [Landmark(x=0.5, y=0.5) for _ in range(33)]
    landmarks[11] = Landmark(x=0.5, y=0.5)
    landmarks[7] = Landmark(x=0.6, y=0.4)
    landmarks[23] = Landmark(x=0.5, y=0.8)
    landmarks[0] = Landmark(x=0.65, y=0.3)

    result = analyze_posture("side", landmarks, 1000, 1000)

    assert "annotations" in result
    annotations = result["annotations"]
    types = [a.type for a in annotations]
    assert "line" in types

    plumb_line = next((a for a in annotations if a.type == "line" and a.color == "rgba(255, 255, 0, 0.8)"), None)
    assert plumb_line is not None
    assert plumb_line.lineWidth == 2
    assert plumb_line.color == "rgba(255, 255, 0, 0.8)"

    issues = result["issues"]
    assert any(issue.id == "head-forward" for issue in issues)


def test_analyze_posture_front_annotations():
    landmarks = [Landmark(x=0.5, y=0.5) for _ in range(33)]
    landmarks[11] = Landmark(x=0.4, y=0.3)
    landmarks[12] = Landmark(x=0.6, y=0.35)
    landmarks[23] = Landmark(x=0.45, y=0.7)
    landmarks[24] = Landmark(x=0.55, y=0.7)
    landmarks[0] = Landmark(x=0.52, y=0.2)
    landmarks[27] = Landmark(x=0.45, y=0.9)
    landmarks[28] = Landmark(x=0.55, y=0.9)

    result = analyze_posture("front", landmarks, 1000, 1000)

    assert "annotations" in result
    annotations = result["annotations"]
    labels = [a.label for a in annotations if a.label]
    assert any("中轴" in label or "重心" in label for label in labels)
    assert any("肩偏高" in label for label in labels)

    issue_ids = [i.id for i in result["issues"]]
    assert "uneven-shoulders" in issue_ids
    assert "midline-shift" in issue_ids
    assert result["metrics"].shoulderHighSide == "left"


def test_analyze_posture_head_tilt():
    landmarks = [Landmark(x=0.5, y=0.5) for _ in range(33)]
    landmarks[7] = Landmark(x=0.45, y=0.2)
    landmarks[8] = Landmark(x=0.55, y=0.25)

    result = analyze_posture("front", landmarks, 1000, 1000)

    issue_ids = [i.id for i in result["issues"]]
    assert "head-tilt" in issue_ids

    annotations = result["annotations"]
    labels = [a.label for a in annotations if a.label]
    assert any("倾斜" in label or "头" in label for label in labels)

    metrics = result["metrics"]
    assert metrics.headRoll is not None
    assert metrics.headPitch is not None
    assert metrics.headYaw is not None
