
// 康复报告生成服务 (LLM Service)
// 负责将结构化的骨骼/角度数据转换为自然语言的医疗/康复建议

export interface RehabilitationData {
  patientName?: string;
  age?: number;
  movementType: string; // e.g., "Deep Squat", "Hurdle Step"
  score: number;
  angles: Record<string, number>; // e.g., { "left_knee": 110, "hip_flexion": 85 }
  painLevel?: number; // 0-10
  complaints?: string; // 主诉
}

export interface AIReport {
  summary: string;
  clinicalImpression: string; // 临床印象
  recommendations: string[]; // 康复建议
  riskFlags: string[]; // 风险提示
  soapNote?: {
    s: string;
    o: string;
    a: string;
    p: string;
  };
}

// 模拟的 LLM 调用（实际使用时替换为真实的 API 调用）
// 支持: DeepSeek, OpenAI, Azure OpenAI, Anthropic, etc.
export class LLMService {
  private static apiKey: string = ''; // 实际开发中应从环境变量或设置中读取
  private static apiUrl: string = 'https://api.deepseek.com/v1/chat/completions'; // 示例：DeepSeek API

  /**
   * 配置 API Key
   */
  static setApiKey(key: string) {
    this.apiKey = key;
  }

  /**
   * 生成康复报告
   */
  static async generateReport(data: RehabilitationData): Promise<AIReport> {
    // 1. 构建 Prompt (提示词工程)
    const prompt = this.constructPrompt(data);

    // 2. 调用 LLM (如果未配置Key，则返回模拟数据)
    if (!this.apiKey) {
      console.warn('LLM API Key 未配置，返回模拟报告数据');
      return this.mockResponse(data);
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat", // 或 gpt-4, claude-3
          messages: [
            {
              role: "system",
              content: "你是一位经验丰富的物理治疗师(PT)和运动康复专家。请根据提供的动作评估数据，生成一份专业的康复评估报告。请使用由于的中文回答，语气专业、客观但富有同理心。请注意，你只能根据数据提供建议，不能做确诊，必须包含'建议咨询线下医生'的免责声明。"
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`LLM API Error: ${response.statusText}`);
      }

      const result = await response.json();
      const content = result.choices[0].message.content;
      
      // 3. 解析返回的 JSON (假设我们要求 LLM 返回 JSON 格式)
      // 在实际 Prompt 中应强制要求 JSON 格式输出
      return this.parseLLMResponse(content);

    } catch (error) {
      console.error('生成报告失败:', error);
      throw error;
    }
  }

  /**
   * 构建提示词
   */
  private static constructPrompt(data: RehabilitationData): string {
    return `
请分析以下患者的动作评估数据：

【基本信息】
- 动作类型: ${data.movementType}
- 综合得分: ${data.score}/100
- 疼痛等级: ${data.painLevel || 0}/10

【生物力学数据】
${Object.entries(data.angles).map(([k, v]) => `- ${k}: ${v}°`).join('\n')}

【主诉】
${data.complaints || '无特殊主诉'}

请输出 JSON 格式的报告，包含以下字段：
1. summary (简短的一句话总结)
2. clinicalImpression (详细的临床评估印象，解释角度异常可能意味着什么)
3. recommendations (3-5条具体的康复训练建议)
4. riskFlags (风险警示，如代偿模式或损伤风险)
5. soapNote (标准的SOAP格式笔记)
`;
  }

  /**
   * 模拟响应 (当没有 API Key 时使用)
   */
  private static mockResponse(data: RehabilitationData): Promise<AIReport> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          summary: `患者在进行${data.movementType}测试时表现${data.score > 80 ? '良好' : '一般'}，主要问题在于下肢稳定性。`,
          clinicalImpression: `观察到${Object.keys(data.angles)[0] || '关节'}活动度受限。低分(${data.score})表明可能存在代偿运动模式。如果疼痛等级为${data.painLevel || 0}，建议关注炎症反应。`,
          recommendations: [
            "建议进行泡沫轴放松股四头肌和髂胫束。",
            "每天进行3组，每组15次的臀桥训练以激活臀大肌。",
            "在无痛范围内进行关节活动度训练。"
          ],
          riskFlags: [
            "膝关节内扣风险 (Valgus collapse)",
            "腰椎过度代偿风险"
          ],
          soapNote: {
            s: `患者主诉${data.complaints || '无明显不适'}，但在测试中表现出犹豫。`,
            o: `${data.movementType}测试得分${data.score}。关键角度数据：${JSON.stringify(data.angles)}。`,
            a: "功能性动作模式受限，可能与核心稳定性不足有关。",
            p: "建议每周进行2次物理治疗，重点改善核心控制和下肢力线。"
          }
        });
      }, 1500);
    });
  }

  private static parseLLMResponse(content: string): AIReport {
    try {
      // 尝试提取 JSON 部分（防止 LLM 输出多余的闲聊文字）
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(content);
    } catch (e) {
      // 降级处理：如果解析失败，手动构造一个简单的对象
      return {
        summary: content.slice(0, 100) + "...",
        clinicalImpression: content,
        recommendations: ["解析失败，请查看原始文本"],
        riskFlags: [],
      };
    }
  }
}
