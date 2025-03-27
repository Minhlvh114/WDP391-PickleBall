const backendApiUrl = "http://localhost:8080/api";

const routes = {
  AUTH: "auth",
  COURT: "court",
  USER: "user",
  PAY: "payment",
  FEEDBACK: "feedback",
  BILL: "bill",
  BORROWER: "borrower", // Add the BORROWER route
};

const methods = {
  GET: "get",
  GET_ALL: "getAll",
  GET_ALL_BY_DATE: "getAll/date",
  PUT_BY: "update/by",
  POST: "add",
  PUT: "update",
  UPDATE_STATUS: "update-status",
  CHANGE_BOOKING: "change-booking",
  DELETE: "delete",
  UPLOAD: "upload",
  IMPORT: "import",
  IMPORTBOOK: "importCourts",
  CREATE_PAYMENT_LINK: "create-payment-link",
  GET_BY_COURT_ID: "getAll",
  GET_ALL_BY_USER_ID: "getAll/user",
  RESET_PASS: "reset-password",
  SEND_MAIL: "/forgot-password/send-mail",
};

// Fixed apiUrl function that handles special cases
const apiUrl = (route, method, id = "") => {
  // Special case for methods that contain slashes
  if (method && method.includes('/') && id) {
    const [baseMethod, subPath] = method.split('/');
    return `${backendApiUrl}/${route}/${baseMethod}/${subPath}/${id}`;
  }
  
  // Normal case
  return `${backendApiUrl}/${route}/${method}${id ? `/${id}` : ''}`;
};

module.exports = { routes, methods, apiUrl };