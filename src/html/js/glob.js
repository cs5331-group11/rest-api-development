var loginPostUrl = 'http://jayampathi.com/rest/users/authenticate/'; 
var publicDiaryGetUrl = 'http://jayampathi.com/rest/diary/';
var privateDiaryPostUrl = 'http://jayampathi.com/rest/diary/';
var registerPostUrl = 'http://jayampathi.com/rest/users/register/';
var userExpirePostUrl = 'http://jayampathi.com/rest/users/expire/';
var CreateDiaryPostUrl = 'http://jayampathi.com/rest/diary/create/';
var deleteDiaryPostUrl = 'http://jayampathi.com/rest/diary/delete/';
var updatePermissionDiaryPostUrl = 'http://jayampathi.com/rest/diary/permission/';
 

var testing=true; /* for testing purpose  */
var testingAlerts=true; /* for debugging purpose  */

var testingLoginResponse='{"status": true,"token": "6bf00d02-dffc-4849-a635-a21b08500d61"}';
var testingPublicDiaryResponse='{"status": true,"result": ['+
  '{"id": 2,"title": "A New Lesson!","author": "audrey123 talks","publish_date": "2013-02-29T13:37:00+00:00","public": true,"text": "Anything that can be calendared in advance can be scheduled, such as new product releases or regular updates."},'+
  '{"id": 3,"title": "A new video publised","author": "Jame To Vi","publish_date": "2013-03-29T13:38:00+00:00","public": true,"text": "presence lively around the clock. Tweets can be scheduled up to a year in advance and down to 1-minute granularity."},'+
 '{"id": 4,"title": "HeY all,check this out","author": "Litz We Yee","publish_date": "2016-02-29T13:38:00+00:00","public": true,"text": "To be posted in the future.  Both organic and promoted-only Tweets can be scheduled for future delivery, and as needed, coordinated to go live"},'+
  '{"id": 5,"title": "Lesson 3 for YZP","author": "Johnny Don Wei","publish_date": "2013-06-29T13:38:00+00:00","public": true,"text": "Quickly grow your community of high value followers and drive word of mouth by promoting your account!"},'+
  '{"id": 6,"title": "New Post from DMN","author": "Xio Liong Wi","publish_date": "2015-02-29T13:38:00+00:00","public": true,"text": "Track the growth of your follower base and see how people engage with every single Tweet!"},'+
    '{"id": 7,"title": "GEMconnect tpl","author": "Susan Sei Wa","publish_date": "2016-02-22T13:38:00+00:00","public": true,"text": "growth of your follower base and see how people engage with every single"},'+
      '{"id": 8,"title": "PassManager tpl","author": "Bernard Sing Leh","publish_date": "2016-11-28T13:38:00+00:00","public": true,"text": "growth of your  your community of high value follower base and see how people engage with every single"}'+ 
 ']}';
 
var testingPrivateDiaryResponse='{"status": true,"result": ['+
  '{"id": 2,"title": "A New Lesson!","author": "audrey123 talks","publish_date": "2013-02-29T13:37:00+00:00","public": true,"text": "Anything that can be calendared in advance can be scheduled, such as new product releases or regular updates. In addition, you can use this feature to publish Tweets on the weekend."},'+
  '{"id": 3,"title": "A new video publised","author": "Jame To Vi","publish_date": "2013-03-29T13:38:00+00:00","public": true,"text": "presence lively around the clock. Tweets can be scheduled up to a year in advance and down to 1-minute granularity."},'+
 '{"id": 4,"title": "HeY all,check this out","author": "Litz We Yee","publish_date": "2016-02-29T13:38:00+00:00","public": true,"text": "To be posted in the future.  Both organic and promoted-only Tweets can be scheduled for future delivery, and as needed, coordinated to go live"},'+
  '{"id": 5,"title": "Lesson 3 for YZP","author": "Johnny Don Wei","publish_date": "2013-06-29T13:38:00+00:00","public": true,"text": "Quickly grow your community of high value followers and drive word of mouth by promoting your account!"},'+
  '{"id": 6,"title": "New Post from DMN","author": "Xio Liong Wi","publish_date": "2015-02-29T13:38:00+00:00","public": true,"text": "Track the growth of your follower base and see how people engage with every single Tweet!"}'+
 ']}';
 
 var testingPrivateDiaryResponseCreated='{"status": true,"result": ['+
  '{"id": 2,"title": "A New Lesson!","author": "audrey123 talks","publish_date": "2013-02-29T13:37:00+00:00","public": true,"text": "Anything that can be calendared in advance can be scheduled, such as new product releases or regular updates. In addition, you can use this feature to publish Tweets on the weekend."},'+
  '{"id": 3,"title": "A new video publised","author": "Jame To Vi","publish_date": "2013-03-29T13:38:00+00:00","public": true,"text": "presence lively around the clock. Tweets can be scheduled up to a year in advance and down to 1-minute granularity."},'+
 '{"id": 4,"title": "HeY all,check this out","author": "Litz We Yee","publish_date": "2016-02-29T13:38:00+00:00","public": true,"text": "To be posted in the future.  Both organic and promoted-only Tweets can be scheduled for future delivery, and as needed, coordinated to go live"},'+
  '{"id": 5,"title": "Lesson 3 for YZP","author": "Johnny Don Wei","publish_date": "2013-06-29T13:38:00+00:00","public": true,"text": "Quickly grow your community of high value followers and drive word of mouth by promoting your account!"},'+
  '{"id": 6,"title": "New Post from DMN","author": "Xio Liong Wi","publish_date": "2015-02-29T13:38:00+00:00","public": true,"text": "Track the growth of your follower base and see how people engage with every single Tweet!"},'+
   '{"id": 7,"title": "New Post from DMN","author": "Xio Liong Wi","publish_date": "2015-02-29T13:38:00+00:00","public": true,"text": "Track the growth of your follower base and see how people engage with every single Tweet!"}'+
 ']}';
 
 var testingRegisterResponse='{"status": false,"error": "User already exists!"}';
 var testinguserExpireResponse='{"status": true}';
 var testingcreateDiaryResponse='{"status": true,"result": 2}';
 var testingdeleteDiaryResponse='{"status": true}';
 var testingupdatePermissionDiaryResponse='{"status": true}';