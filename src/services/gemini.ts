import { GoogleGenAI } from "@google/genai";
import { type Word } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateLesson(level: string, topic: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Bạn là một giáo viên dạy tiếng Đức chuyên nghiệp. Hãy tạo một bài học tiếng Đức ở trình độ ${level} về chủ đề "${topic}".
  Bài học nên bao gồm:
  1. Một tiêu đề hấp dẫn.
  2. Phần giải thích ngữ pháp hoặc từ vựng chính (Markdown).
  3. 5 ví dụ câu (tiếng Đức và tiếng Việt).
  4. Một danh sách 10 từ vựng quan trọng nhất (format JSON).
  
  Hãy trả về kết quả dưới định dạng JSON như sau:
  {
    "title": "...",
    "content": "...",
    "vocabulary": [
      { "german": "...", "vietnamese": "...", "example": "...", "level": "${level}" }
    ]
  }`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function checkTranslation(vietnamese: string, userGerman: string, level: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Bạn là một giáo viên tiếng Đức. Học viên (trình độ ${level}) đã dịch câu tiếng Việt sau: "${vietnamese}"
  Câu dịch của học viên: "${userGerman}"
  
  Hãy:
  1. Đánh giá câu dịch (Đúng/Sai/Gần đúng).
  2. Cung cấp câu dịch chính xác nhất (hoặc các cách dịch tự nhiên).
  3. Giải thích ngắn gọn các lỗi ngữ pháp hoặc từ vựng (nếu có).
  
  Trả về định dạng JSON:
  {
    "status": "correct" | "partially_correct" | "incorrect",
    "feedback": "...",
    "correctVersion": "...",
    "explanation": "..."
  }`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function getTutorStream(messages: { role: 'user' | 'model', content: string }[], level: string) {
  const model = "gemini-3-flash-preview";
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: `Bạn là một gia sư tiếng Đức tận tâm. Bạn đang giúp một học viên ở trình độ ${level}. 
      Hãy giao tiếp bằng cả tiếng Đức và tiếng Việt. Luôn khuyến khích học viên nói tiếng Đức. 
      Sửa lỗi ngữ pháp nếu có và giải thích ngắn gọn.`
    },
    history: messages.slice(0, -1).map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }))
  });

  return chat.sendMessageStream({ message: messages[messages.length - 1].content });
}
