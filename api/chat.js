const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async (req, res) => {
    // 仅允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: '请输入内容' });
        }

        // 初始化 Gemini，这里的 process.env.GEMINI_API_KEY 会在 Vercel 后台配置
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;

        // 成功返回结果
        res.status(200).json({ reply: response.text() });
    } catch (error) {
        console.error("Vercel 函数执行报错:", error);
        res.status(500).json({ error: '服务器请求 Gemini API 失败，请检查环境变量配置。' });
    }
};
