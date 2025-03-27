const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Mã xác minh 6 chữ số
};

module.exports = generateVerificationCode;
