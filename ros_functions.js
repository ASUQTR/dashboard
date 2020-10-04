//#region ROS General

// This function connects to the rosbridge server running on the local computer on port 9090
var auv_canvas = new AUVCanvas()

var rbServer = new ROSLIB.Ros({
    url : 'ws://' + location.hostname + ':9090'
 });

 document.getElementById("cam0").setAttribute("src", "http://"+ location.hostname +":8080/stream?topic=/detectnet/overlay")

 // This function is called upon the rosbridge connection event
 rbServer.on('connection', function() {
     // Write appropriate message to #feedback div when successfully connected to rosbridge
     var fbDiv = document.getElementById('feedback');
     fbDiv.innerHTML = "Connexion au serveur ROS établie";
 });

 
// This function is called when there is an error attempting to connect to rosbridge
rbServer.on('error', function(error) {
    // Write appropriate message to #feedback div upon error when attempting to connect to rosbridge
    var fbDiv = document.getElementById('feedback');
    fbDiv.innerHTML = "Erreur de connexion au serveur ROS";
});

// This function is called when the connection to rosbridge is closed
rbServer.on('close', function() {
    // Write appropriate message to #feedback div upon closing connection to rosbridge
    var fbDiv = document.getElementById('feedback');
    fbDiv.innerHTML = "Connexion au serveur ROS terminée";
 });

//#region Gamepad
var gameloopInterval;

window.addEventListener("gamepadconnected", function() {
  var gp = navigator.getGamepads()[0];
  var gamepadInfo = document.getElementById('gamepadinfo');
  gamepadInfo.innerHTML = "Gamepad mapping :" + gp.mapping + "<br>Gamepad ID:" + gp.id + "<br>Has " + gp.buttons.length + " boutons and " + gp.axes.length + " axes.";
  gameloopInterval = setInterval(gameLoop, 35);
});

window.addEventListener("gamepaddisconnected", function() {
  gamepadInfo.innerHTML = "Waiting for gamepad.";
  clearInterval(gameloopInterval);
});

// No gamepad events available, poll instead.
if (!('GamepadEvent' in window))
	var pollInterval = setInterval(pollGamepads, 500);

function pollGamepads() {
	var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
	for (var i = 0; i < gamepads.length; i++) {
		var gp = gamepads[i];
		if (gp) {
			gamepadInfo.innerHTML = "Controller connected with index " + gp.index + ": " + gp.id + ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.";
			clearInterval(pollInterval);
			gameLoopInterval = setInterval(gameLoop, 35);
		}
	}
}

function gameLoop() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  if (gamepads)
    pubJoystick(gamepads[0]);
};
//#endregion Gamepad

////#region ROS joy publisher 
//Joy topic publisher, msg and callback
var joy_topic = new ROSLIB.Topic({
  ros : rbServer,
  name : '/joy',
  messageType : 'sensor_msgs/Joy'
});

var joy_msg = new ROSLIB.Message({
axes : [0,0,0,0,0,0,0,0],
buttons :  [0,0,0,0,0,0,0,0,0,0,0]  
});

function pubJoystick(gamepadData) {   
  joy_msg.axes[0] = gamepadData.axes[0]; // Left stick X
  axis_stick_left_LR.value = (joy_msg.axes[0]+1)*50;
  joy_msg.axes[1] = gamepadData.axes[1]*-1; // Left stick Y
  axis_stick_left_UD.value = (joy_msg.axes[1]+1)*50;
  joy_msg.axes[2] = gamepadData.axes[2]; // Left shoulder
  axis_trigger_left.value = joy_msg.axes[2]*100;
  joy_msg.axes[3] = gamepadData.axes[3]; // Right stick X
  axis_stick_right_LR.value = (joy_msg.axes[3]+1)*50;
  joy_msg.axes[4] = gamepadData.axes[4]*-1; // Right stick Y
  axis_stick_right_UD.value = (joy_msg.axes[4]+1)*50;
  joy_msg.axes[5] = gamepadData.axes[5]; // Right shoulder
  axis_trigger_right.value = joy_msg.axes[5]*100;

  // DPAD Left/Right
  joy_msg.axes[6] = gamepadData.axes[6];
  // DPAD Left/Right
  joy_msg.axes[7] = -gamepadData.axes[7]; 

  joy_msg.buttons[0] = Number(gamepadData.buttons[0].pressed); // Button A
  joy_msg.buttons[1] = Number(gamepadData.buttons[1].pressed); // Button B
  joy_msg.buttons[2] = Number(gamepadData.buttons[2].pressed); // Button X
  joy_msg.buttons[3] = Number(gamepadData.buttons[3].pressed); // Button Y
  joy_msg.buttons[4] = Number(gamepadData.buttons[4].pressed); // Button Left trigger
  joy_msg.buttons[5] = Number(gamepadData.buttons[5].pressed); // Button Right trigger
  joy_msg.buttons[6] = Number(gamepadData.buttons[6].pressed); // Button Back
  joy_msg.buttons[7] = Number(gamepadData.buttons[7].pressed); // Button Start
  joy_msg.buttons[8] = Number(gamepadData.buttons[8].pressed); // Button Xbox
  joy_msg.buttons[9] = Number(gamepadData.buttons[9].pressed); // Button Click left stick
  joy_msg.buttons[10] = Number(gamepadData.buttons[10].pressed); // Button Click right stick

  joy_topic.publish(joy_msg);
}
//#endregion ROS joy publisher 

//#region Thrusters color

