const baseURL = 'https://memberapiqa.actpal.com/api/';

const configURL = {
    loginURL: baseURL + 'account/GetLogin?email=',
    forgotPassURL: baseURL + 'account/ForgetPass',
    forgotOTPVerifyURL: baseURL + 'account/forgotOTPVerification',
    resetPasswordURL: baseURL + 'account/ResetPassword',
    registrationURL: baseURL + 'account/RegistrationSubmit',
    otpRegistrationURL: baseURL + 'account/OtpConfirmation',
    friendListURL: baseURL + 'message/_friend_list?MemberToken=',
    sendPvtMsgURL: baseURL + 'message/sendPrivateMessage',
    chatHistoryURL: baseURL + 'message/_chat_history?MemberToken=',
    captchaURL: baseURL + 'account/GetSecurityCode',
    countryListURL: baseURL + 'location/GetCountryList',
    stateListURL: baseURL + 'location/GetStateList?CountryId=',
    basicInfoURL: baseURL + 'account/BasicInfo',
    uploadPhotoURL: baseURL + 'account/_upload_profile_photo',
};
export default configURL;