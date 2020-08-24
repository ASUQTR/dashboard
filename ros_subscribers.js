 //Subscribe to topics and callback declaration

 var depth = new ROSLIB.Topic({
  ros : rbServer,
  name : '/Depth',
  messageType : 'std_msgs/Float32'
});

depth.subscribe(function(message) {
  var depthDiv = document.getElementById('depthDiv');
  depthDiv.innerHTML = message.data;
});

var lqr_error = new ROSLIB.Topic({
  ros : rbServer,
  name : '/lqr_error',
  messageType : 'std_msgs/Float32MultiArray'
});

lqr_error.subscribe(function(message) {
  var lqr_error_div = document.getElementById('lqr_error');
  lqr_error_div.innerHTML = message.data;
});

var motor_throttles = new ROSLIB.Topic({
  ros : rbServer,
  name : '/motors',
  messageType : 'asuqtr_actuator_node/ActuatorThrottle'
}); 


//Load sub images
var t200_front_img =new Image,
  t200_top_img =new Image;
t200_front_img.src = "t200.png",
t200_top_img.src = "t200-up.png";
canvasWidth = 520
//Define AUV canvas
t200_top_img.onload = function () {
  function AUVCanvas () {
    this.t1 = document.getElementById("t1");
    this.t2 = document.getElementById("t2");
    this.t3 = document.getElementById("t3");
    this.t4 = document.getElementById("t4");
    this.t5 = document.getElementById("t5");
    this.t6 = document.getElementById("t6");
    this.t7 = document.getElementById("t7");
    this.t8 = document.getElementById("t8"); 
    this.ctx1 = t1.getContext("2d");
    this.ctx1.translate(canvasWidth/2, canvasWidth/2);
    this.ctx1.rotate(45 * Math.PI / 180);
    this.ctx1.translate(-canvasWidth/2, -canvasWidth/2);
    this.ctx2 = t2.getContext("2d");
    this.ctx2.translate(canvasWidth/2, canvasWidth/2);
    this.ctx2.rotate(135 * Math.PI / 180);
    this.ctx2.translate(-canvasWidth/2, -canvasWidth/2);
    this.ctx3 = t3.getContext("2d");
    this.ctx4 = t4.getContext("2d");
    this.ctx5 = t5.getContext("2d");
    this.ctx6 = t6.getContext("2d");
    this.ctx7 = t7.getContext("2d");
    this.ctx7.translate(canvasWidth/2, canvasWidth/2);
    this.ctx7.rotate(-45 * Math.PI / 180);
    this.ctx7.translate(-canvasWidth/2, -canvasWidth/2);
    this.ctx8 = t8.getContext("2d");
    this.ctx8.translate(canvasWidth/2, canvasWidth/2);
    this.ctx8.rotate(-135 * Math.PI / 180);
    this.ctx8.translate(-canvasWidth/2, -canvasWidth/2);
    this.draw_auv = function() {
      this.ctx1.drawImage(t200_top_img, 0, 0);
      this.ctx2.drawImage(t200_top_img, 0, 0);
      this.ctx3.drawImage(t200_front_img, 0, 0);
      this.ctx4.drawImage(t200_front_img, 0, 0);
      this.ctx5.drawImage(t200_front_img, 0, 0);
      this.ctx6.drawImage(t200_front_img, 0, 0);
      this.ctx7.drawImage(t200_top_img, 0, 0);
      this.ctx8.drawImage(t200_top_img, 0, 0);
    };
  }
  //Instanciate new canvas and draw image on load
  var auv = new AUVCanvas();
  auv.draw_auv();

  //Change canvas color with motors
  motor_throttles.subscribe(function(message) {
    console.log("start of motors callback ");
    var motor_throttles_div = document.getElementById('motor_throttles');
    motor_throttles_div.innerHTML = message.throttles;

    var imgd = auv.ctx1.getImageData(0, 0, canvasWidth, canvasWidth),
        base_pix = new Object();
        pix = imgd.data,
        Object.assign(base_pix,pix)
        uniqueColor = [message.throttles[0]*30, message.throttles[0]*30, 0];
    // Loops through all of the pixels and modifies the components.
    for (var i = 0, n = pix.length; i <n; i += 4) {
          pix[i] = base_pix[i] + uniqueColor[0];   // Red component
          pix[i+1] = base_pix[i] + uniqueColor[1]; // Blue component
          pix[i+2] = base_pix[i] + uniqueColor[2]; // Green component
          //pix[i+3] is the transparency.
    }
    auv.ctx1.putImageData(imgd, 0, 0);  
  });
}




var rosout = new ROSLIB.Topic({
  ros : rbServer,
  name : '/rosout',
  messageType : 'rosgraph_msgs/Log'
});

rosout.subscribe(function(msg) {
  var rosout_div = document.getElementById('rosout');
  rosout_div.innerHTML = msg.level + ' ' + msg.msg;
});

var control_switch = new ROSLIB.Topic({
  ros : rbServer,
  name : '/control_switch',
  messageType : 'std_msgs/Bool'
});

control_switch.subscribe(function(message) {
  var control_switch_div = document.getElementById('control_switch');
  control_switch_div.innerHTML = message.data;
});
