const mongoose = require("mongoose");
const db = require('../models');
const PayOS = require('@payos/node');
const { parse, addHours, format, isAfter } =  require("date-fns");
const Bill = db.bill;


const createPayment = async (req, res, next) => {

    /////////////init varible///////////////////////
    //Lấy Timestamp hiện tại + 10 phút 
    const timestamp = Math.floor(Date.now() / 1000)+600; // Chia 1000 để lấy giây
    const currentDate = format(new Date(), "dd/MM/yyyy HH:mm:ss")

    const data = req.body
    console.log(data)
    if(isAfter(currentDate, data.timeRental)){
        res.status(500).json({
            success: false,
            message: "Cant booking because timeBooking invalid"
        });
    }
    const miny = ""
    // const payos = new PayOS("client_id", "api-key", "checksum-key")
    const payos = new PayOS(
        "02b2d39e-1d67-41ca-b1ae-039a07a45707", 
        "e057c61d-2dec-4167-bc19-204753a0a3ea", 
        "979184336c54f1b798529b6db93eb49d2af2c520376febf1a19bbf2f1c46ff78"
    )
    const YOUR_DOMAIN = "http://localhost:3000"

    // data
    const order = {
        amount: data.price,
        description: `${data.timeRental}`,
        buyerName: data.name,
        buyerEmail: data.email,
        buyerPhone: data.phone,
        orderCode: 43,
        items: [{name: data.courtId, price: data.price, quantity: 1}],
        returnUrl: `${YOUR_DOMAIN}/courts/schedule/${data.courtId}?courtName=${encodeURIComponent(data.courtName)}`,
        cancelUrl: `${YOUR_DOMAIN}/courts/schedule/${data.courtId}?courtName=${encodeURIComponent(data.courtName)}`,
        expiredAt: timestamp,
    }
    try {
        const paymentLink = await payos.createPaymentLink(order);
        // console.log(paymentLink)
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
// https://3a94-14-177-236-71.ngrok-free.app/api/payment/receive-hook
const webHook = async (req, res, next) => {

    // console.log(req.body)

    if(req.body.data.orderCode!==123){
        console.log(req.body.data)
        // const timeRental =  parse(req.body.data.description, "dd/MM/yyyy hh:mm:ss a", new Date());
        // console.log(timeRental)


            
        const parseTimeRental = parse(req.body.data.description, "ddMMyyyy HHmmss", new Date());
        const timeRental = format(parseTimeRental, "dd/MM/yyyy HH:mm:ss");
        const endTimeRental = format(addHours(parseTimeRental, 1), "dd/MM/yyyy HH:mm:ss");


        const newBillData = {
            retal_price: req.body.data.amount,
            time_rental: timeRental,
            end_time_rental: endTimeRental,
            // court_id: req.body.courtId,
            // user_id: req.body.userId,
            counter_account_name: req.body.data.counterAccountName,
            counter_account_number: req.body.data.counterAccountNumber,
            order_code_pay_os: req.body.data.orderCode ,
            transaction_bank_time: req.body.data.transactionDateTime ,
            reference_bank: req.body.data.reference,
            status: "PAID",
        };
        console.log(newBillData);

        try {
            const newBill = new Bill(newBillData);
            console.log(newBill)
            const savedBill = await newBill.save();
            return res.status(200).json({
                success: true,
                data: req.body,
                bill: savedBill
            });
        } catch (error) {
            console.error(error);

        }

    }else{
        return res.status(200).json({
            success: true,
            message: "connect success",
        });
    }
  
    
 
};


const paymentController = {
    createPayment,
    webHook,
};

module.exports = paymentController;
