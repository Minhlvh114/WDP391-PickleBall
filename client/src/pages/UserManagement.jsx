"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Avatar,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  useTheme,
  alpha,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material"
import { Helmet } from "react-helmet-async"
import toast from "react-hot-toast"

import Iconify from "../components/iconify"
import Label from "../components/label"
import { apiUrl, methods, routes } from "../constants"
import UserForm from "./UserFormForUser"
import BookingHistoryModal from "./BookingHistoryModal"

export default function UserManagement() {
  const theme = useTheme()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isUserFormOpen, setIsUserFormOpen] = useState(false)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false) // New state for status dialog
  const [actionAnchorEl, setActionAnchorEl] = useState(null)
  const [actionUser, setActionUser] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const fetchUsers = useCallback(() => {
    setLoading(true)
    axios
      .get(apiUrl(routes.USER, methods.GET_ALL), { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          setUsers(response.data.usersList)
          setFilteredUsers(response.data.usersList)
        } else {
          toast.error("Failed to fetch users")
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching users:", error)
        toast.error("Failed to fetch users")
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      const filtered = users.filter(
        (user) =>
          user.name?.toLowerCase().includes(lowercasedQuery) ||
          user.email?.toLowerCase().includes(lowercasedQuery) ||
          user.phone?.toLowerCase().includes(lowercasedQuery)
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
    setPage(0)
  }, [searchQuery, users])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  // Action Menu
  const handleOpenActionMenu = (event, user) => {
    setActionAnchorEl(event.currentTarget)
    setActionUser(user)
  }

  const handleCloseActionMenu = () => {
    setActionAnchorEl(null)
    setActionUser(null)
  }

  // Role Dialog
  const handleOpenRoleDialog = (user) => {
    setSelectedUser(user)
    setIsRoleDialogOpen(true)
    handleCloseActionMenu()
  }

  const handleCloseRoleDialog = () => {
    setIsRoleDialogOpen(false)
  }

  // Status Dialog - New functions
  const handleOpenStatusDialog = (user) => {
    setSelectedUser(user)
    setIsStatusDialogOpen(true)
    handleCloseActionMenu()
  }

  const handleCloseStatusDialog = () => {
    setIsStatusDialogOpen(false)
  }

  const handleChangeStatus = (status) => {
    if (!selectedUser) return;
    
    const url = apiUrl(routes.USER, methods.PUT, selectedUser._id);
    console.log("Updating user status using URL:", url);
    console.log("User ID:", selectedUser._id);
    console.log("Setting status to:", status);
    
    axios
      .put(
        url,
        { status: status },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.success) {
          setSnackbar({
            open: true,
            message: `User status updated to ${status} successfully`,
            severity: "success",
          });
          fetchUsers();
        } else {
          console.error("Server returned success=false:", response.data);
          setSnackbar({
            open: true,
            message: `Failed to update user status: ${response.data.message || "Unknown error"}`,
            severity: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating user status:", error);
        console.error("Response data:", error.response?.data);
        setSnackbar({
          open: true,
          message: `Failed to update user status: ${error.response?.data?.message || error.message || "Unknown error"}`,
          severity: "error",
        });
      })
      .finally(() => {
        handleCloseStatusDialog();
      });
  }

  const handleChangeRole = (isAdmin) => {
    if (!selectedUser) return;
  
    // Chuyển isAdmin về đúng kiểu dữ liệu boolean
    const isAdminBoolean = Boolean(isAdmin);
    
    // Sử dụng apiUrl từ constants thay vì URL trực tiếp
    const url = apiUrl(routes.USER, methods.PUT, selectedUser._id);
    console.log("Updating user role using URL:", url);
    console.log("User ID:", selectedUser._id);
    console.log("Setting isAdmin to:", isAdminBoolean);
    
    // Đảm bảo dữ liệu gửi đi là object với isAdmin là boolean
    axios
      .put(
        url,
        { isAdmin: isAdminBoolean },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.success) {
          setSnackbar({
            open: true,
            message: `User role updated to ${isAdminBoolean ? 'Admin' : 'Member'} successfully`,
            severity: "success",
          })
          fetchUsers(); // Refresh danh sách users
        } else {
          console.error("Server returned success=false:", response.data);
          setSnackbar({
            open: true,
            message: `Failed to update user role: ${response.data.message || "Unknown error"}`,
            severity: "error",
          })
        }
      })
      .catch((error) => {
        console.error("Error updating user role:", error);
        console.error("Response data:", error.response?.data);
        setSnackbar({
          open: true,
          message: `Failed to update user role: ${error.response?.data?.message || error.message || "Unknown error"}`,
          severity: "error",
        })
      })
      .finally(() => {
        handleCloseRoleDialog();
      });
  }

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
    handleCloseActionMenu()
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return

    // Sử dụng URL trực tiếp để tránh lỗi
    const url = `http://localhost:8080/api/user/delete/${selectedUser._id}`;
    
    axios
      .delete(url, { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          setSnackbar({
            open: true,
            message: "User deleted successfully",
            severity: "success",
          })
          fetchUsers()
        } else {
          setSnackbar({
            open: true,
            message: "Failed to delete user",
            severity: "error",
          })
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error)
        setSnackbar({
          open: true,
          message: "Failed to delete user",
          severity: "error",
        })
      })
      .finally(() => {
        handleCloseDeleteDialog()
      })
  }

  const handleAddUser = () => {
    setSelectedUser({
      name: "",
      email: "",
      phone: "",
      dob: new Date(),
      password: "",
      isAdmin: false,
      status: "active", // Set default status to active
    })
    setIsUserFormOpen(true)
  }

  const handleCloseUserForm = () => {
    setIsUserFormOpen(false)
  }

  const handleSaveUser = () => {
    if (!selectedUser) return

    const userToSave = { ...selectedUser }

    // Sử dụng URL trực tiếp để tránh lỗi
    const url = `http://localhost:8080/api/user/add`;
    console.log("Adding new user with direct URL:", url);
    
    axios
      .post(url, userToSave, { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          setSnackbar({
            open: true,
            message: "User added successfully",
            severity: "success",
          })
          fetchUsers()
        } else {
          setSnackbar({
            open: true,
            message: "Failed to add user",
            severity: "error",
          })
        }
      })
      .catch((error) => {
        console.error("Error adding user:", error)
        setSnackbar({
          open: true,
          message: `Failed to add user: ${error.response?.data?.message || "Unknown error"}`,
          severity: "error",
        })
      })
      .finally(() => {
        handleCloseUserForm()
      })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    )
  }

  return (
    <Container maxWidth={false}>
      <Helmet>
        <title>User Management</title>
      </Helmet>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleAddUser}
          sx={{
            borderRadius: "12px",
            px: 3,
            py: 1,
            fontWeight: "bold",
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            transition: "all 0.3s",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: theme.shadows[8],
            },
          }}
        >
          New User
        </Button>
      </Stack>

      <Card
        sx={{
          mb: 5,
          borderRadius: 2,
          p: 3,
          boxShadow: theme.shadows[10],
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} mb={3}>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name, email or phone..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: "text.disabled" }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchQuery("")}>
                    <Iconify icon="eva:close-fill" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
              },
            }}
          />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <TableContainer component={Paper} sx={{ boxShadow: "none", borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date of Birth</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          src={user.photoUrl}
                          alt={user.name}
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: theme.palette.primary.light,
                            boxShadow: theme.shadows[2],
                          }}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="subtitle2">{user.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <Label color={user.isAdmin ? "error" : "success"}>
                        {user.isAdmin ? "Admin" : "Member"}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <Label color={user.status === 'inactive' ? "error" : "success"}>
                        {user.status || 'active'}
                      </Label>
                    </TableCell>
                    <TableCell>
                      {user.dob ? new Date(user.dob).toLocaleDateString() : "Not provided"}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleOpenActionMenu(e, user)}
                        sx={{
                          color: theme.palette.primary.main,
                          "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
                        }}
                      >
                        <Iconify icon="eva:more-vertical-fill" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleCloseActionMenu}
        PaperProps={{
          elevation: 1,
          sx: {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <MenuItem onClick={() => handleOpenRoleDialog(actionUser)} sx={{ color: theme.palette.primary.main }}>
          <Iconify icon="mdi:account-convert" sx={{ mr: 2 }} />
          Change Role
        </MenuItem>
        <MenuItem onClick={() => handleOpenStatusDialog(actionUser)} sx={{ color: theme.palette.warning.main }}>
          <Iconify icon="mdi:account-lock" sx={{ mr: 2 }} />
          Change Status
        </MenuItem>
        {actionUser && !actionUser.isAdmin && (
          <MenuItem onClick={() => handleOpenDeleteDialog(actionUser)} sx={{ color: theme.palette.error.main }}>
            <Iconify icon="eva:trash-2-fill" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user <strong>{selectedUser?.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button variant="outlined" onClick={handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteUser}
            startIcon={<Iconify icon="eva:trash-2-fill" />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Role Change Dialog */}
      <Dialog
        open={isRoleDialogOpen}
        onClose={handleCloseRoleDialog}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change role for user <strong>{selectedUser?.name}</strong>:
          </DialogContentText>
          <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleChangeRole(true)}
              startIcon={<Iconify icon="mdi:shield-account" />}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: "bold",
                boxShadow: theme.shadows[3],
              }}
            >
              Set as Admin
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleChangeRole(false)}
              startIcon={<Iconify icon="mdi:account" />}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: "bold",
                boxShadow: theme.shadows[3],
              }}
            >
              Set as Member
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button variant="outlined" onClick={handleCloseRoleDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Dialog - New dialog */}
      <Dialog
        open={isStatusDialogOpen}
        onClose={handleCloseStatusDialog}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>Change User Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change status for user <strong>{selectedUser?.name}</strong>:
          </DialogContentText>
          <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleChangeStatus('active')}
              startIcon={<Iconify icon="mdi:account-check" />}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: "bold",
                boxShadow: theme.shadows[3],
              }}
            >
              Set as Active
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleChangeStatus('inactive')}
              startIcon={<Iconify icon="mdi:account-lock" />}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: "bold",
                boxShadow: theme.shadows[3],
              }}
            >
              Set as Inactive
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button variant="outlined" onClick={handleCloseStatusDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Form Dialog */}
      {selectedUser && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={isUserFormOpen}
          onClose={handleCloseUserForm}
          PaperProps={{ sx: { borderRadius: 2 } }}
        >
          <DialogTitle>
            Add New User
          </DialogTitle>
          <DialogContent dividers>
            <Box component="form" noValidate sx={{ mt: 2 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Name"
                  value={selectedUser.name || ""}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={selectedUser.email || ""}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
                
                <TextField
                  fullWidth
                  label="Phone"
                  value={selectedUser.phone || ""}
                  onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                />
                
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={selectedUser.dob ? new Date(selectedUser.dob).toISOString().split('T')[0] : ""}
                  onChange={(e) => setSelectedUser({ ...selectedUser, dob: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={selectedUser.password || ""}
                  onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                />
                
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography>User Role:</Typography>
                  <Button
                    variant={selectedUser.isAdmin ? "contained" : "outlined"}
                    color="error"
                    onClick={() => setSelectedUser({ ...selectedUser, isAdmin: true })}
                    sx={{ borderRadius: 2 }}
                  >
                    Admin
                  </Button>
                  <Button
                    variant={!selectedUser.isAdmin ? "contained" : "outlined"}
                    color="success"
                    onClick={() => setSelectedUser({ ...selectedUser, isAdmin: false })}
                    sx={{ borderRadius: 2 }}
                  >
                    Member
                  </Button>
                </Stack>

                {/* Add status selection to form */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography>User Status:</Typography>
                  <Button
                    variant={selectedUser.status === 'active' ? "contained" : "outlined"}
                    color="success"
                    onClick={() => setSelectedUser({ ...selectedUser, status: 'active' })}
                    sx={{ borderRadius: 2 }}
                  >
                    Active
                  </Button>
                  <Button
                    variant={selectedUser.status === 'inactive' ? "contained" : "outlined"}
                    color="error"
                    onClick={() => setSelectedUser({ ...selectedUser, status: 'inactive' })}
                    sx={{ borderRadius: 2 }}
                  >
                    Inactive
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button variant="outlined" onClick={handleCloseUserForm}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveUser}
              startIcon={<Iconify icon="eva:save-fill" />}
            >
              Add User
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}