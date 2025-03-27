import { useState } from "react";
import { alpha } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
// import { useAuth } from "../../../hooks/useAuth";
import { useAuthStore } from "../../../store/authStore";

export default function AccountPopover() {
  const { user, logout } = useAuthStore(); // Destructure logout from useAuth()
  const [open, setOpen] = useState(null);

  const logoutUser = () => {
    handleClose();
    axios
      .post("http://localhost:8080/api/auth/logout", { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          // console.log(response.data);
          logout();
        }
      })
      .catch((error) => {
        alert(error);
        console.log(error);
      });
  };

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar
          src={user?.photoUrl || "/default-photo-url.png"}
          alt={user?.name || "User"}
        />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            "& .MuiMenuItem-root": {
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <MenuItem style={{ paddingLeft: "3px" }}>
            <Link
              to={`/userprofile/${user?._id}`}
              style={{ textDecoration: "none" }}
            >
              <Typography variant="subtitle2" noWrap>
                {user?.name || "Guest"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {user?.email || "Guest@gmail.com"}
              </Typography>
            </Link>
          </MenuItem>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        {user ?
        
        <MenuItem onClick={logoutUser} sx={{ m: 1 }}>
          Logout
        </MenuItem>
        :
        <Link
              to={`/userprofile/${user?._id}`}
              style={{ textDecoration: "none", color: "black"}}
        >
          <MenuItem href="/login" sx={{ m: 1 }}>
            Login
          </MenuItem>
        </Link>
        }
       
        
      </Popover>
    </>
  );
}
