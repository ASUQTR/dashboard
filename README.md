# Manual Assisted Pilot Dashboard

Standalone browser dashboard for MANUAL_ASSISTED control tests.

Features:

- gamepad commands on `/dashboard/gamepad`;
- Start/Select safety controls;
- Unity cameras through rosbridge with physical-camera fallback;
- runtime depth-limit configuration;
- trajectory recording and playback;
- control and connection diagnostics.

The canonical dashboard source is `manual_assisted_dashboard.html`.
`index.html` only redirects web servers to that file.

The ROS workspace keeps a generated copy for its standalone pool-test launch.
After changing the dashboard, update that copy with:

```bash
./sync_ros2_copy.sh
```

Serve `index.html`, enter the ROS host address, then select **Connecter**. The
ROS2 launch must provide rosbridge on port `9090`.
