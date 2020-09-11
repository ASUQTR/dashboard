# ASUQTR  -  Joy Webpage

ASUQTR - Webpage for sending Xbox controller data to ROS network via rosbridge websocket. The data is sent to /joy topic in raw/unprocessed format.

1. Put file from Webpage folder into /var/www/html/
2. Start rosbridge with : 

    <pre><code>roslaunch rosbridge_server rosbridge_websocket.launch</code></pre>
