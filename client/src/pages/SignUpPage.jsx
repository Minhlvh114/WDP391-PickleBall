import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Link,
  Box,
} from "@mui/material";
import { Mail, Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, name, phone);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh", // Ensure it covers the entire screen height
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: "bold",
              marginBottom: 3,
              background:
                "linear-gradient(to right,rgb(52, 137, 211),rgb(16, 134, 185))",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Create Account
          </Typography>

          <form onSubmit={handleSignUp}>
            <TextField
              fullWidth
              label="Full Name"
              type="text"
              variant="outlined"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: <User sx={{ color: "gray", marginRight: 1 }} />,
              }}
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: <Mail sx={{ color: "gray", marginRight: 1 }} />,
              }}
            />
            <TextField
              fullWidth
              label="Phone No"
              type="number"
              variant="outlined"
              margin="normal"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              InputProps={{
                startAdornment: <Mail sx={{ color: "gray", marginRight: 1 }} />,
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: <Lock sx={{ color: "gray", marginRight: 1 }} />,
              }}
            />
            {error && (
              <Typography color="error" variant="body2" gutterBottom>
                {error}
              </Typography>
            )}
            <PasswordStrengthMeter password={password} />

            <Button
              fullWidth
              variant="contained"
              color="success"
              type="submit"
              disabled={isLoading}
              sx={{
                padding: "12px 0",
                fontWeight: "bold",
                marginTop: 2,
                background:
                  "linear-gradient(to right,rgb(52, 137, 211),rgb(16, 134, 185))",
                "&:hover": { backgroundColor: "#10b981" },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{" "}
              <Link href="/login" color="rgb(52, 137, 211)">
                Login
              </Link>
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default SignUpPage;
