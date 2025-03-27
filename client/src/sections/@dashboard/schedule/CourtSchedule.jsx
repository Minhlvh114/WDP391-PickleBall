// import { ScheduleMeeting } from 'react-schedule-meeting';
import { useEffect, useState, useCallback } from "react";
import CalendarWeek from "rt-event-calendar";
import { format, addDays, subDays, isBefore, addWeeks, subWeeks, parse, set, getMonth, addHours, isAfter, isToday, isSameDay, getHours, isEqual} from "date-fns";
import { Helmet } from "react-helmet-async";
import { useSearchParams, useParams, useNavigate, Link as RouterLink, } from "react-router-dom";
import { Typography, Button, Breadcrumbs, Link, Stack, Container, } from "@mui/material";
import axios from "axios";
import { useAuthStore } from "../../../store/authStore";
import { apiUrl, routes, methods } from "../../../constants";
import toast from "react-hot-toast";
import Iconify from "../../../components/iconify";
import BookingForm from "./BookingForm";


const CourtSchedule = () => {
  /////////////////////init variable///////////////////
  const navigate = useNavigate();
  //Date variable
  // const today = format(new Date(), "dd/MM");
  const [today, setToday] = useState(new Date());
  const { user } = useAuthStore();
  const { id } = useParams(); // court id
  const [searchParams] = useSearchParams();
  const courtName = searchParams.get("courtName");
  const orderCode = searchParams.get("orderCode");
  const status = searchParams.get("status");

  //booking form variable
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isForm, setIsForm] = useState("");


  //data variable
  const orderData = {
    email: user.email,
    phone: user.phone,
    name: user.name,
    userId: user._id,
    courtId: id,
    courtName: courtName,
    // price: 5000,
    timeRental: [],
    // endTime: "",
    // price: 150000
  };

  // const [orderData, setOrderData] = useState({
  //   email: user.email,
  //   phone: user.phone,
  //   name: user.name,
  //   userId: user._id,
  //   courtId: id,
  //   courtName: courtName,
  //   timeRental: [],
  // });

  const [bookingList, setBookingList] = useState([]);
 
  //calender variable
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workingTime, setWorkingTime] = useState([0, 24]);
  // const [weekStart, setWeekStart] = useState(true);
  const weekStart = true;
  const [daysOff] = useState([]);
  const [weekDays, setWeekDays] = useState({});
  const [busyHours, setBusyHours] = useState({});

  //////////////////////////////////////////////////////////////HANDLE AXIOS//////////////////////////////////////////////////////////////////////


  const getAllBillByCourtIdAndDate = (weekDays) => {
    // init variable
    let lastDayOfWeek = Object.entries(weekDays).at(-1); // Lấy ngày cuối cùng của tuần
    let firstDayOfWeek = Object.entries(weekDays).at(0); // Lấy ngày đầu tiên của tuần
    let lastDayOfWeekParese = parse(lastDayOfWeek[1], "EEEE - dd/MM", new Date());
    let firstDayOfWeekParese = parse( firstDayOfWeek[1], "EEEE - dd/MM", new Date());
    let timeRentalParse = null;
    let bookingOfWeek = [];
    let bookingList = [];
    let time = "";
    console.log(123)
    axios
      .get(apiUrl(routes.BORROWER, methods.GET_ALL_BY_DATE, id))
      .then((response) => {
        bookingList = response.data.bookingList;
        console.log("bookingList: ", response.data);
        setBookingList(bookingList)
        //check schedule this week or next week
        if (isAfter(currentDate, firstDayOfWeekParese)) {

          //set bill list:  all bill of this week
          bookingOfWeek = bookingList.reduce((acc, booking) => {
            timeRentalParse = parse(booking.time_rental, "dd/MM/yyyy HH:mm:ss", new Date());
            if ((isBefore(currentDate, timeRentalParse) && isAfter(lastDayOfWeekParese, timeRentalParse)) || isToday(timeRentalParse) || isSameDay(lastDayOfWeekParese, timeRentalParse)) {
              acc.push(booking.time_rental);
            }
            return acc;
          }, []);
        } else {
          //set bill list:  all bill of this week
          bookingOfWeek = bookingList.reduce((acc, booking) => {
            timeRentalParse = parse(booking.time_rental, "dd/MM/yyyy HH:mm:ss", new Date());
            if ((isBefore(firstDayOfWeekParese, timeRentalParse) && isAfter(lastDayOfWeekParese, timeRentalParse)) || isSameDay(firstDayOfWeekParese, timeRentalParse) || isSameDay(lastDayOfWeekParese, timeRentalParse)) {
              acc.push(booking.time_rental);
            }
           
            return acc;
          }, []);
        }

        // console.log(bookingOfWeek);

        //After have bookingOfWeek => handle busyHours
        const busyHours = Object.keys(weekDays).reduce((acc, key) => {
          // console.log()
          let dayParese = parse(weekDays[key], "EEEE - dd/MM", new Date());
          
          acc[key] = [3, 4]; //default busy hour

          //set busy house if day of week < currentDate
          if(isAfter(currentDate, dayParese) && !isSameDay(dayParese, currentDate)){
              acc[key] = [...acc[key], ...Array.from({ length: 24 }, (_, i) => i)];
          }else if (isAfter(currentDate, dayParese) && isSameDay(dayParese, currentDate)){
            const newNumbers = Array.from({ length: getHours(currentDate) + 1 }, (_, i) => i); // Tạo mảng [0, 1, 2]
            acc[key] = [...acc[key], ...newNumbers]; // Hợp nhất mảng cũ với số mới
          }

          //check list bill !== undefined
          if (bookingOfWeek.length > 0) {
            bookingOfWeek.forEach((timeRental) => {
              const timeRentalParse = parse(timeRental, "dd/MM/yyyy HH:mm:ss", new Date() );
              if (isSameDay(timeRentalParse, dayParese) && isAfter(currentDate, dayParese) && timeRentalParse.getHours() >= getHours(currentDate)) {
                acc[key].push(timeRentalParse.getHours()); //add busy hour per day in week
              }
            });
          }

          return acc;
        }, {});
        // console.log("busyHours: ", busyHours);
        // console.log("weekDays: ", weekDays);
        // console.log("currentDate: ", currentDate);

        // if(weekDays[0])
        
        setBusyHours(busyHours);

        // return response.data
      })
      .catch((response) => {
        console.log("Error:", response);
        console.error("Error:", response.response.data.error);
        toast.error(`Failed: ${response.response.data.message} to create link`);
      });
  };

  //////////////////////////////////////////////////////////HANDLE BUTTON////////////////////////////////////////////////////////////////////////////////////////

  const handleClickEvent = (clickedDay, clickedHour) => {
    // alert(`Clicked ${clickedHour} in ${weekDays[clickedDay]}`);

    const dayBooking = weekDays[clickedDay];

    //check date 01/01
    let currentYear = currentDate.getFullYear(); // Lấy năm hiện tại kiểm tra (biến này dùng để cộng năm nếu qua ngày 1/1)
    if (getMonth(currentDate) === 11 && getMonth(dayBooking) === 0) {
      currentYear = currentYear + 1;
    }

    //data
    const parsedDate = parse(dayBooking, "EEEE - dd/MM", new Date());

    const timeBooking = set(parsedDate, {year: currentYear, hours: clickedHour });
    const timeBookingFormat = format(timeBooking, "dd/MM/yyyy HH:mm:ss");
    // const endTimeBooking = format(addHours(timeBooking, 1),"dd/MM/yyyy HH:mm:ss");
    console.log("timeBooking:", timeBooking);
    console.log("timeBookingFormat:", timeBookingFormat);
    // console.log("abc4:", endTimeBooking);

    //set busy hour( không cần cũng được)
    // setBusyHours((prevBusyHours) => ({
    //   ...prevBusyHours,
    //   [clickedDay]: [...(prevBusyHours[clickedDay] || []), clickedHour],
    // }));

    // console.log("busyHours: ", busyHours)

    //set orderData
    orderData.timeRental.push(timeBookingFormat);
    // orderData.endTime = endTimeBooking;

    console.log("orderData: ", orderData)

    axios
      .post(apiUrl(routes.PAY, methods.CREATE_PAYMENT_LINK), orderData)
      .then((response) => {
        console.log(response.data.link);
        orderData.timeRental = []
        window.location.href = response.data.link;
      })
      .catch((response) => {
        console.log(response)
        console.error("Error create payment link:",response.response.data.message);
        toast.error(`Failed: ${response.response.data.message}`);
      });

      orderData.timeRental = []
  };

  useEffect(() => {

    
    ///////////////////////////////////////////////////////////////////////////////handle logic set currentday of week/////////////////////////////////////////////////////////////////////////////////////////////////
    const object = {};
    const weekDays = [0, 1, 2, 3, 4, 5, 6].reduce(
      (accumulator, currentValue, currentIndex, array) => {
        if (today.getDay() < currentIndex) {
          const dayPosition = currentIndex - today.getDay();
          const day = addDays(today, dayPosition);
          accumulator[currentIndex] = `${format(day, "EEE - dd/MM")}`;
        } else if (today.getDay() > currentIndex) {
          const dayPosition = today.getDay() - currentIndex;
          const day = subDays(today, dayPosition);
          accumulator[currentIndex] = `${format(day, "EEE - dd/MM")}`;
        } else {
          accumulator[currentIndex] = `${format(today, "EEE - dd/MM")}`;
        }
        return accumulator;
      },
      object
    );
   
    // console.log(weekDays)
    setWeekDays(weekDays);


    setCurrentDate(new Date());

    ////////////////////////////handle logic bill and busy hours////////////////////////////

    // console.log("orderCode", orderCode)
    // console.log("orderCode", courtName)
    // if (orderCode !== null && status === "PAID") {
    //   updateBillByOrderCode();
    // } else 
    if (orderCode !== null && status !== "PAID") {
      toast.error(`bạn đã huỷ đặt lịch`);
    }

    // const bills = getAllBillByCourtIdAndDate(weekDays)
    getAllBillByCourtIdAndDate(weekDays);

    // console.log(bills)
  }, [today]);

  const handleChangeNextWeek = () => {
    setToday(addWeeks(today, 1));
  };

  const handleChangeLastWeek = () => {
    setToday(subWeeks(today, 1));
  };

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };


  return (
    <div>
      <Helmet>
        <title> - Booking Schedule</title>
      </Helmet>
      <Typography variant="h3" gutterBottom>
        Booking
      </Typography>

      {/* <Button variant="outlined" color="primary" onClick={backToCourtDetailPage} sx={{ mb: 2 }}>
        Back to Courts Details
      </Button> */}

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          {/* Nút đường dẫn link */}
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link component={RouterLink} to="/">
              Landingpage
            </Link>
            <Link component={RouterLink} to="/courts">
              Danh sách sân
            </Link>
            <Link component={RouterLink} to={`/courts/${id}`}>
              {courtName}
            </Link>
            <Typography color="text.primary">Schedule</Typography>
          </Breadcrumbs>
          {/* Nút CRUD */}
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={() => {
                setIsForm("1")
                handleOpenForm();
              }}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Đặt lịch nhiều giờ
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setIsForm("2")
                handleOpenForm();
              }}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Đặt lịch hàng ngày
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setIsForm("3")
                handleOpenForm();
              }}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Đặt lịch theo ngày trong tuần
            </Button>
          </Stack>
        </Stack>
      </Container>

      {/* Nút chuyển ngày và tiêu đề */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button onClick={handleChangeLastWeek}>← Previous</button>
        <h2>{format(currentDate, "EEEE - dd/MM/yyyy")}</h2>
        <button onClick={handleChangeNextWeek}>Next →</button>
      </div>

      <CalendarWeek
        weekDays={weekDays}
        workingTime={workingTime}
        weekStart={weekStart}
        busyHours={busyHours}
        daysOff={daysOff}
        onClick={handleClickEvent}
      />

      <BookingForm
        isForm={isForm}
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        // courtId={id}
        weekDays={weekDays}
        bookingList={bookingList}
        orderData={orderData}
    />
    </div>

  );
};

export default CourtSchedule;
