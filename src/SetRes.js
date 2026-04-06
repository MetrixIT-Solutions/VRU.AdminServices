/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const apiServerStatus = () => {
  return {httpStatus: 200, status: '200', resData: {message: 'V Reserve U - Admin API service is running'}};
}
const unKnownErr = (result) => {
  return {httpStatus: 500, status: '199', resData: {message: '500 - Unknown Error', result}};
}
const noData = (result) => {
  return {httpStatus: 400, status: '204', resData: {message: '204 - No Data Found', result}};
}

const msdReqFields = () => {
  return {httpStatus: 400, status: '197', resData: {message: 'Provide Mandatory Fields Data'}};
}
const tokenRequired = () => {
  return { httpStatus: 400, status: '192', resData: { message: 'Token is required' } };
}
const tokenExpired = () => {
  return {httpStatus: 400, status: '190', resData: { message: 'Token Expired' }};
}
const invalidToken = () => {
  return {httpStatus: 500, status: '191', resData: {message: 'Invalid Token'}};
}
const accessDenied = (result) => {
  return {httpStatus: 500, status: '193', resData: {message: 'You do not have an access to do this action', result}};
}

const successRes = (result) => {
  return {httpStatus: 200, status: '200', resData: {message: 'Success', result}};
}

const invalidCredentials = (message) => {
  return {httpStatus: 400, status: '100', resData: {message}};
}
const accBlocked = () => {
  return {httpStatus: 400, status: '150', resData: {message: 'Your account is blocked, try after 1 hour'}};
}
const accHold = () => {
  return {httpStatus: 400, status: '151', resData: {message: 'Your account is on hold, try after 24 hours'}};
}
const accInactive = () => {
  return {httpStatus: 400, status: '152', resData: {message: 'Your account is inactive, contact management'}};
}

const createFailed = (result) => {
  return {httpStatus: 400, status: '196', resData: {message: 'Create Failed', result}};
}
const updateFailed = (result) => {
  return {httpStatus: 400, status: '195', resData: {message: 'Update Failed', result}};
}
const uniqueness = (result) => {
  return {httpStatus: 400, status: '101', resData: {message: result}};
}
const countRes = (result) => {
  return {httpStatus: 200, status: '202', resData: {message: 'Success', result}};
}
const msgData = (result) => {
  return {httpStatus: 400, status: '203', resData: {message: 'Reset password request sent', result}};
}
const SamparkFailedRes = (result) => {
  return {httpStatus: 400, status: '205', resData: {message: 'Failed', result}};
}

const deleteFailed = () => {
  return {httpStatus: 400, status: '194', resData: {message: 'Delete Trx failed'}};
}
const pswdErr = (result) => {
  return {httpStatus: 400, status: '184', resData: {message: 'Wrong current password'}};
}

const oebInactive = (type) => {
  return {httpStatus: 400, status: '102', resData: {message: `Your ${type} is inactive. Please contact your management.`}};
}

const otpSentSuc = (otpNum) => {
  return { httpStatus: 200, status: '200', resData: { message: 'OTP Sent', otpNum} };
};

const otpTokenExpired = () => {
  return { httpStatus: 400, status: '204', resData: { message: 'Token Expired' } };
}

const otpVerify = (result) => {
  return { httpStatus: 200, status: '200', resData: { message: 'OTP Verified Successfully', result} };
}

const otpVerifyFailed = () => {
  return { httpStatus: 400, status: '182', resData: { message: 'OTP verification failed' } };
}

const invalidOtp = () => {
  return { httpStatus: 400, status: '100', resData: { message: 'Provided Invalid OTP' } };
}

module.exports = {
  apiServerStatus, unKnownErr, noData, 
  msdReqFields, tokenRequired, tokenExpired, invalidToken, accessDenied,
  successRes,
  invalidCredentials, accBlocked, accHold, accInactive,
  createFailed, updateFailed, uniqueness, countRes, msgData, SamparkFailedRes, deleteFailed, pswdErr, oebInactive, 
  otpSentSuc, otpTokenExpired, otpVerify, otpVerifyFailed, invalidOtp
};
