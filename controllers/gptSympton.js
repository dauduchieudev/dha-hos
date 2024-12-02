const axios = require("axios");

const apiUrl = 'https://api.openai.com/v1/chat/completions';

const apiKey = process.env.CHATGPT_API_KEY;

const prompt = `
Dựa vào triệu chứng sau, hãy đưa ra tên của 1 trong số các khoa khám bệnh phù hợp dưới đây (chỉ đưa ra tên khoa trong danh sách, không đưa ra ngoài danh sách, không dài dòng).
Nếu không phải là triệu chứng y tế thì đưa ra "Non-Medical"
- Khoa Nội
- Khoa Ngoại
- Khoa Nhi
- Khoa Sản
- Khoa Tai Mũi Họng
- Khoa Mắt
- Khoa Răng Hàm Mặt
- Khoa Da Liễu
- Khoa Hồi Sức Cấp Cứu
- Khoa Xét Nghiệm
- Khoa Chẩn Đoán Hình Ảnh
- Khoa Dinh Dưỡng
- Khoa Ung Bướu
- Khoa Y Học Cổ Truyền
- Khoa Phục Hồi Chức Năng

Triệu chứng: `;


class GptSympton {

    async getSympton(req, res) {
        const symptom = req.body.symptom;
        console.log("sympton:", symptom);
        
        if (!symptom) {
            return res.status(400).json({ error: "Triệu chứng không được cung cấp!" });
        }
    
        try {
            const response = await axios.post(
                apiUrl,
                {
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: 'Bạn là một trợ lý y tế.' },
                        { role: 'user', content: prompt + symptom }
                    ],
                    max_tokens: 50,
                    temperature: 0.5,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            const specialty = response.data.choices[0].message.content.trim();
            console.log("khoa:", specialty)
            return res.json({ specialty: specialty });
    
    
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            return res.status(500).json({ error: 'Lỗi khi xử lý yêu cầu' });
        }
    }

    async getDepBySympton(symptom) {
        console.log("sympton:", symptom);
        
        if (!symptom) {
            return "Non-Medical";
        }
    
        try {
            const response = await axios.post(
                apiUrl,
                {
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: 'Bạn là một trợ lý y tế.' },
                        { role: 'user', content: prompt + symptom }
                    ],
                    max_tokens: 50,
                    temperature: 0.5,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            // Trả kết quả cho client
            const specialty = response.data.choices[0].message.content.trim();
            console.log("khoa:", specialty)
            return specialty;
    
    
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            return "Non-Medical";
        }
    }

}

module.exports = new GptSympton();
