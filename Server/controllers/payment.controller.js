const mongoose = require("mongoose");
const db = require('../models');
const PayOS = require('@payos/node');
const { parse, addHours, format, isAfter, isSameDay, add, addMinutes, isEqual, isBefore } =  require("date-fns");
// const { utcToZonedTime } = require("date-fns-tz");
const Bill = db.bill;
const Borrower = db.borrower;
const Court = db.court



const createPayment = async (req, res, next) => {

    /////////////init varible///////////////////////
    //Lấy Timestamp hiện tại + 10 phút 
    const timestamp = Math.floor(Date.now() / 1000)+600; // Chia 1000 để lấy giây
    const currentDate = new Date()
    const data = req.body
    console.log("data.timeRental.length:", data.timeRental.length)
    // const timeRentalParse = parse(data.timeRental, "dd/MM/yyyy HH:mm:ss", new Date())
    let booking = {}
    let bookingTime
     // const payos = new PayOS("client_id", "api-key", "checksum-key")
     const payos = new PayOS("02b2d39e-1d67-41ca-b1ae-039a07a45707", "e057c61d-2dec-4167-bc19-204753a0a3ea", "979184336c54f1b798529b6db93eb49d2af2c520376febf1a19bbf2f1c46ff78")
    const YOUR_DOMAIN = "http://localhost:3000"


    //check time rental is validate
    if(data.timeRental.length === 1){
        const timeRentalParse = parse(data.timeRental[0], "dd/MM/yyyy HH:mm:ss", new Date())

        if(isAfter(currentDate, timeRentalParse)){
            return res.status(500).json({
                success: false,
                message: "Cant booking because timeBooking invalid"
            });
        }
      
    }

    try {


        for(time of data.timeRental){
            const bookingList = await Borrower.find({time_rental: time});
            if(bookingList){
                for(booking of bookingList){
                    console.log("booking:", booking)
                    const createdAt = addMinutes(booking.createdAt, 10);
                    bookingTime = parse(booking.time_rental, "dd/MM/yyyy HH:mm:ss", new Date())
                    const timeRentalParse = parse(time, "dd/MM/yyyy HH:mm:ss", new Date())
                    // console.log("timeRentalParse: ", timeRentalParse)
                    if(isEqual(bookingTime, timeRentalParse)){
                        console.log(123)
                        if(booking.status === "success"){
                            console.log(2222)
                            return res.status(400).json({
                                success: false,
                                message: "Cant booking because duplicate"
                            });
                        }else if(booking.status === "pending" && isBefore(currentDate, createdAt)){
                            console.log(33333)
                            return res.status(400).json({
                                success: false,
                                message: `Already booking but not payment if you want booking pls come back after ${format(createdAt, "dd/MM HH:mm:ss")}`
                            });
                        }
                    }
                }
            }

        }


    
         //get booking list
        const court = await Court.findById(data.courtId);

        console.log("court: ", court.price*data.timeRental.length)


        //create new bill
        const newBillData = {
            amount_price: court.price*data.timeRental.length,
            user_id: data.userId,
            order_code_pay_os: getRandomNumber(),
            // status: "PENDING",
        };
        const newBill = new Bill(newBillData);
        const savedBill = await newBill.save();
        
        // console.log("newBill: ", newBill)
        
        // console.log("newBill: ", data)
        //create new booking
        
        for(time of data.timeRental){
            const parsedDate = parse(time, "dd/MM/yyyy HH:mm:ss", new Date());
            const endTimeBooking = format(addHours(parsedDate, 1),"dd/MM/yyyy HH:mm:ss");
            const newBorrowData = {
                bill_id: newBill.id,
                user_id: data.userId,
                court_id: data.courtId,
                time_rental: time,
                end_time_rental: endTimeBooking,
            };
            const newBorrow = new Borrower(newBorrowData);
            console.log("newBorrowData: ", newBorrowData)
            const savedBorrow = await newBorrow.save();

        }

     





        // data send to PAYOS
        const order = {
            amount: court.price*data.timeRental.length,
            description: `${newBill.id}`,
            buyerName: data.name,
            buyerEmail: data.email,
            buyerPhone: data.phone,
            orderCode: newBill.order_code_pay_os,
            items: [{name: court.id, price: court.price, quantity: 1}],
            returnUrl: `${YOUR_DOMAIN}/courts/schedule/${data.courtId}?courtName=${encodeURIComponent(data.courtName)}`,
            cancelUrl: `${YOUR_DOMAIN}/courts/schedule/${data.courtId}?courtName=${encodeURIComponent(data.courtName)}`,
            expiredAt: timestamp,
        }
       

          
            //call PAYOS api
            const paymentLink = await payos.createPaymentLink(order);
            console.log(paymentLink)
            // res.redirect(303, paymentLink.checkoutUrl)
            return res.status(200).json({
                success: true,
                link: paymentLink.checkoutUrl,
            });
    } catch (error) {
        console.error(error.message)
        console.error(error)
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

// webhook-url https using ngrok
// https://5126-14-177-236-71.ngrok-free.app/api/payment/receive-hook
const webHook = async (req, res, next) => {

    // console.log(req.body)

    if(req.body.data.orderCode!==123){
        console.log(req.body)
        const data = req.body.data
        // const timeRental =  parse(req.body.data.description, "dd/MM/yyyy hh:mm:ss a", new Date());
        // console.log(timeRental)

            


        const billData = {
            counter_account_name: data.counterAccountName,
            counter_account_number: data.counterAccountNumber,
            transaction_bank_time: data.transactionDateTime, // Đổi từ transaction_date_time sang transaction_bank_time
            reference_bank: data.reference,
            status:  "PAID",
          };

        try {

            if (!mongoose.Types.ObjectId.isValid(data.description)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid borrower ID",
                });
                }

            // const updateBill = await Bill.findByIdAndUpdate(data.description, billData, { new: true, runValidators: true });
            const updateBill = await Bill.findByIdAndUpdate(data.description, billData, { new: true, runValidators: true });

            if (!updateBill) {
                return res.status(404).json({
                success: false,
                message: "Bill not found",
                });
            }
            console.log("updateBill: ", updateBill);


            const bookingList = await Borrower.find({bill_id: data.description}, { new: true, runValidators: true }).updateMany({status: "success"});

            // if (!bookingList || bookingList.length === 0) {
            //     return res.status(404).json({
            //       success: false,
            //       message: "Booking not found",
            //     });
            //   }
            console.log("updateBill: ", updateBill);
            
             //create new bill
            const newNoti = {
                content: "Bạn đã thanh toán thành công",
                user_id: updateBill.user_id,
            };
            const noti = new Bill(newNoti);
            const savedNoti = await noti.save();



            return res.status(200).json({
                success: true,
                bill: updateBill,
                bookingListInfo: bookingList,
            });
        } catch (error) {
            console.error(error);

        }

    }else{
        console.log(123)
        console.log("connect payos success")
        return res.status(200).json({
            success: true,
            message: "connect success",
        });
    }
  
    
 
};

function getRandomNumber() {
    return Math.floor(Math.random() * (9007199254740991 - 124)) + 124;
}


const paymentController = {
    createPayment,
    webHook,
};

module.exports = paymentController;
