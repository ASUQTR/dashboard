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

motor_throttles.subscribe(function(message) {
  var motor_throttles_div = document.getElementById('motor_throttles');
  motor_throttles_div.innerHTML = message.throttles;
  auv_canvas.change_colors(message.throttles)
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
