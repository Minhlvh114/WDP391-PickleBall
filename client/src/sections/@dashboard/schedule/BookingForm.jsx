import { Box, Button, Container, Modal, Stack, TextField, Typography, Checkbox, FormGroup, FormControlLabel, FormControl, FormLabel, CircularProgress, FormHelperText, RadioGroup, Radio } from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from '../../../components/iconify';
import { useState, useEffect } from 'react';
import { format, addDays, subDays, isBefore, addWeeks, subWeeks, parse, set, getMonth, addHours, isAfter, isToday, isSameDay, getHours, getDate, getDay} from "date-fns";
import axios from "axios";
import { apiUrl, routes, methods } from "../../../constants";
import toast from "react-hot-toast";

const BookingForm = ({isForm, isFormOpen, setIsFormOpen, bookingList, orderData, weekDays}) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'white',
    borderRadius: '20px',
    boxShadow: 16,
    p: 4,
  };
  //init variable
    const [dateStart, setDateStart] = useState("")//start date variable
    const [dateEnd, setDateEnd] = useState("")
    const [currentDate, setCurrentDate] = useState(new Date());

//   const [selectDay, setSelectDay] = useState()
    let timeRentalParse ="";
//   const [slotFree, setSlotFree] = useState() // tạo mảng từ 0 -> 23 
    const slotFree = Array.from({ length: 24 }, (_, i) => i)
    const slotBusy = [3,4]

    //check box variable
    const [bookingDay, setBookingDay] = useState([]) // chứa mảng thời gian các lịch đã đặt theo ngày
    const [selectedSlots, setSelectedSlots] = useState([]); // Lưu danh sách giờ được chọn
    const [slotLongTime, setSlotLongTime] = useState()
    const [daysOfWeek, setDaysOfWeek] = useState()


    useEffect(() => {

        console.log("Modal mở → Cập nhật dateStart");
        // console.log("dateStart: ", dateStart)
        //Đặt lịch nhiều giờ
        if(isForm === 1){
            setCurrentDate(new Date())
    
            // console.log("currentDate: ", currentDate)
            console.log("getHours1: ", getHours(currentDate))
            const dateStartParse = parse(dateStart, "yyyy-MM-dd", new Date());
            //filter: get all booking by day
            const bookingDay = bookingList.reduce((acc, booking) => {
                timeRentalParse = parse(booking.time_rental, "dd/MM/yyyy HH:mm:ss", new Date());
                if (isSameDay(dateStartParse, timeRentalParse)) {
                    acc.push(getHours(timeRentalParse)); // Thêm vào mảng kết quả
                }
                return acc; // Trả về accumulator sau mỗi lần lặp
            }, []);
        
            console.log("bookingDay: ", bookingDay)
            
        
            setBookingDay(bookingDay)
        
            setSelectedSlots([])

        }
    
    

    }, [isFormOpen, dateStart]);


    const handleSelectDay = (e)=>{
        const dateStart = e.target.value
        setDateStart(dateStart)
    }

    const handleCheckBox = (e) => {

        const slot = parseInt(e.target.name);
        setSelectedSlots(prevSlots =>
            e.target.checked 
                ? [...prevSlots, slot]  // Nếu được check, thêm vào danh sách
                : prevSlots.filter(s => s !== slot) // Nếu bỏ check, loại bỏ khỏi danh sách
        );

    }

    const handleRadioBox = (e) => {
        console.log("e.target.value")
        console.log("e.target.value", e.target.value)
        const slotLongTime = e.target.value
        setSlotLongTime(slotLongTime)
    }

    const handleRadioBoxWeekDays = (e) => {
        console.log("e.target.value")
        console.log("e.target.value", e.target.value)
        const daysOfWeek = e.target.value
        setDaysOfWeek(daysOfWeek)
    }



    const handleCloseForm = () => {
        setDateStart("")
        setDateEnd("")
        setIsFormOpen(false);
    };

    ////////////////////handleBookingManyTime////////////////////

  const handleBookingManyTime = () =>{


    orderData.timeRental = selectedSlots.map( slot =>{
        const booked = set(dateStart, {hours: slot });
        return format(booked, "dd/MM/yyyy HH:mm:ss");
    })
    
    console.log("formatList: ",orderData )

    axios
    .post(apiUrl(routes.PAY, methods.CREATE_PAYMENT_LINK), orderData)
    .then((response) => {
        console.log(response.data.link);
        window.location.href = response.data.link;
    })
    .catch((response) => {
        console.log(response)
        console.error("Error create payment link:",response.response.data.message);
        toast.error(`Failed: ${response.response.data.message}`);
    });

  }

   ////////////////////handleBookingLongTime////////////////////
    const handleBookingLongTime = () =>{


        const dateStartParse = parse(dateStart, "yyyy-MM-dd", new Date())
        const bookingTime = set(dateStartParse, {hours: slotLongTime });
        const dateEndParse = parse(dateEnd, "yyyy-MM-dd", new Date())

        if(isAfter(dateStartParse, dateEndParse)){
            return  toast.error(`Failed: Start date and end date invalid`);
        }
       
        //laasy ngay

        const allSlot = Array.from(
            { length: (dateEndParse - dateStartParse) / (1000 * 60 * 60 * 24) + 1 }, 
            (_, index) => {
                 
                const setDate = addDays(bookingTime, index);
                return format(setDate, "dd/MM/yyyy HH:mm:ss");
            }
        );
        console.log("dateArray: ", allSlot);

        console.log("bookingList: ", bookingList);
        orderData.timeRental  = allSlot.filter(slot => {
            const isBooked = bookingList.some(book => book.time_rental === slot);
            return !isBooked; // Chỉ giữ lại slot chưa được đặt
        })
        console.log("result: ", orderData);
        axios
        .post(apiUrl(routes.PAY, methods.CREATE_PAYMENT_LINK), orderData)
        .then((response) => {
            console.log(response.data.link);
            window.location.href = response.data.link;
        })
        .catch((response) => {
            console.log(response)
            console.error("Error create payment link:",response.response.data.message);
            toast.error(`Failed: ${response.response.data.message}`);
        });
    

    }

    const handleBookingWeekDay = () =>{


        let dateStartParse = parse(dateStart, "yyyy-MM-dd", new Date())
        const bookingTime = set(dateStartParse, {hours: slotLongTime });
        const dateEndParse = parse(dateEnd, "yyyy-MM-dd", new Date())

        console.log("bookingTime: ", bookingTime)
        console.log("getDay(dateStartParse): ", getDay(dateStartParse))
        console.log("daysOfWeek: ", daysOfWeek)
    
        // let dayBooking = getDay(dateStartParse);
        let count = 0;
       
        while (getDay(dateStartParse) != daysOfWeek && count < 8) { 
            dateStartParse = addDays(dateStartParse, 1); // 🔥 FIXED
        }

        // console.log(123)
        console.log("dateStartParse: ", dateStartParse)

        const allSlot = [];
        let currentDate = dateStartParse;
    
        while (currentDate <= dateEndParse) {
            const slotDateTime = set(currentDate, { hours: slotLongTime }); // Set giờ vào slot
            allSlot.push(format(slotDateTime, "dd/MM/yyyy HH:mm:ss")); // Thêm vào mảng
            currentDate = addDays(currentDate, 7); // Nhảy sang tuần tiếp theo
        }
        console.log("allSlot: ", allSlot)
        orderData.timeRental  = allSlot.filter(slot => {
            const isBooked = bookingList.some(book => book.time_rental === slot);
            return !isBooked; // Chỉ giữ lại slot chưa được đặt
        })

        console.log("orderData: ", orderData)
        axios
        .post(apiUrl(routes.PAY, methods.CREATE_PAYMENT_LINK), orderData)
        .then((response) => {
            console.log(response.data.link);
            window.location.href = response.data.link;
        })
        .catch((response) => {
            console.log(response)
            console.error("Error create payment link:",response.response.data.message);
            toast.error(`Failed: ${response.response.data.message}`);
        });
    }
  

  return (
    <Modal
      open={isFormOpen}
      onClose={handleCloseForm}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Container>
          <Typography variant="h4" textAlign="center" paddingBottom={2} paddingTop={1}>
            Đặt lịch  {isForm ? <span>nhiều giờ</span> : <span>cố định</span>}
          </Typography>
          <Stack spacing={3} paddingY={2}>
            <TextField
              name="startDate"
              label="Start date:"
              type="date"
              value={dateStart || ""}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().split("T")[0] }}
              required
              onChange={isForm ? handleSelectDay : (e) => setDateStart(e.target.value)}
            />
            {   isForm === "1" ? (
                        <FormControl component="fieldset"  >

                        <FormLabel component="legend">Time:</FormLabel>
                        { !dateStart || dateStart ==="Invalid Date" ? (
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <CircularProgress size={24} sx={{ color: "black", mb: 1 }} />
                                <FormHelperText>Please select start date booking</FormHelperText>
                            </Box>
                        ) : (
                            <FormGroup  row>
                                {
                                    
                                    slotFree.map(i => {
                                        const isChecked = selectedSlots.includes(i);
                                        const dateStartParse = parse(dateStart, "yyyy-MM-dd", new Date());
                                        console.log("bookingDay: ",bookingDay)
                                        const isBooked = bookingDay.includes(i) || isSameDay(currentDate, dateStartParse) && i <= getHours(currentDate) ; // Kiểm tra xem giờ này có bị booked không
 

                                        return (
                                            <FormControlLabel key={i} label={`${i}:00`} 
                                                control={
                                                    <Checkbox disabled={isBooked} checked={isChecked}  onChange={handleCheckBox} name={`${i}`} />
                                                }  
                                            />
                                        );
                                      })
                                }
                   
                            </FormGroup>
                        )}  
                            

                    </FormControl>
                ) : isForm === "2" ? (
                    <>
                        <TextField
                            name="startDate"
                            label="End date:"
                            type="date"
                            value={dateEnd || ""}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: new Date().toISOString().split("T")[0] }}
                            required
                            onChange={(e) => setDateEnd(e.target.value)}
                        />
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Time</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                onChange={handleRadioBox}
                            >
                                {
                                    slotFree.map(i => {
                                        return <FormControlLabel key={i} value={i} control={<Radio disabled={i === 3 || i === 4}/>} label={`${i}:00`}  />
                                    })
                                }
                            </RadioGroup>
                        </FormControl>
                    </>
                ) : (
                    <>
                    <TextField
                        name="startDate"
                        label="End date:"
                        type="date"
                        value={dateEnd || ""}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: new Date().toISOString().split("T")[0] }}
                        required
                        onChange={(e) => setDateEnd(e.target.value)}
                    />
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Days of the week: </FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={handleRadioBoxWeekDays}
                        >
                            {
                                Object.keys(weekDays).map(i => {
                                    const day = weekDays[i].split(" - ")[0]; // Lấy phần trước dấu " - "
                                    return (<FormControlLabel key={i} value={i} control={<Radio/>} label={`${day}`} />)
                                })
                                // slotFree.map(i => {
                                //     return <FormControlLabel key={i} value={i} control={<Radio disabled={i === 3 || i === 4}/>} label={`${i}:00`}  />
                                // })
                            }
                        </RadioGroup>


                        <FormLabel id="demo-row-radio-buttons-group-label">Time: </FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={handleRadioBox}
                        >
                            {
                                slotFree.map(i => {
                                    return <FormControlLabel key={i} value={i} control={<Radio disabled={i === 3 || i === 4}/>} label={`${i}:00`}  />
                                })
                            }
                        </RadioGroup>
                    </FormControl>
                </>
                )

            }
            


            <br />
            <Box textAlign="center">
              <Button
                size="large"
                variant="contained"
                onClick={isForm === "1" ? handleBookingManyTime : isForm === "2" ? handleBookingLongTime : handleBookingWeekDay}
                startIcon={<Iconify icon="bi:check-lg" />}
                style={{ marginRight: '12px' }}
              >
                Submit
              </Button>

              <Button
                size="large"
                color="inherit"
                variant="contained"
                onClick={handleCloseForm}
                startIcon={<Iconify icon="charm:cross" />}
                style={{ marginLeft: '12px' }}
              >
                Cancel
              </Button>
            </Box>

            
          </Stack>
        </Container>
      </Box>
    </Modal>
  );
};

BookingForm.propTypes = {
    isForm: PropTypes.string,
    isFormOpen: PropTypes.bool,
    setIsFormOpen: PropTypes.func,
    bookingList: PropTypes.array,
    setBooking: PropTypes.func,
    orderData: PropTypes.object,
    weekDays: PropTypes.object,
};

export default BookingForm;
