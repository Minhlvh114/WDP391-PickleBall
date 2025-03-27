"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { Helmet } from "react-helmet-async"
import { useParams, useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Button,
  Stack,
  Container,
  Paper,
  Divider,
  useTheme,
  alpha,
} from "@mui/material"
import toast from "react-hot-toast"
import Label from "../components/label"
import Iconify from "../components/iconify"
import { apiUrl, methods, routes } from "../constants"
import UserForm from "./UserFormForUser"
import BookingHistoryModal from "./BookingHistoryModal" // Import BookingHistoryModal

export default function UserProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateForm, setIsUpdateForm] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false) // Thêm state cho modal history
  const theme = useTheme()

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 800 },
    bgcolor: "white",
    borderRadius: "20px",
    boxShadow: 24,
    p: 4,
  }

  const containerStyle = {
    maxWidth: 800,
    mx: "auto",
    py: 4,
    px: { xs: 2, md: 4 },
  }

  const getUser = useCallback(() => {
    setLoading(true)
    axios
      .get(apiUrl(routes.USER, `${methods.GET}/${id}`), { withCredentials: true })
      .then((response) => {
        console.log(response.data.user)
        setUser(response.data.user)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    getUser()
  }, [getUser])

  const updateUser = (updateUser) => {

    console.log(updateUser)
    console.log("user.oldPassword:",updateUser.oldPassword)

    if(updateUser.oldPassword !== "" && updateUser.newPassword !== ""){
    axios
      .post(apiUrl(routes.AUTH, `${methods.RESET_PASS}/${id}`), updateUser)
      .then((response) => {
        toast.success(`${response.data.message}`)
        handleCloseModal()
        getUser()
        clearForm()
      })
      .catch((error) => {
        console.log(error)
        toast.error(error.response.data.message)
      })
    }
    // return  console.log(12222)
    axios
      .put(apiUrl(routes.USER, `${methods.PUT}/${id}`), user)
      .then((response) => {
        toast.success("User updated")
        handleCloseModal()
        getUser()
        clearForm()
      })
      .catch((error) => {
        console.log(error)
        toast.error("Something went wrong, please try again")
      })
  }

  const clearForm = () => {
    setUser({
      name: "",
      dob: "",
      email: "",
      password: "",
      phone: "",
      isAdmin: false,
      photoUrl: "",
    })
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setIsUpdateForm(true)
  }

  // Sửa hàm này để mở modal booking history thay vì chuyển trang
  const handleOpenHistory = () => {
    setIsHistoryModalOpen(true)
  }

  // Thêm hàm để đóng modal booking history
  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsUpdateForm(false)
  }

  const handleBackToHomepage = () => {
    navigate("/courts")
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: alpha(theme.palette.primary.main, 0.04),
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    )
  }

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: alpha(theme.palette.primary.main, 0.04),
        }}
      >
        <Iconify icon="eva:person-delete-outline" width={64} height={64} sx={{ color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          User not found
        </Typography>
      </Box>
    )
  }

  return (
    <Paper
      elevation={12}
      sx={{
        ...modalStyle,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: 20,
        },
        overflow: "hidden",
      }}
    >
      <Helmet>
        <title>User Profile | {user.name}</title>
      </Helmet>

      <Container sx={containerStyle}>
        <Stack spacing={4} alignItems="center">
          {/* Avatar Section */}
          <Box
            sx={{
              position: "relative",
              mb: 2,
              "&::after": {
                content: '""',
                position: "absolute",
                top: -8,
                left: -8,
                right: -8,
                bottom: -8,
                borderRadius: "50%",
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                opacity: 0.7,
                zIndex: -1,
                animation: "pulse 2s infinite",
              },
              "@keyframes pulse": {
                "0%": {
                  transform: "scale(1)",
                  opacity: 0.7,
                },
                "50%": {
                  transform: "scale(1.05)",
                  opacity: 0.5,
                },
                "100%": {
                  transform: "scale(1)",
                  opacity: 0.7,
                },
              },
            }}
          >
            <Avatar
              src={user.photoUrl}
              alt={user.name}
              sx={{
                width: 120,
                height: 120,
                border: `4px solid white`,
                boxShadow: theme.shadows[8],
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          </Box>

          {/* User Name and Role */}
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                mb: 1,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                textFillColor: "transparent",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {user.name}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              {user.isAdmin ? (
                <Label
                  color="error"
                  sx={{
                    px: 2,
                    py: 0.75,
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    borderRadius: "20px",
                    boxShadow: theme.shadows[2],
                  }}
                >
                  Admin
                </Label>
              ) : (
                <Label
                  color="success"
                  sx={{
                    px: 2,
                    py: 0.75,
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    borderRadius: "20px",
                    boxShadow: theme.shadows[2],
                  }}
                >
                  Member
                </Label>
              )}
            </Box>
          </Box>

          <Divider sx={{ width: "80%", my: 2 }} />

          {/* User Information */}
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              p: 3,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: "blur(8px)",
            }}
          >
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Iconify
                  icon="eva:email-outline"
                  width={24}
                  height={24}
                  sx={{ color: theme.palette.primary.main, mr: 2 }}
                />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  <Typography component="span" variant="subtitle2" color="text.secondary" sx={{ mr: 1 }}>
                    Email:
                  </Typography>
                  {user.email}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Iconify
                  icon="eva:calendar-outline"
                  width={24}
                  height={24}
                  sx={{ color: theme.palette.primary.main, mr: 2 }}
                />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  <Typography component="span" variant="subtitle2" color="text.secondary" sx={{ mr: 1 }}>
                    Date of Birth:
                  </Typography>
                  {new Date(user.dob).toLocaleDateString()}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Iconify
                  icon="eva:phone-outline"
                  width={24}
                  height={24}
                  sx={{ color: theme.palette.primary.main, mr: 2 }}
                />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  <Typography component="span" variant="subtitle2" color="text.secondary" sx={{ mr: 1 }}>
                    Phone:
                  </Typography>
                  {user.phone}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Action Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              width: "100%",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <Button
              variant="contained"
              onClick={handleOpenModal}
              startIcon={<Iconify icon="eva:edit-fill" />}
              sx={{
                borderRadius: "12px",
                px: 3,
                py: 1.2,
                fontWeight: "bold",
                boxShadow: theme.shadows[4],
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: theme.shadows[8],
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                },
              }}
            >
              Edit Profile
            </Button>

            {!user.isAdmin && (
              <Button
                variant="outlined"
                onClick={handleOpenHistory}
                startIcon={<Iconify icon="eva:book-outline" />}
                sx={{
                  borderRadius: "12px",
                  px: 3,
                  py: 1.2,
                  fontWeight: "bold",
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: theme.shadows[4],
                    borderWidth: 2,
                    borderColor: theme.palette.primary.dark,
                    background: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                Bill History
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={handleBackToHomepage}
              startIcon={<Iconify icon="eva:arrow-back-fill" />}
              sx={{
                mt: 3,
                borderRadius: "12px",
                px: 3,
                py: 1.2,
                fontWeight: "bold",
                borderWidth: 2,
                borderColor: theme.palette.grey[300],
                color: theme.palette.text.primary,
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: theme.shadows[4],
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                  background: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              Back to Homepage
            </Button>
          </Stack>
        </Stack>

        {/* Tích hợp form cập nhật người dùng */}
        <UserForm
          isUpdateForm={isUpdateForm}
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          user={user}
          setUser={setUser}
          handleUpdateUser={updateUser}
        />

        {/* Thêm Modal hiển thị lịch sử đặt sân */}
        <BookingHistoryModal 
          isOpen={isHistoryModalOpen} 
          onClose={handleCloseHistoryModal} 
          userId={id} 
        />
      </Container>
    </Paper>
  )
}