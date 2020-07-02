//#region ROS General
// This function connects to the rosbridge server running on the local computer on port 9090

var rbServer = new ROSLIB.Ros({
	url: 'ws://' + location.hostname + ':9090'
});

rbServer.on('connection', function () {
	document.getElementById('feedback').innerHTML = "Connexion to the ROS server established";
});

rbServer.on('error', function (error) {
	document.getElementById('feedback').innerHTML = "Connexion error to the ROS server";
});

//#endregion

//#region Joystick

var joy_topic = new ROSLIB.Topic({
	ros: rbServer,
	name: '/joy',
	messageType: 'sensor_msgs/Joy'
});

//#region listener, pas capable dle faire fonctionner
var listener = new ROSLIB.Topic({
	ros: rbServer,
	name: '/listener',
	messageType: 'std_msgs/String'
});

listener.subscribe(function (message) {
	console.log('Received message on ' + listener.name + ': ' + message.data);
	listener.unsubscribe();
});
//#endregion

var joy_msg = new ROSLIB.Message({
	axes: [0, 0, 0, 0, 0, 0, 0, 0],
	buttons: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});

function pubJoystick(gamepadData) {
	//#region Axes
	joy_msg.axes[0] = gamepadData.axes[0]; // Left stick X
	joy_msg.axes[1] = -gamepadData.axes[1]; // Left stick Y

	joy_msg.axes[2] = gamepadData.axes[2]; // Right stick X
	joy_msg.axes[3] = -gamepadData.axes[3]; // Right stick Y

	joy_msg.axes[4] = gamepadData.buttons[6].value; // Left trigger
	joy_msg.axes[5] = gamepadData.buttons[7].value; // Right trigger

	//#endregion

	//#region Buttons
	for (var i = 0; i < 3; i++) //Button A, B and X
		joy_msg.buttons[i] = Number(gamepadData.buttons[i].pressed);

	//#endregion

	//#region update html
	document.getElementById("axe0").value = joy_msg.axes[0] * 1024;
	document.getElementById("axe1").value = joy_msg.axes[1] * 1024;
	document.getElementById("axe2").value = joy_msg.axes[2] * 1024;
	document.getElementById("axe3").value = joy_msg.axes[3] * 1024;
	document.getElementById("axe6").value = joy_msg.axes[4] * 1024;
	document.getElementById("axe7").value = joy_msg.axes[5] * 1024;
	//#endregion

	joy_topic.publish(joy_msg);
}
//#endregion


//#region GamePad
var gameLoopInterval;

window.addEventListener("gamepadconnected", function () {
	var gp = navigator.getGamepads()[0];
	var gamepadInfo = document.getElementById('gamepadinfo');
	gamepadInfo.innerHTML = "Controller connected with index " + gp.index + ": " + gp.id + ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.";
	gameLoopInterval = setInterval(gameLoop, 35);
});

window.addEventListener("gamepaddisconnected", function () {
	gamepadInfo.innerHTML = "Waiting for gamepad.";
	clearInterval(gameLoopInterval);
	//rAFStop(start);
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

//#endregion
