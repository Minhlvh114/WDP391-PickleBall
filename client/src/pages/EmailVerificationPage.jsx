import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { Box, Button, Typography } from "@mui/material";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      await verifyEmail(verificationCode);
      navigate("/");
      toast.success("Email verified successfully");
    } catch (error) {
      console.log(error);
    }
  };

  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <Box
      sx={{
        minHeight: "100vh", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white", 
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: "100%",
          padding: 4,
          backgroundColor: "white", // White background for the form
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: "bold",
            marginBottom: 3,
            background: "linear-gradient(to right, #34d399, #10b981)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Verify Your Email
        </Typography>

        <Typography align="center" color="textSecondary" sx={{ marginBottom: 3 }}>
          Enter the 6-digit code sent to your email address.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" justifyContent="space-between" mb={3}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                style={{
                  width: "48px",
                  height: "48px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                  backgroundColor: "#374151", // Dark background for the input fields
                  color: "white",
                  border: "2px solid #4b5563", // Gray border
                  borderRadius: "8px",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                }}
              />
            ))}
          </Box>

          {error && (
            <Typography color="error" variant="body2" gutterBottom>
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            color="success"
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            sx={{
              padding: "12px 0",
              fontWeight: "bold",
              marginTop: 2,
              "&:hover": { backgroundColor: "#10b981" },
            }}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default EmailVerificationPage;
