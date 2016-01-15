'use strict';

angular.module('ifd')
        .controller('MeController', MeController); // 我

// 我
function MeController($scope, $localStorage, $ionicPopup, $cordovaCamera, User) {
  $scope.myImgsrc = "img/icon.png";
  $scope.username = $localStorage.username;
  var params = {bussinessId :User.user().id, bussinessType:'avatar', access_token:User.token()};

  User.getAvatar(User.user().id,function(path){
    $scope.myImgsrc = path;
  });

  $scope.exitApp = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: '提示',
      template: "确定要退出系统吗？",
      cancelText: '取消',
      okText: '退出'
    });
    confirmPopup.then(function (res) {
      if(res){
        User.logout();
      }
    })
  };

  $scope.takePhoto = function() {
    var options = {
      quality: 100,
      mediaType: 0,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      //====关键设置=======================================
      allowEdit: true, // 出现裁剪框
      targetWidth: 800,// 图片裁剪高度
      targetHeight: 800
      //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
      /*        quality: 100,                                            //相片质量0-100
       destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
       sourceType: Camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
       allowEdit:true,                                       //在选择之前允许修改截图
       encodingType:Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
       targetWidth: 200,                                        //照片宽度
       targetHeight: 200,                                       //照片高度
       mediaType:0,                                             //可选媒体类型：圖片=0，
       // 只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，
       // 最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
       cameraDirection:0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
       popoverOptions: CameraPopoverOptions,
       saveToPhotoAlbum: true                                   //保存进手机相册*/
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.myImgsrc = imageData;
      User.setAvatar($scope.myImgsrc, User.user().id);
      UploadFile.uploadImages($scope.myImgsrc, { bussinessId:User.user().id, bussinessType:'avatar'},
        function(success) {
          console.log(success);
        },function(error) {
          alert(error);
        });
    }, function(err) {

    });
  };

}
