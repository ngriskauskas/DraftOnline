/**
 * Jest Mock
 * ./__mocks__/nodemailer.js
 **/
// load the real nodemailer
import nodemailer from 'nodemailer';
// pass it in when creating the mock using getMockFor()
import mock from 'nodemailer-mock';
const nodemailerMock = mock.getMockFor(nodemailer);
// export the mocked module
export default nodemailerMock;
