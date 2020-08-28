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
  for (var i = 0; i < message.data.length; i += 1) {
    message.data[i] = message.data[i].toFixed(2);
  }
  lqr2.innerHTML = message.data[2];
  lqr3.innerHTML = message.data[3];
  lqr4.innerHTML = message.data[4];
  lqr5.innerHTML = message.data[5];
});

var motor_throttles = new ROSLIB.Topic({
  ros : rbServer,
  name : '/motors',
  messageType : 'asuqtr_actuator_node/ActuatorThrottle'
}); 

motor_throttles.subscribe(function(message) {
  var motor_throttles_div = document.getElementById('motor_throttles');
  auv_canvas.change_colors(message.throttles)
  for (var i = 0; i < message.throttles.length; i += 1) {
    message.throttles[i] = ((message.throttles[i]+0.35) * 100).toFixed(2);
  }
  m1.value = message.throttles[0];
  m2.value = message.throttles[1];
  m3.value = message.throttles[2];
  m4.value = message.throttles[3];
  m5.value = message.throttles[4];
  m6.value = message.throttles[5];
  m7.value = message.throttles[6];
  m8.value = message.throttles[7];
});

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
