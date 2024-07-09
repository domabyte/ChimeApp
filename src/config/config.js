const baseURL = 'https://memberapiqa.actpal.com/api/';

const configURL = {
  loginURL: baseURL + 'account/GetLogin?email=',
  forgotPassURL: baseURL + 'account/ForgetPass',
  logoutURL: baseURL + 'account/_Logout?MemberToken=',
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
  suggestedUserURL: baseURL + 'User/GetSuggestedUsers',
  findFriendsURL: baseURL + 'User/_get_all_members?userid=',
  sentFriendRequestURL: baseURL + 'User/SendFriendRequest',
  cancelFriendRequestURL: baseURL + 'User/RejectRequest',
  getSentFriendRequestURL: baseURL + 'user/GetFriendList?MemberToken=',
  receiveFriendRequestURL: baseURL + 'User/_FriendRequest?userid=',
  getReceiveFriendRequestURL: baseURL + 'user/GetFriendList?MemberToken=',
  acceptFriendRequestURL: baseURL + 'User/AcceptFriendRequest',
  unFriendRequestURL: baseURL + 'User/UnFriendRequest',
  groupURL: baseURL + 'post/_view_group_list?MemberToken=',
  chatHistoryURL: baseURL + 'message/_chat_history?MemberToken=',
  getGroupListURL: baseURL + 'post/_groupMemberList?MemberToken=',
  sendPrivateMsgURL: baseURL + 'message/sendPrivateMessage',
  sendMediaURL: baseURL + 'message/_uploadChatMedia',
  _getUserInfoURL: baseURL + 'user/_getBasicInfoByMemId?MemberToken=',
  deleteMsgURL: baseURL + 'message/deleteMessageById',
  getFCMTokenURL: baseURL + 'user/GetMemberDeviceDetailById',
  groupCallURL: baseURL + 'message/GroupCallIdGenerating',
  belongToGroupURL: baseURL + 'post/IsGroupMember?MemberToken=',
  callURL: 'https://3q9cbtsj-3002.inc1.devtunnels.ms/api/call',
  endCallURL: 'https://3q9cbtsj-3002.inc1.devtunnels.ms/api/endCall',
};
export default configURL;
