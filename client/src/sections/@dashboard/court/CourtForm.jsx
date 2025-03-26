import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Iconify from "../../../components/iconify";

const CourtForm = ({
  isUpdateForm,
  isModalOpen,
  handleCloseModal,
  book,
  setCourt,
  handleAddCourt,
  handleUpdateCourt
}) => {

  const [isModalLoading, setIsModalLoading] = useState(true)




  const parsePageUrls = (pageUrlsString) => {
    // check string before split 
    if (typeof pageUrlsString === 'string') {
      return pageUrlsString.split(';').map(url => url.trim());
    }
    return [];
  };

  const handleSubmit = () => {
    const payload = { ...book, pageUrls: book.pageUrls };

    console.log("Payload:", payload);

    if (isUpdateForm) {
      handleUpdateCourt(payload);
    } else {
      handleAddCourt(payload);
    }
  };


  const handlePageUrlsChange = (event) => {
    const pageUrlsString = event.target.value;
    const pageUrlsArray = parsePageUrls(pageUrlsString);
    setCourt({ ...book, pageUrls: pageUrlsArray });
  };


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'white',
    borderRadius: '20px',
    boxShadow: 16,
    p: 2,
  };


  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Container>
          <Typography variant="h4" textAlign="center" paddingBottom={2} paddingTop={1}>
            {isUpdateForm ? <span>Update</span> : <span>Add</span>} book
          </Typography>

          {
            isModalLoading ? <Grid padding={4} style={{ "textAlign": "center" }}><CircularProgress /></Grid> :
              <Stack spacing={3} paddingY={2} paddingX={3}
                height="600px"
                overflow="scroll">

                <TextField name="name" label="Court name" value={book.name} autoFocus required
                  onChange={(e) => setCourt({ ...book, name: e.target.value })} />
                <TextField name="isbn" label="ISBN" value={book.isbn} required
                  onChange={(e) => setCourt({ ...book, isbn: e.target.value })} />
                <TextField name="position" label="Court position" value={book.position} autoFocus required
                  onChange={(e) => setCourt({ ...book, position: e.target.value })} />


                <FormControl>
                  <FormLabel id="available-label">Availability</FormLabel>
                  <RadioGroup
                    aria-labelledby="available-label"
                    defaultValue={book.isAvailable}
                    name="radio-buttons-group"
                    onChange={(e) => setCourt({ ...book, isAvailable: e.target.value })}
                  >
                    <FormControlLabel value control={<Radio />} label="Available" />
                    <FormControlLabel value={false} control={<Radio />} label="Not available" />
                  </RadioGroup>
                </FormControl>

                <TextField name="summary" label="Summary" value={book.summary} multiline
                  rows={2}
                  maxRows={4}
                  onChange={(e) => setCourt({ ...book, summary: e.target.value })}
                />

                {/* <Button
                  size="large"
                  variant="outlined"
                  component="label"
                  color="info"
                >
                  Upload photo
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    hidden
                  />
                </Button> */}

                <TextField name="photoURL" label="photoURL" value={book.photoUrl} required
                  onChange={(e) => setCourt({ ...book, photoUrl: e.target.value })} />

                {/* <TextField name="pageUrls" label="pageUrls" value={book.pageUrls} required
                  onChange={(e) => setCourt({ ...book, pageUrls: e.target.value })} /> */}

                <TextField
                  name="pageUrls"
                  label="Page URLs (semicolon separated)"
                  value={book.pageUrls.join('; ')}
                  required
                  onChange={handlePageUrlsChange}
                />
                <pre>{JSON.stringify(book.pageUrls, null, 2)}</pre>
                <br />

                <Box textAlign="center" paddingBottom={2}>
                  <Button size="large" variant="contained"
                    // onClick={isUpdateForm ? handleUpdateCourt : handleAddCourt}
                    onClick={handleSubmit}
                    startIcon={<Iconify icon="bi:check-lg" />} style={{ marginRight: "12px" }}>
                    Submit
                  </Button>

                  <Button size="large" color="inherit" variant="contained" onClick={handleCloseModal}
                    startIcon={<Iconify icon="charm:cross" />} style={{ marginLeft: "12px" }}>
                    Cancel
                  </Button>
                </Box>
              </Stack>
          }
        </Container>
      </Box>
    </Modal>
  );
}

CourtForm.propTypes = {
  isUpdateForm: PropTypes.bool,
  isModalOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func,
  book: PropTypes.object,
  setCourt: PropTypes.func,
  handleAddCourt: PropTypes.func,
  handleUpdateCourt: PropTypes.func,
};

export default CourtForm
