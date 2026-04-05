from fastapi import APIRouter, HTTPException
from typing import Dict
from app.schemas.assessment import AssessmentRequest, AssessmentResponse, ApiEnvelopeAssessmentResponse
from app.services.json_store import (
    ASSESSMENT_RESULTS_FILE,
    build_id,
    normalize_assessment_result,
    read_json_array,
    write_json_array,
)
import math

router = APIRouter()

def calculate_angle(a_x, a_y, b_x, b_y, c_x, c_y):
    """
    计算三点之间的夹角 (A-B-C), B是顶点
    """
    # 向量 BA
    ba_x = a_x - b_x
    ba_y = a_y - b_y
    # 向量 BC
    bc_x = c_x - b_x
    bc_y = c_y - b_y
    
    # 点积
    dot_product = ba_x * bc_x + ba_y * bc_y
    
    # 模长
    len_ba = math.sqrt(ba_x**2 + ba_y**2)
    len_bc = math.sqrt(bc_x**2 + bc_y**2)
    
    if len_ba * len_bc == 0:
        return 0.0
        
    cosine_angle = dot_product / (len_ba * len_bc)
    # 防止浮点误差超出 [-1, 1]
    cosine_angle = max(-1.0, min(1.0, cosine_angle))
    
    angle = math.degrees(math.acos(cosine_angle))
    return angle

@router.post("/analyze", response_model=ApiEnvelopeAssessmentResponse)
async def analyze_movement(request: AssessmentRequest):
    """
    接收关键点数据，返回评估结果
    目前是 MVP 版本，仅做简单的规则判断
    """
    try:
        # 1. 解析关键点
        # MoveNet / PoseNet keypoints map needs to be known.
        # 假设前端传来的 keypoints 已经包含 name 字段 (康复宝 前端逻辑似乎是这样)
        # 如果没有 name，需要根据索引映射。这里先假设有 name 或者通过索引查找
        
        kp_map = {kp.name: kp for kp in request.keypoints if kp.name}
        
        # 如果没有 name，尝试使用索引 (MoveNet standard)
        if not kp_map and len(request.keypoints) >= 17:
             names = [
                "nose", "left_eye", "right_eye", "left_ear", "right_ear",
                "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
                "left_wrist", "right_wrist", "left_hip", "right_hip",
                "left_knee", "right_knee", "left_ankle", "right_ankle"
            ]
             for i, name in enumerate(names):
                 if i < len(request.keypoints):
                     kp_map[name] = request.keypoints[i]
        
        angles = dict(request.angles or {})
        score = 60.0 # 基础分
        feedback = "动作分析中..."
        
        # 2. 针对不同动作的简单逻辑 (示例：深蹲)
        if "squat" in request.movementType.lower():
            # 计算膝关节角度 (Hip - Knee - Ankle)
            if "left_hip" in kp_map and "left_knee" in kp_map and "left_ankle" in kp_map:
                l_hip = kp_map["left_hip"]
                l_knee = kp_map["left_knee"]
                l_ankle = kp_map["left_ankle"]
                
                l_knee_angle = calculate_angle(l_hip.x, l_hip.y, l_knee.x, l_knee.y, l_ankle.x, l_ankle.y)
                angles["left_knee_angle"] = round(l_knee_angle, 1)
                
                # 简单的评分逻辑
                if l_knee_angle < 100:
                    score = 90.0
                    feedback = "深蹲深度良好！"
                elif l_knee_angle < 130:
                    score = 75.0
                    feedback = "下蹲深度还可以更深一点。"
                else:
                    score = 60.0
                    feedback = "请尝试下蹲得更深一些。"
            else:
                feedback = "未检测到完整的腿部关键点"
                
        else:
            # 通用反馈
            score = 80.0
            feedback = f"已收到 {request.movementType} 动作数据，后端分析引擎运行正常。"

        from datetime import datetime, timezone

        overall_value = round(score, 1)
        recommendations = [feedback]
        if overall_value < 70:
            recommendations.append("建议在治疗师指导下重复练习并关注动作深度。")
        elif overall_value < 85:
            recommendations.append("动作基本完成，建议继续优化稳定性与控制。")
        else:
            recommendations.append("动作完成质量较好，可逐步提高训练难度。")

        records = read_json_array(ASSESSMENT_RESULTS_FILE)
        result_record = normalize_assessment_result(
            {
                "id": build_id("result"),
                "patientId": request.patientId or "guest",
                "movementType": request.movementType,
                "movementName": request.movementName or request.movementType,
                "timestamp": request.timestamp or datetime.now(timezone.utc).isoformat(),
                "overallScore": {"value": overall_value, "maxValue": 100},
                "mobilityScore": {"value": overall_value, "maxValue": 100},
                "stabilityScore": {"value": overall_value, "maxValue": 100},
                "angles": angles,
                "recommendations": recommendations,
                "feedback": feedback,
            }
        )
        records.append(result_record)
        write_json_array(ASSESSMENT_RESULTS_FILE, records)

        return ApiEnvelopeAssessmentResponse(
            code=200,
            message="ok",
            data=AssessmentResponse(
                score=score,
                feedback=feedback,
                angles=angles,
                details={
                    "processed_by": "Python FastAPI MVP",
                    "result_id": result_record["id"],
                    "saved": True,
                },
            ),
            timestamp=datetime.now(timezone.utc).isoformat(),
        )

    except Exception as e:
        print(f"Error processing assessment: {e}")
        raise HTTPException(status_code=500, detail=str(e))
