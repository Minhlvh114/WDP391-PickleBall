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
  Court,
  setCourt,
  handleAddCourt,
  handleUpdateCourt
}) => {

  const [isModalLoading, setIsModalLoading] = useState(false);

  const handleSubmit = () => {
    const payload = { ...Court };

    console.log("Payload:", payload);

    if (isUpdateForm) {
      handleUpdateCourt(payload);
    } else {
      handleAddCourt(payload);
    }
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
            {isUpdateForm ? <span>Update</span> : <span>Add</span>} court
          </Typography>

          {
            isModalLoading ? <Grid padding={4} style={{ "textAlign": "center" }}><CircularProgress /></Grid> :
              <Stack spacing={3} paddingY={2} paddingX={3}
                height="600px"
                overflow="scroll">

                <TextField name="court_name" label="Court name" value={Court.court_name} autoFocus required
                  onChange={(e) => setCourt({ ...Court, court_name: e.target.value })} />

                <TextField name="price" label="Price" value={Court.price} required
                  onChange={(e) => setCourt({ ...Court, price: e.target.value })} />

                <TextField name="court_photo" label="Court photo URL" value={Court.court_photo} required
                  onChange={(e) => setCourt({ ...Court, court_photo: e.target.value })} />

                <FormControl>
                  <FormLabel id="status-label">Status</FormLabel>
                  <RadioGroup
                    aria-labelledby="status-label"
                    defaultValue={Court.status}
                    name="radio-buttons-group"
                    onChange={(e) => setCourt({ ...Court, status: e.target.value })}
                  >
                    <FormControlLabel value="A" control={<Radio />} label="Available" />
                    <FormControlLabel value="B" control={<Radio />} label="Not available" />
                  </RadioGroup>
                </FormControl>

                <Box textAlign="center" paddingBottom={2}>
                  <Button size="large" variant="contained"
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
  court: PropTypes.object,
  setCourt: PropTypes.func,
  handleAddCourt: PropTypes.func,
  handleUpdateCourt: PropTypes.func,
};

export default CourtForm;