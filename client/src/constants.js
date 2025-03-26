const backendApiUrl = "http://localhost:8080/api";

const routes = {
  AUTH: "auth",
  COURT: "court",
  PAY: "payment",
  BILL: "bill",
};

const methods = {
  GET: "get",
  GET_ALL: "getAll",
  GET_ALL_BY_DATE: "getAll/date",
  POST: "add",
  PUT: "update",
  PUT_BY: "update/by",
  DELETE: "delete",
  UPLOAD: "upload",
  IMPORT: "import",
  IMPORTBOOK: "importCourts",
  CREATE_PAYMENT_LINK: "create-payment-link",
};

const apiUrl = (route, method, id = "") => `${backendApiUrl}/${route}/${method}${id && `/${id}`}`;

module.exports = { routes, methods, apiUrl };
