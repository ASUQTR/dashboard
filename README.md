# ASUQTR  -  Joy Webpage

ASUQTR - Webpage for sending Xbox controller data to ROS network via rosbridge websocket. The data is sent to /joy topic in raw/unprocessed format.

0. Make sure a webserver listens to port 80, usually apache or nginx.

1. Put files **index.thml ros_joy.js roslib.js** from Webpage folder into /var/www/html/
   and make sure they have execute permission
   This can be done with the cmd lines :
   <pre><code>sudo mv /home/asuqtr/catkin_ws/src/control-interface/*ros* /var/www/html/ </code></pre>
   <pre><code>sudo mv /home/asuqtr/catkin_ws/src/control-interface/index.html /var/www/html/ </code></pre>
   <pre><code>sudo chmod +x /var/www/html/*ros* </code></pre>
   
   
2. Start rosbridge with : 

    <pre><code>roslaunch rosbridge_server rosbridge_websocket.launch</code></pre>
	
3. Alternatively, you can launch this node and the all the necessary ones for manual control with:
	<pre><code>roslaunch ~/catkin_ws/src/asuqtr_mission_node/launch/manual_mode.launch</code></pre>
	
    This will allow controling the AUV with the Xbox controller when accessing the webpage.
	Please check your current DHCP listing to find the AUV's address for the webpage.

