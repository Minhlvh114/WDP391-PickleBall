import React, { useState } from "react";
import { Box, Button, Typography, TextField, CircularProgress, Link } from "@mui/material";
import { ArrowBack, Mail } from "@mui/icons-material";
import { motion } from "framer-motion";
import axios from "axios";
import { apiUrl, routes, methods } from "../constants";
import toast from "react-hot-toast";


const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // setIsLoading(true);
    setIsSubmitted(true);
    // setIsLoading(false);

  
      axios
        .post(apiUrl(routes.AUTH, methods.SEND_MAIL), {email})
        .then((response) => {
          console.log(response.data);
          toast.success(`Success: Check your emails`);
        })
        .catch((response) => {
          console.log(response)
          console.error("Error create payment link:",response.response.data.message);
          toast.error(`Failed: ${response.response.data.message}`);
        });
  
  };

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
          backgroundColor: "white", 
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "20px",
              textAlign: "center",
              background: "linear-gradient(to right, #34d399, #10b981)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Forgot Password
          </motion.h2>

          {!isSubmitted ? (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  color: "black",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                Enter your email address, and we'll send you a link to reset your password.
              </motion.p>

              <TextField
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ marginBottom: "16px" }}
              />

              <Button
                fullWidth
                variant="contained"
                color="success"
                type="submit"
                disabled={isLoading || !email}
                style={{
                  padding: "12px 0",
                  fontWeight: "bold",
                  marginTop: "16px",
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
              </Button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: "center" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                  width: "64px",
                  height: "64px",
                  backgroundColor: "#10b981",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Mail style={{ color: "white", fontSize: "32px" }} />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  color: "black",
                  marginBottom: "16px",
                }}
              >
                If an account exists for {email}, you will receive a password reset link shortly.
              </motion.p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: "#111827",
            padding: "16px 0",
            textAlign: "center",
          }}
        >
          <Link
            href="/login"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowBack style={{ marginRight: "8px" }} /> Back to Login
          </Link>
        </motion.div>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
