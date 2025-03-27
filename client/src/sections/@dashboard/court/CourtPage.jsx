import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  MenuItem,
  OutlinedInput,
  Popover,
  Stack,
  Typography,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Alert,
  InputAdornment,
  TextField,
  Chip,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useAuth } from "../../../hooks/useAuth";
import Scrollbar from "../../../components/scrollbar";
import Label from "../../../components/label/index";
import CourtDialog from "./CourtDialog";
import CourtForm from "./CourtForm";
import Iconify from "../../../components/iconify";
import { apiUrl, methods, routes } from "../../../constants";
import ImportCourtsModal from "./ImportCourtsModal";
import { useAuthStore } from "../../../store/authStore";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const StyledCourtImage = styled("img")({
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
});

const TruncatedTypography = styled(Typography)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  position: "relative",
});

const ExpandableTypography = styled(Typography)(({ expanded }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: expanded ? "unset" : 2,
  WebkitBoxOrient: "vertical",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    color: "#1976d2",
  },
}));

const CourtPage = () => {
  const { user } = useAuthStore();

  const [Court, setCourt] = useState({
    id: "",
    court_name: "",
    price: "",
    court_photo: "",
    status: "",
    description: "",
    opening_hours: "06:00 - 22:00",
  });

  const [Courts, setCourts] = useState([]);
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [selectedCourtId, setSelectedCourtId] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterIsAvailable, setFilterIsAvailable] = useState("");
  const [filterDescription, setFilterDescription] = useState("");
  const [filterOpeningHours, setFilterOpeningHours] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  // Các tùy chọn thời gian mở cửa phổ biến để lọc
  const openingHoursOptions = [
    { value: "", label: "Tất cả thời gian" },
    { value: "06:00", label: "Mở sớm (từ 6:00)" },
    { value: "22:00", label: "Mở muộn (đến 22:00)" },
    { value: "24:00", label: "Mở qua đêm" },
  ];

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getAllCourts = () => {
    axios
      .get(apiUrl(routes.COURT, methods.GET_ALL))
      .then((response) => {
        setCourts(response.data.courtsList);
        setFilteredCourts(response.data.courtsList);
        setIsTableLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Courts:", error);
        toast.error("Failed to fetch Courts");
      });
  };

  const addCourt = async () => {
    // Validate required fields
    if (!Court.court_name || !Court.price || !Court.court_photo) {
      toast.error("Please fill in all required fields");
      return;
    }
  
    // Transform the payload to match backend field names
    const payload = {
      courtName: Court.court_name,
      price: parseFloat(Court.price), // Convert price to a number
      photoUrl: Court.court_photo,
      status: Court.status === "A" ? "A" : "B", // Map status to backend values
      description: Court.description || "",
      opening_hours: Court.opening_hours || "06:00 - 22:00"
    };
  
    console.log("Sending payload:", payload);
  
    try {
      const response = await axios.post(apiUrl(routes.COURT, methods.POST), payload);
      toast.success("Đã thêm sân thành công");
      handleCloseModal();
      getAllCourts();
      clearForm();
    } catch (error) {
      console.error("Error adding Court:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Failed to add Court";
      toast.error(errorMessage);
    }
  };

  const updateCourt = () => {
    axios
      .put(apiUrl(routes.COURT, methods.PUT, selectedCourtId), Court)
      .then((response) => {
        toast.success("Cập nhật sân thành công");
        handleCloseModal();
        handleCloseMenu();
        getAllCourts();
        clearForm();
      })
      .catch((error) => {
        console.error("Error updating Court:", error);
        toast.error("Không thể cập nhật sân");
      });
  };

  const deleteCourt = () => {
    axios
      .delete(apiUrl(routes.COURT, methods.DELETE, selectedCourtId))
      .then((response) => {
        toast.success("Đã xóa sân thành công");
        handleCloseDialog();
        handleCloseMenu();
        getAllCourts();
      })
      .catch((error) => {
        console.error("Error deleting Court:", error);
        toast.error("Không thể xóa sân");
      });
  };

  const getSelectedCourtDetails = () => {
    const selectedCourt = Courts.find(
      (element) => element._id === selectedCourtId
    );
    setCourt(selectedCourt);
  };

  const clearForm = () => {
    setCourt({
      id: "",
      court_name: "",
      price: "",
      court_photo: "",
      status: "",
      description: "",
      opening_hours: "06:00 - 22:00",
    });
  };

  const handleOpenMenu = (event) => {
    setIsMenuOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(null);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    clearForm();
  };

  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
  };

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
  };

  useEffect(() => {
    getAllCourts();
  }, []);

  // Hàm kiểm tra thời gian mở cửa
  const isOpenAtTime = (courtHours, filterTime) => {
    if (!filterTime || !courtHours) return true;
    
    try {
      // Trích xuất thời gian mở cửa và đóng cửa
      const [openTime, closeTime] = courtHours.split('-').map(time => time.trim());
      
      // Kiểm tra thời gian mở sớm
      if (filterTime === "06:00") {
        const openHour = parseInt(openTime.split(':')[0], 10);
        return openHour <= 6;
      }
      
      // Kiểm tra thời gian mở muộn
      if (filterTime === "22:00") {
        const closeHour = parseInt(closeTime.split(':')[0], 10);
        return closeHour >= 22;
      }
      
      // Kiểm tra mở qua đêm
      if (filterTime === "24:00") {
        const closeHour = parseInt(closeTime.split(':')[0], 10);
        return closeHour >= 24 || closeHour === 0;
      }
      
      return true;
    } catch (error) {
      console.log("Lỗi khi phân tích thời gian:", error);
      return true;
    }
  };

  useEffect(() => {
    let filteredResults = Courts;

    if (filterName.trim() !== "") {
      filteredResults = filteredResults.filter((court) =>
        court.court_name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterDescription.trim() !== "") {
      filteredResults = filteredResults.filter((court) =>
        court.description && court.description.toLowerCase().includes(filterDescription.toLowerCase())
      );
    }

    if (filterIsAvailable !== "") {
      filteredResults = filteredResults.filter(
        (court) => court.status === (filterIsAvailable === "true" ? "A" : "B")
      );
    }
    
    if (filterOpeningHours !== "") {
      filteredResults = filteredResults.filter((court) =>
        isOpenAtTime(court.opening_hours, filterOpeningHours)
      );
    }

    setFilteredCourts(filteredResults);
  }, [filterName, filterDescription, filterIsAvailable, filterOpeningHours, Courts]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const tableHeadCells = [
    { id: "courtPhoto", label: "Hình ảnh", alignRight: false },
    { id: "courtName", label: "Tên sân", alignRight: false },
    { id: "description", label: "Mô tả", alignRight: false },
    { id: "opening_hours", label: "Giờ mở cửa", alignRight: false },
    { id: "status", label: "Trạng thái", alignRight: false },
    { id: "actions", label: "Thao tác", alignRight: true },
  ];

  const renderTableHead = () => (
    <TableHead>
      <TableRow>
        {tableHeadCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const renderTableBody = () => (
    <TableBody>
      {filteredCourts
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((court) => {
          const { _id, court_photo, court_name, status, description, opening_hours } = court;

          return (
            <TableRow key={_id} hover>
              <TableCell>
                <Box sx={{ width: 100, height: 100, position: 'relative' }}>
                  <img
                    src={court_photo}
                    alt={court_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              </TableCell>
              <TableCell>
                <Link
                  to={`/Courts/${_id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {court_name}
                  </Typography>
                </Link>
              </TableCell>
              <TableCell>
                <TruncatedTypography variant="body2">
                  {description || "Chưa có mô tả"}
                </TruncatedTypography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                  {opening_hours || "06:00 - 22:00"}
                </Typography>
              </TableCell>
              <TableCell>
                <Label color={court.status =="A" ? "success" : "error"}>
                  {court.status == "A" ? "Có sẵn" : "Không có sẵn"}
                </Label>
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    setSelectedCourtId(_id);
                    handleOpenMenu(e);
                  }}
                >
                  <Iconify icon={"eva:more-vertical-fill"} />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
    </TableBody>
  );

  return (
    <>
      <Helmet>
        <title>Danh sách sân | Quản lý sân</title>
      </Helmet>

      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Danh sách sân
          </Typography>
          {user ===null? "" : user.isAdmin === true || user.isLibrarian === true ? (
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleOpenModal}
              >
                Thêm sân mới
              </Button>
            </Stack>
          ) : null}
        </Stack>

        <Card sx={{ p: 2, mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Tìm kiếm theo tên"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-outline" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              variant="outlined"
              value={filterDescription}
              onChange={(e) => setFilterDescription(e.target.value)}
              placeholder="Tìm kiếm theo mô tả"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:file-text-outline" />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="opening-hours-filter-label">Thời gian mở cửa</InputLabel>
              <Select
                labelId="opening-hours-filter-label"
                value={filterOpeningHours}
                onChange={(e) => setFilterOpeningHours(e.target.value)}
                input={<OutlinedInput label="Thời gian mở cửa" />}
              >
                {openingHoursOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="availability-filter-label">Trạng thái</InputLabel>
              <Select
                labelId="availability-filter-label"
                value={filterIsAvailable}
                onChange={(e) => setFilterIsAvailable(e.target.value)}
                input={<OutlinedInput label="Trạng thái" />}
              >
                <MenuItem value="">
                  <em>Tất cả trạng thái</em>
                </MenuItem>
                <MenuItem value="true">Có sẵn</MenuItem>
                <MenuItem value="false">Không có sẵn</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Card>

        {isTableLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        ) : user !== null && user.isAdmin === "true" ? (
          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  {renderTableHead()}
                  {renderTableBody()}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredCourts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số hàng mỗi trang"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
            />
          </Card>
        ) : filteredCourts.length > 0 ? (
          <div>
            <TablePagination
              component="div"
              count={filteredCourts.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[6, 12, 24]}
              labelRowsPerPage="Số sân mỗi trang"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
            />

            <Grid container spacing={3}>
              {filteredCourts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((court) => (
                  <Grid key={court._id} item xs={12} sm={6} md={4}>

                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ pt: '80%', position: 'relative' }}>
                        {(user !== null && user.isAdmin === "true") && (
                          <Label
                            variant="filled"
                            sx={{
                              zIndex: 9,
                              top: 12,
                              right: 16,
                              position: "absolute",
                              borderRadius: "100%",
                              width: "30px",
                              height: "30px",
                              color: "white",
                              backgroundColor: "white",
                            }}
                          >
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                setSelectedCourtId(court._id);
                                handleOpenMenu(e);
                              }}
                            >
                              <Iconify icon={"eva:more-vertical-fill"} />
                            </IconButton>
                          </Label>
                        )}

                        <StyledCourtImage
                          alt={court.court_name}
                          src={court.court_photo}
                        />
                      </Box>

                      <Stack spacing={1} sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Link
                          to={`/Courts/${court._id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <Typography textAlign="center" variant="h5" noWrap>
                            {court.court_name}
                          </Typography>
                        </Link>
                        
                        <Label color={court.status == "A" ? 'success' : 'error'} sx={{ padding: 2 }}>
                          {court.status == "A" ? 'Có sẵn' : 'Không có sẵn'}
                        </Label> 
                        
                        <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: 'center', justifyContent: 'center' }}>
                          <AccessTimeIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {court.opening_hours || "06:00 - 22:00"}
                          </Typography>
                        </Stack>
                        
                        
                        
                        <Box sx={{ mt: 1, mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Mô tả sân:
                          </Typography>
                          <ExpandableTypography 
                            variant="body2"
                            expanded={expandedDescriptions[court._id]}
                            onClick={() => toggleDescription(court._id)}
                          >
                            {court.description || "Chưa có mô tả chi tiết"}
                          </ExpandableTypography>
                          {(court.description && court.description.length > 100) && (
                            <Typography 
                              variant="body2" 
                              color="primary" 
                              sx={{ 
                                cursor: 'pointer',
                                textAlign: 'right',
                                fontSize: '0.8rem',
                                mt: 0.5
                              }}
                              onClick={() => toggleDescription(court._id)}
                            >
                              {expandedDescriptions[court._id] ? 'Thu gọn' : 'Xem thêm'}
                            </Typography>
                          )}
                        </Box>
                        
                        <Box sx={{ mt: 'auto', pt: 2 }}>
                          <Link to={`/courts/${court._id}`} style={{ textDecoration: 'none' }}>
                            <Button 
                              variant="outlined" 
                              color="primary" 
                              fullWidth
                            >
                              Xem chi tiết
                            </Button>
                          </Link>
                        </Box>
                        
                        <Link to={`/courts/schedule/${court._id}?courtName=${encodeURIComponent(court.court_name)}`} style={{ textDecoration: 'none' }}>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            sx={{ mt: 1 }}
                          >
                            Đặt sân
                          </Button>
                        </Link>
                      </Stack>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </div>
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            Không tìm thấy sân nào phù hợp với tiêu chí tìm kiếm.
          </Alert>
        )}

        <CourtDialog
          isDialogOpen={isDialogOpen}
          CourtId={selectedCourtId}
          handleDeleteCourt={deleteCourt}
          handleCloseDialog={handleCloseDialog}
        />

        <CourtForm
          isUpdateForm={isUpdateForm}
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          id={selectedCourtId}
          Court={Court}
          setCourt={setCourt}
          handleAddCourt={addCourt}
          handleUpdateCourt={updateCourt}
        />

        <ImportCourtsModal
          isOpen={isImportModalOpen}
          onClose={handleCloseImportModal}
        />

        <Popover
          open={Boolean(isMenuOpen)}
          anchorEl={isMenuOpen}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              p: 1,
              width: 140,
              "& .MuiMenuItem-root": {
                px: 1,
                typography: "body2",
                borderRadius: 0.75,
              },
            },
          }}
        >
          <MenuItem
            sx={{ color: "success.main" }}
            onClick={() => {
              setIsUpdateForm(true);
              getSelectedCourtDetails();
              handleOpenModal();
              handleCloseMenu();
            }}
          >
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Sửa
          </MenuItem>

          <MenuItem
            sx={{ color: "error.main" }}
            onClick={() => {
              handleOpenDialog();
              handleCloseMenu();
            }}
          >
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Xóa
          </MenuItem>
        </Popover>
      </Container>
    </>
  );
};

export default CourtPage;