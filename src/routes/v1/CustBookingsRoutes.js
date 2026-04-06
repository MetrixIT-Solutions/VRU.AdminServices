/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustBookingsCtrl = require('../../controllers/CustBookingsCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/admin/cust/table/bookings/list/bystatus', CustBookingsCtrl.postAdminUserTableStatus);
  app.post('/swit/admin/cust/table/bookings/status/update', CustBookingsCtrl.postCustTableStatusUpdate);
  app.post('/swit/admin/cust/table/bookings/count/by/time', CustBookingsCtrl.postCustTableDshbrdCount);
  app.post('/swit/admin/cust/table/bookings/count/by/date', CustBookingsCtrl.postCustTableBookingCountByDate);
  app.post('/swit/admin/cust/table/booking/create', CustBookingsCtrl.postCustTableBookingCreate);
  app.post('/swit/admin/cust/table/booking/view', CustBookingsCtrl.postCustTableBookingView);
  app.post('/swit/admin/cust/table/booking/update', CustBookingsCtrl.postCustTableBookingUpdate);
  app.post('/swit/admin/cust/table/bookings/count/by/calendar', CustBookingsCtrl.postCustTableBookingsCountByCalendar);
  app.post('/swit/admin/cust/excel/data/table/booking/create', CustBookingsCtrl.postCustExcelDataTableBookingCreate);
  app.get('/swit/admin/cust/table/bookings/lfcs/list/:id', CustBookingsCtrl.getCustTableBookingLfcsList);
  app.post('/swit/admin/cust/table/bookings/total/list', CustBookingsCtrl.getCustTableBookingsTotalList);

};
