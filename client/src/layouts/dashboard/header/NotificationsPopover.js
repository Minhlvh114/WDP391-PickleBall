import { useState } from "react";
import { alpha } from "@mui/material/styles";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
  Tooltip,
} from "@mui/material";
import Iconify from "../../../components/iconify";

// Dữ liệu mẫu cho thông báo
const NOTIFICATIONS = [
  {
    id: 1,
    title: 'Đặt sân thành công',
    description: 'Bạn đã đặt sân Tennis thành công vào ngày 15/03/2025',
    avatar: null,
    type: 'booking',
    createdAt: new Date('2025-03-13T10:30:00'),
    isUnread: true,
  },
  {
    id: 2,
    title: 'Thanh toán thành công',
    description: 'Thanh toán đặt sân Bóng rổ đã được xác nhận',
    avatar: null,
    type: 'payment',
    createdAt: new Date('2025-03-12T08:15:00'),
    isUnread: true,
  },
  {
    id: 3,
    title: 'Nhắc nhở lịch đặt sân',
    description: 'Bạn có lịch đặt sân vào ngày mai',
    avatar: null,
    type: 'reminder',
    createdAt: new Date('2025-03-10T14:22:00'),
    isUnread: false,
  },
  {
    id: 4,
    title: 'Khuyến mãi mới',
    description: 'Giảm 20% cho đặt sân từ 18h-20h các ngày trong tuần',
    avatar: null,
    type: 'promotion',
    createdAt: new Date('2025-03-08T09:45:00'),
    isUnread: false,
  },
  {
    id: 5,
    title: 'Cập nhật hệ thống',
    description: 'Hệ thống đã được cập nhật với nhiều tính năng mới',
    avatar: null,
    type: 'system',
    createdAt: new Date('2025-03-05T16:10:00'),
    isUnread: false,
  },
];

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [open, setOpen] = useState(null);

  const totalUnRead = notifications.filter((item) => item.isUnread).length;

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnread: false,
      }))
    );
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 1,
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          }),
        }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={24} height={24} />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
            '& .MuiMenuItem-root': {
              px: 1.5,
              py: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Thông báo</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Bạn có {totalUnRead} thông báo chưa đọc
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title="Đánh dấu đã đọc tất cả">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <List
          disablePadding
          sx={{ height: { xs: 340, sm: 400 }, overflow: 'auto' }}
        >
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </List>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

function NotificationItem({ notification }) {
  const { avatar, title, description, type, isUnread } = notification;

  // Xác định icon dựa vào loại thông báo
  const getIcon = (type) => {
    switch (type) {
      case 'booking':
        return 'eva:calendar-fill';
      case 'payment':
        return 'eva:credit-card-fill';
      case 'reminder':
        return 'eva:clock-fill';
      case 'promotion':
        return 'eva:gift-fill';
      default:
        return 'eva:info-fill';
    }
  };

  // Xác định màu dựa vào loại thông báo
  const getColor = (type) => {
    switch (type) {
      case 'booking':
        return 'primary';
      case 'payment':
        return 'success';
      case 'reminder':
        return 'warning';
      case 'promotion':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(isUnread && {
          bgcolor: 'action.hover',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: `${getColor(type)}.lighter` }}>
          <Iconify icon={getIcon(type)} width={24} height={24} color={`${getColor(type)}.main`} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            {description}
          </Typography>
        }
      />
    </ListItemButton>
  );
}