"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Modal,
  Paper,
  IconButton,
  Grid,
  Card,
  CardContent,
  Divider,
  useTheme,
} from "@mui/material"
import toast from "react-hot-toast"
import Iconify from "../components/iconify"
import Label from "../components/label"
import { routes, methods, apiUrl } from "../constants"

export default function BookingHistoryModal({ isOpen, onClose, userId }) {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const theme = useTheme()

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: "80%", md: "90%" },
    maxWidth: 1200,
    maxHeight: "90vh",
    overflow: "auto",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: { xs: 2, sm: 4 },
  }

  const getBills = async () => {
    if (!userId || !isOpen) return
    
    setLoading(true)
    try {
      const url = apiUrl(routes.BILL, methods.GET_ALL_BY_USER_ID, userId)
      console.log("Calling API:", url)
      
      const response = await axios.get(url, { withCredentials: true })
      console.log("API Response:", response.data)
      
      if (response.data.success) {
        const billsList = response.data.billsList || []
        setBills(billsList)
      } else {
        toast.error(response.data.message || "Failed to fetch booking history")
        setBills([])
      }
    } catch (error) {
      console.error("API Error:", error)
      toast.error(error.response?.data?.message || "Failed to fetch booking history")
      setBills([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      getBills()
    }
  }, [isOpen, userId])

  const getStatusColor = (status) => {
    // Convert status to lowercase for consistent handling
    const statusLower = status?.toLowerCase() || "";
    
    switch (statusLower) {
      case "success":
      case "paid":
        return {
          color: "success",
          icon: "eva:checkmark-circle-fill",
          displayText: "PAID"
        }
      case "pending":
        return {
          color: "warning",
          icon: "eva:clock-fill",
          displayText: "PENDING"
        }
      case "cancel":
        return {
          color: "error",
          icon: "eva:close-circle-fill",
          displayText: "CANCELLED"
        }
      default:
        return {
          color: "info",
          icon: "eva:info-fill",
          displayText: status?.toUpperCase() || "UNKNOWN"
        }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    
    try {
      // Handle dd/MM/yyyy HH:mm:ss format from backend
      if (typeof dateString === 'string' && dateString.includes('/') && dateString.includes(':')) {
        return dateString
      }
      
      // Handle ISO date strings
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        return date.toLocaleString()
      }
      
      return dateString
    } catch (error) {
      console.error("Date formatting error:", error)
      return dateString
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="booking-history-modal"
      aria-describedby="modal-showing-user-booking-history"
    >
      <Paper sx={modalStyle}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Thanh toán đã thực hiện
          </Typography>
          <IconButton onClick={onClose} aria-label="close">
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : bills.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Iconify icon="eva:calendar-outline" width={64} height={64} sx={{ color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Chưa có thanh toán nào
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {bills.map((bill) => {
              const statusConfig = getStatusColor(bill.status)
              
              return (
                <Grid item xs={12} md={6} key={bill._id}>
                  <Card
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      boxShadow: theme.shadows[3],
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[6],
                      },
                      position: "relative",
                      overflow: "visible",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        zIndex: 9,
                      }}
                    >
                      <Label
                        color={statusConfig.color}
                        sx={{
                          borderRadius: "20px",
                          px: 2,
                          py: 0.5,
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          boxShadow: theme.shadows[2],
                        }}
                      >
                        <Iconify icon={statusConfig.icon} sx={{ mr: 0.5, width: 16, height: 16 }} />
                        {statusConfig.displayText}
                      </Label>
                    </Box>
                    
                    <CardContent sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Số tiền
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: "medium", color: theme.palette.success.main }}>
                              {(bill.amount_price || 0).toLocaleString()} VND
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Tài khoản người dùng
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                              {bill.user_id?.name || "N/A"}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Tên tài khoản
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                              {bill.counter_account_name || "N/A"}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Số tài khoản
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                              {bill.counter_account_number || "N/A"}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Ngày giao dịch
                            </Typography>
                            <Typography variant="body1">
                              {formatDate(bill.transaction_bank_time || bill.createdAt)}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="caption" color="text.secondary">
                          Mã đơn: {bill.order_code_pay_os}
                        </Typography>
                        {bill.reference_bank && (
                          <Typography variant="caption" color="text.secondary">
                            Tham chiếu ngân hàng: {bill.reference_bank}
                          </Typography>
                        )}
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        Ngày tạo: {formatDate(bill.createdAt)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        )}
      </Paper>
    </Modal>
  )
}