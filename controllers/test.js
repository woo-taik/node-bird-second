const axios = require('axios');

exports.test = async (req, res, next) => {
  try {
    if (!req.session.jwt) {
      const tokenResult = await axios.post("http://localhost:8002/v1/token", 
        {
          clientSecret: process.env.CLIENT_SECRET,
        }
      )
  
      if (tokenResult?.data?.code === 200) {
        req.session.jwt = tokenResult.data.token;
        return res.status(200).json({
          code: 200,
          message: "토큰 발급 성공",
          token: tokenResult.data.token,
        });
      } else {
        return res.status(tokenResult.data?.code).json({
          code: tokenResult.data.code,
          message: tokenResult.data.message,
        });
      }
    }
    const result = await axios.get("http://localhost:8002/v1/test", {
      headers: {
        Authorization: `Bearer ${req.session.jwt}`,
      }
    })
    return res.json(result.data);
  } catch (error) {
    console.error(error);
    if (error.response?.data?.code === 419) {
      return res.status(419).json({
        code: 419,
        message: "토큰이 만료되었습니다.",
      });
    }
    return res.status(error.response?.data?.code || 500).json({
      code: error.response?.data?.code,
      message: error.response?.data?.message,
    });
  }
};