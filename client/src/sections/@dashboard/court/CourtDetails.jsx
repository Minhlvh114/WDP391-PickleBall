import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, Typography, Box, Button, CircularProgress, Grid, Avatar, 
  TextField, Breadcrumbs, Link, IconButton, Dialog, DialogActions, 
  DialogContent, DialogContentText, DialogTitle, Card, Divider, Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import shuffle from 'lodash.shuffle';
import { apiUrl, routes, methods } from '../../../constants';
import Label from '../../../components/label';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { useAuthStore } from '../../../store/authStore';
// Import icons for edit and delete actions
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import PlaceIcon from '@mui/icons-material/Place';

const TruncatedTypography = styled(Typography)({
  color: 'black',
});

const InfoSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
}));

const CourtDetails = () => {
  const { user } = useAuthStore();
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedCourts, setRelatedCourts] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isBorrowalModalOpen, setIsBorrowalModalOpen] = useState(false);
  const [selectedCourtId, setSelectedCourtId] = useState(null);
  const [review, setReview] = useState('');
  
  // State for edit functionality
  const [isEditing, setIsEditing] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingReviewContent, setEditingReviewContent] = useState('');
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState(null);

  const getCourt = useCallback(() => {
    setIsLoading(true);
    axios
      .get(apiUrl(routes.COURT, methods.GET, id), { withCredentials: true })
      .then((response) => {
        const courtData = response.data.court;
        setCourt(courtData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching court details:', error);
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    getCourt();
  }, [getCourt]);

  const getFeedbacks = useCallback(() => {
    setIsLoading(true);
    axios
      .get(apiUrl(routes.FEEDBACK, methods.GET_BY_COURT_ID, id), { withCredentials: true })
      .then((response) => {
        console.log('Fetched reviews:', response.data);
        // Map userId from user._id if not present
        const reviewsWithUserIds = response.data.map(review => {
          if (!review.userId && review.user && review.user._id) {
            return { ...review, userId: review.user._id };
          }
          return review;
        });
        setReviews(reviewsWithUserIds);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching feedbacks:', error);
        setIsLoading(false);
      });
  }, [id]);
  
  useEffect(() => {
    getFeedbacks();
  }, [getFeedbacks]);
 
  const addReview = useCallback(() => {
    if (!review.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá');
      return;
    }
    
    const reviewData = {
      court: id,
      user: user?._id,
      review,
      reviewedAt: new Date(),
    };
    axios
      .post(apiUrl(routes.FEEDBACK, methods.POST, id), reviewData)
      .then((response) => {
        // Ensure we have the correct structure with userId
        const newReview = {
          feedback_id: response.data.review._id,
          content: response.data.review.content,
          userName: user?.name,
          userId: user?._id,
        };
        setReview('');
        setReviews([...reviews, newReview]);
        toast.success('Đã thêm đánh giá thành công');
      })
      .catch((error) => {
        console.error('Error adding review:', error);
        toast.error('Không thể thêm đánh giá');
      });
  }, [id, review, reviews, user]);

  // Handle edit review
  const handleEditReview = (reviewId, currentContent) => {
    setIsEditing(true);
    setEditingReviewId(reviewId);
    setEditingReviewContent(currentContent);
  };

  // Submit edited review
  const submitEditedReview = () => {
    if (!editingReviewContent.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá');
      return;
    }

    // Log the API URL for debugging
    const updateUrl = apiUrl(routes.FEEDBACK, methods.PUT, editingReviewId);
    console.log('Update API URL:', updateUrl);

    // Prepare the data to update
    const updateData = { 
      content: editingReviewContent
    };
    
    // Make the API request
    axios
      .put(updateUrl, updateData, { withCredentials: true })
      .then((response) => {
        console.log('Update response:', response.data);
        
        // Update the reviews state with the edited content
        const updatedReviews = reviews.map(review => 
          review.feedback_id === editingReviewId 
            ? { ...review, content: editingReviewContent } 
            : review
        );
        setReviews(updatedReviews);
        
        // Reset edit state
        setIsEditing(false);
        setEditingReviewId(null);
        setEditingReviewContent('');
        
        toast.success('Đã cập nhật đánh giá thành công');
      })
      .catch((error) => {
        console.error('Error updating review:', error);
        
        // Provide more specific error messages based on the error
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          
          if (error.response.status === 404) {
            toast.error('Không tìm thấy đường dẫn API cập nhật (404)');
          } else {
            toast.error(`Lỗi từ server: ${error.response.status}`);
          }
        } else if (error.request) {
          toast.error('Không nhận được phản hồi từ server');
        } else {
          toast.error('Lỗi khi gửi yêu cầu: ' + error.message);
        }
      });
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditingReviewId(null);
    setEditingReviewContent('');
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (reviewId) => {
    setDeleteReviewId(reviewId);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteReviewId(null);
  };

  // Delete review
  const deleteReview = () => {
    const deleteUrl = apiUrl(routes.FEEDBACK, methods.DELETE, deleteReviewId);
    console.log('Delete API URL:', deleteUrl);
    
    axios
      .delete(deleteUrl, { withCredentials: true })
      .then((response) => {
        console.log('Delete response:', response);
        
        // Remove the deleted review from state
        const filteredReviews = reviews.filter(review => review.feedback_id !== deleteReviewId);
        setReviews(filteredReviews);
        
        closeDeleteDialog();
        toast.success('Đã xóa đánh giá thành công');
      })
      .catch((error) => {
        console.error('Error deleting review:', error);
        
        // Provide more specific error messages
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          
          if (error.response.status === 404) {
            toast.error('Không tìm thấy đường dẫn API xóa (404)');
          } else {
            toast.error(`Lỗi từ server: ${error.response.status}`);
          }
        } else if (error.request) {
          toast.error('Không nhận được phản hồi từ server');
        } else {
          toast.error('Lỗi khi gửi yêu cầu: ' + error.message);
        }
        
        closeDeleteDialog();
      });
  };

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!court) {
    return (
      <Container>
        <Typography variant="h5">Không tìm thấy thông tin sân</Typography>
      </Container>
    );
  }

  const images = [
    {
      original: court.court_photo,
      thumbnail: court.court_photo,
    },
    {
      original: court.court_photo,
      thumbnail: court.court_photo,
    },
  ];

  const backToCourtPage = () => {
    navigate('/courts');
  };

  const handleOpenBorrowalModal = () => {
    setIsBorrowalModalOpen(true);
  };

  const handleCloseBorrowalModal = () => {
    setIsBorrowalModalOpen(false);
  };

  // Check if a review belongs to the current user
  const isUserReview = (reviewUserId) => {
    return user && user._id === reviewUserId;
  };

  return (
    <Container>
      <Helmet>
        <title>{court.court_name} - Chi tiết sân</title>
      </Helmet>

      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/">
          Trang chủ
        </Link>
        <Link component={RouterLink} to="/courts">
          Danh sách sân
        </Link>
        <Typography color="text.primary">{court.court_name}</Typography>
      </Breadcrumbs>

      <Button variant="outlined" color="primary" onClick={backToCourtPage} sx={{ mb: 2 }}>
        Quay lại danh sách sân
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={5} md={4}>
          <Card>
            <ImageGallery 
              items={images} 
              showPlayButton={false} 
              showFullscreenButton={true}
              showThumbnails={false}
            />
          </Card>
          
          <InfoSection elevation={1} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachMoneyIcon sx={{ mr: 1 }} /> Thông tin giá
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Giá thuê: {court.price} 000 VND/Giờ
            </Typography>
            <Divider sx={{ my: 1 }} />
            
            <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <AccessTimeIcon sx={{ mr: 1 }} /> Thời gian hoạt động
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {court.opening_hours || "06:00 - 22:00"}
            </Typography>
            <Divider sx={{ my: 1 }} />
            
            <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <InfoIcon sx={{ mr: 1 }} /> Trạng thái
            </Typography>
            <Label 
              color={court.status === "A" ? 'success' : 'error'} 
              sx={{ mt: 1, display: 'inline-flex' }}
            >
              {court.status === "A" ? 'Có sẵn' : 'Không có sẵn'}
            </Label>
          </InfoSection>
          
          <Box sx={{ mt: 2 }}>
            <Link component={RouterLink} to={`/courts/schedule/${court._id}?courtName=${encodeURIComponent(court.court_name)}`}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Đặt sân ngay
              </Button>
            </Link>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={7} md={8}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {court.court_name}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <DescriptionIcon sx={{ mr: 1 }} /> Mô tả sân
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mt: 1 }}>
                {court.description || "Chưa có thông tin mô tả chi tiết về sân này. Vui lòng liên hệ với quản lý để biết thêm thông tin về cơ sở vật chất và tiện ích."}
              </Typography>
            </Box>
            
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTimeIcon sx={{ mr: 1 }} /> Giờ mở cửa & Lưu ý đặt sân
              </Typography>
              <Box sx={{ pl: 3 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Giờ mở cửa:</strong> {court.opening_hours || "06:00 - 22:00"} (tất cả các ngày trong tuần)
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Giờ cao điểm:</strong> 17:00 - 21:00 (Thứ 2 - Thứ 6), 08:00 - 11:00 (Thứ 7, Chủ nhật)
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Thời gian đặt trước:</strong> Khuyến khích đặt sân trước ít nhất 24 giờ, đặc biệt vào giờ cao điểm
                </Typography>
                <Typography variant="body1">
                  <strong>Chính sách hủy:</strong> Hủy trước 4 tiếng được hoàn 100% tiền, hủy trước 2 tiếng được hoàn 50% tiền
                </Typography>
              </Box>
            </Box>
          </Card>
          
          {/* Feedback Section */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Đánh giá từ khách hàng
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Thêm đánh giá của bạn
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar alt={user?.name} src={user?.photoUrl} sx={{ mr: 2 }} />
                <Typography variant="subtitle1">
                  {user?.name || 'Khách'}
                </Typography>
              </Box>
              <TextField
                id="review-input"
                label="Nội dung đánh giá"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button variant="contained" color="primary" onClick={addReview}>
                  Gửi đánh giá
                </Button>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              {reviews.length > 0 ? 'Đánh giá gần đây' : 'Chưa có đánh giá nào'}
            </Typography>
            
            {reviews.map((review) => (
              <Box key={review.feedback_id} sx={{ mt: 2, p: 2, border: '1px solid #eee', borderRadius: '8px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar alt={review.userName} sx={{ mr: 2 }} />
                    <Typography variant="subtitle1">
                      {review.userName}
                    </Typography>
                  </Box>
                  
                  {user && user._id === review.userId && (
                    <Box>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleEditReview(review.feedback_id, review.content)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => openDeleteDialog(review.feedback_id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                
                {isEditing && editingReviewId === review.feedback_id ? (
                  <Box sx={{ mt: 1 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      value={editingReviewContent}
                      onChange={(e) => setEditingReviewContent(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button size="small" onClick={cancelEditing} sx={{ mr: 1 }}>
                        Hủy
                      </Button>
                      <Button size="small" variant="contained" color="primary" onClick={submitEditedReview}>
                        Lưu
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {review.content}
                  </Typography>
                )}
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Xác nhận xóa"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Hủy</Button>
          <Button onClick={deleteReview} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourtDetails;