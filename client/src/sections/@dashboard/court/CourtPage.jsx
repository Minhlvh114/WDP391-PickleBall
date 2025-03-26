import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
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
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../../hooks/useAuth';
import Scrollbar from '../../../components/scrollbar';
import Label from '../../../components/label';
import CourtDialog from './CourtDialog';
import CourtForm from './CourtForm';
import Iconify from '../../../components/iconify';
import { apiUrl, methods, routes } from '../../../constants';
import ImportCourtsModal from './ImportCourtsModal';

const StyledCourtImage = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

const TruncatedTypography = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 5,
  WebkitBoxOrient: 'vertical',
  position: 'relative',
  '&::after': {
    content: '"..."',
    position: 'absolute',
    bottom: 0,
    right: 0,
    background: 'white',
  },
});

const CourtPage = () => {
  // const { user } = useAuth();
  const  user = { isAdmin: false };

  const [Court, setCourt] = useState({
    id: '',
    court_name: '',
    isbn: '',
    // isAvailable: true,
    court_photo: '',
    status: '',
    // pageUrls: [],
    // position: '',
  });

  const [Courts, setCourts] = useState([]);
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [selectedCourtId, setSelectedCourtId] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterIsAvailable, setFilterIsAvailable] = useState('');

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  const getAllCourts = () => {
    axios
      .get(apiUrl(routes.COURT, methods.GET_ALL))
      .then((response) => {
        console.log("dcm")
        console.log(response.data.courtsList)
        setCourts(response.data.courtsList);
        setFilteredCourts(response.data.courtsList);
        setIsTableLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching Courts:', error);
        console.error('Error fetching Courts:', error);
        toast.error('Failed to fetch Courts');
      });
  };

  const addCourt = () => {
    axios
      .post(apiUrl(routes.COURT, methods.POST), Court)
      .then((response) => {
        toast.success('Court added successfully');
        handleCloseModal();
        getAllCourts();
        clearForm();
      })
      .catch((error) => {
        console.error('Error adding Court:', error);
        toast.error('Failed to add Court');
      });
  };

  const updateCourt = () => {
    axios
      .put(apiUrl(routes.COURT, methods.PUT, selectedCourtId), Court)
      .then((response) => {
        toast.success('Court updated successfully');
        handleCloseModal();
        handleCloseMenu();
        getAllCourts();
        clearForm();
      })
      .catch((error) => {
        console.error('Error updating Court:', error);
        toast.error('Failed to update Court');
      });
  };

  const deleteCourt = (CourtId) => {
    axios
      .delete(apiUrl(routes.COURT, methods.DELETE, CourtId))
      .then((response) => {
        toast.success('Court deleted successfully');
        handleCloseDialog();
        handleCloseMenu();
        getAllCourts();
      })
      .catch((error) => {
        console.error('Error deleting Court:', error);
        toast.error('Failed to delete Court');
      });
  };



 

  const getSelectedCourtDetails = () => {
    const selectedCourt = Courts.find((element) => element._id === selectedCourtId);
    setCourt(selectedCourt);
  };

  const clearForm = () => {
    setCourt({
      id: '',
      court_name: '',
      isbn: '',
      // isAvailable: true,
      court_photo: '',
      status: '',
      // pageUrls: [],
      // position: '',
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

  useEffect(() => {
    if (filterName.trim() === '' && filterIsAvailable === '') {
      setFilteredCourts(Courts);
    } else {
      let filteredResults = Courts;


      setFilteredCourts(filteredResults);
    }
  }, [filterName, Courts]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // function formatDate(date) {
  //   const d = new Date(date);
  //   let day = '' + d.getDate();
  //   let month = '' + (d.getMonth() + 1);
  //   const year = d.getFullYear();

  //   if (day.length < 2) day = '0' + day;
  //   if (month.length < 2) month = '0' + month;

  //   return [day, month, year].join('/');
  // }

  const tableHeadCells = [
    { id: 'courtPhoto', label: 'Photo', alignRight: false },
    { id: 'courtName', label: 'Name', alignRight: false },
    { id: 'status', label: 'Availability', alignRight: false },
    { id: 'createdAt', label: 'Created At', alignRight: false },
    // { id: 'actions', label: 'Actions', alignRight: true },
  ];

  const renderTableHead = () => (
    <TableHead>
      <TableRow>
        {tableHeadCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
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
      {filteredCourts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((Court) => {
        console.log("Court dcm ")
        console.log(Court)
        const { _id, court_photo, court_name, status, } = Court;

        return (
          <TableRow key={_id}>
            <TableCell>
              <img src={court_photo} alt={court_name} width="100" height="100" />
            </TableCell>
            <TableCell>
              <Link to={`/Courts/${_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {court_name}
              </Link>
            </TableCell>
            {/* <TableCell>{position}</TableCell> */}
        
            <TableCell>
              <Label color={status ? 'success' : 'error'} sx={{ padding: 2 }}>
                {status ? 'Available' : 'Not available'}
              </Label>
            </TableCell>
            {/* <TableCell>{formatDate(createdAt)}</TableCell> */}
            <TableCell align="right">
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => {
                  setSelectedCourtId(Court._id);
                  handleOpenMenu(e);
                }}
              >
                <Iconify icon={'eva:more-vertical-fill'} />
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
        <title>Courts | Court Management</title>
      </Helmet>

      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Courts
          </Typography>
          {user.isAdmin === true || user.isLibrarian === true ? (
            <Stack direction="row" spacing={2}>
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModal}>
                New Court
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:cloud-upload-outline" />}
                onClick={() => {
                  handleOpenImportModal();
                }}
              >
                Import Courts
              </Button>
            </Stack>
          ): null}
        </Stack>

        <Stack direction="row" spacing={2} mb={5}>
          <TextField
            variant="outlined"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Search by name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-outline" />
                </InputAdornment>
              ),
            }}
          />
   
         
          <Select
            displayEmpty
            value={filterIsAvailable}
            onChange={(e) => setFilterIsAvailable(e.target.value)}
            input={<OutlinedInput />}
          >
            <MenuItem value="">
              <em>All Availability</em>
            </MenuItem>
            <MenuItem value="true">Available</MenuItem>
            <MenuItem value="false">Not Available</MenuItem>
          </Select>
        </Stack>

        {isTableLoading ? (
          <Grid padding={2} style={{ textAlign: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : user.isAdmin || user.isLibrarian ? (
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
            />

            <Grid container spacing={3}>
              {filteredCourts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((Court) => (
                  <Grid key={Court._id} item xs={12} sm={6} md={4}>
                <Card>
                  <Box sx={{ pt: '80%', position: 'relative' }}>
  
                    {(user.isAdmin || user.isLibrarian) && (
                      <Label
                        variant="filled"
                        sx={{
                          zIndex: 9,
                          top: 12,
                          right: 16,
                          position: 'absolute',
                          borderRadius: '100%',
                          width: '30px',
                          height: '30px',
                          color: 'white',
                          backgroundColor: 'white',
                        }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            setSelectedCourtId(Court._id);
                            handleOpenMenu(e);
                          }}
                        >
                          <Iconify icon={'eva:more-vertical-fill'} />
                        </IconButton>
                      </Label>
                    )}

                    <StyledCourtImage alt={Court.court_name} src={Court.court_photo} />
                  </Box>

                  <Stack spacing={1} sx={{ p: 2 }}>
                    <Link to={`/courts/${Court._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography textAlign="center" variant="h5" noWrap>
                        {Court.court_name}
                      </Typography>
                    </Link>
                    {/* <Typography
                      variant="subtitle1"
                      sx={{ color: '#888888' }}
                      paddingBottom={1}
                      noWrap
                      textAlign="center"
                    >
                      {Court.court_name}
                    </Typography> */}
                    {/* <Label color={Court.status ? 'success' : 'error'} sx={{ padding: 2 }}>
                      {Court.status ? 'Available' : 'Not available'}
                    </Label> */}

                    <Typography variant="subtitle2" textAlign="center" paddingTop={1}>
                      ISBN: {Court.court_name}
                    </Typography>
                    <TruncatedTypography variant="body2">{Court.court_name}</TruncatedTypography>
                  </Stack>
                </Card>
              </Grid>
                ))}
            </Grid>
            </div>
        ) : (
          <>
          
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0}>
              <Button
                variant="contained"
                component={Link}
                to="#"
                onClick={() => {
                  handleOpenModal();
                  setIsUpdateForm(false);
                }}
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New Court
              </Button>

              <Stack direction="row" spacing={2}>
                <OutlinedInput
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="Search by name"
                />
               
                
                <Select
                  value={filterIsAvailable}
                  onChange={(e) => setFilterIsAvailable(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="true">Available</MenuItem>
                  <MenuItem value="false">Not Available</MenuItem>
                </Select>
              </Stack>
            </Stack>

            <TablePagination
              component="div"
              count={filteredCourts.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[3, 6, 9]} // Pagination options
            />

            <Grid container spacing={3}>
              {filteredCourts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((Court) => (
                  <Grid key={Court._id} item xs={12} sm={6} md={4}>
                    <Card>
                      <Box sx={{ pt: '100%', position: 'relative' }}>
                        {Court.isAvailable && (
                          <Label
                            variant="filled"
                            color="info"
                            sx={{
                              zIndex: 9,
                              top: 16,
                              right: 16,
                              position: 'absolute',
                              textTransform: 'uppercase',
                            }}
                          >
                            Available
                          </Label>
                        )}
                        <StyledCourtImage alt={Court.name} src={Court.photoUrl} />
                      </Box>

                      <Stack spacing={2} sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="subtitle1" noWrap>
                            {Court.name}
                          </Typography>
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => {
                              handleOpenMenu(event);
                              setSelectedCourtId(Court._id);
                            }}
                          >
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </Stack>

                        <Typography variant="body2" color="text.secondary" noWrap>
                          ISBN: {Court.court_name}
                        </Typography>

                        <TruncatedTypography variant="body2" color="text.secondary">
                          Summary: {Court.court_name}
                        </TruncatedTypography>

                        <Typography variant="body2" color="text.secondary">
                          Position: {Court.court_name}
                        </Typography>
                      </Stack>
                    </Card>
                  </Grid>
                ))}
            </Grid>

            {/* <TablePagination
              component="div"
              count={filteredCourts.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[3, 6, 9]} // Pagination options
            /> */}
          </>
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

        <ImportCourtsModal isOpen={isImportModalOpen} onClose={handleCloseImportModal} />

        <Popover
          open={Boolean(isMenuOpen)}
          anchorEl={isMenuOpen}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              p: 1,
              width: 140,
              '& .MuiMenuItem-root': {
                px: 1,
                typography: 'body2',
                borderRadius: 0.75,
              },
            },
          }}
        >
          <MenuItem
            sx={{ color: 'success.main' }}
            onClick={() => {
              setIsUpdateForm(true);
              getSelectedCourtDetails();
              handleOpenModal();
              handleCloseMenu();
            }}
          >
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>

          <MenuItem
            sx={{ color: 'error.main' }}
            onClick={() => {
              handleOpenDialog();
              handleCloseMenu();
            }}
          >
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Popover>
      </Container>
    </>
  );
};

export default CourtPage;
