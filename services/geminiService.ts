import { GoogleGenAI } from "@google/genai";
import { SelectedCard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTarotReading = async (
  question: string,
  cards: SelectedCard[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key not configured. Please check your setup.";
  }

  const cardDescriptions = cards.map(c => 
    `${c.position === 'past' ? '过去' : c.position === 'present' ? '现在' : '未来'}: ${c.name} (${c.isReversed ? '逆位' : '正位'})`
  ).join('\n');

  const prompt = `
    你是一位神秘、优雅且充满智慧的塔罗占卜师。
    求问者的问题是: "${question}"
    抽出的牌阵如下:
    ${cardDescriptions}

    请根据牌阵和问题进行解读。解读风格要神秘、富有诗意，但也需要给出具体的指引。
    请分段落进行解读：
    1. 整体象征意义
    2. 过去的影响
    3. 现状分析
    4. 未来指引与建议
    
    请使用Markdown格式输出。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response on flash
      }
    });

    return response.text || "星象模糊，请稍后再试...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "与灵界的连接暂时中断，请检查网络或稍后再试。";
  }
};
