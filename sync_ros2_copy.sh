#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROS_COPY="$SCRIPT_DIR/../ros2_workspace/workspace/packages/sub_hardware/web/manual_assisted_dashboard.html"

cp "$SCRIPT_DIR/manual_assisted_dashboard.html" "$ROS_COPY"
echo "Updated generated ROS dashboard copy: $ROS_COPY"
