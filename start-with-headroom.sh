#!/bin/bash
# aiburj + headroom 启动脚本
# 用法: ./start-with-headroom.sh

PORT=${1:-3000}
HEADROOM_PORT=8788
HEADROOM_BIN="$HOME/headroom-venv-311/bin/headroom"
UPSTREAM_URL="https://api.siliconflow.cn/v1"

echo "🚀 Starting aiburj with Headroom token compression..."

# 1. Start headroom proxy
echo "   → Headroom proxy on port $HEADROOM_PORT (upstream: $UPSTREAM_URL)"
$HEADROOM_BIN proxy \
  --port $HEADROOM_PORT \
  --backend anyllm \
  --anyllm-provider openai \
  --openai-api-url "$UPSTREAM_URL" \
  > ~/headroom.log 2>&1 &
HEADROOM_PID=$!
echo "   PID: $HEADROOM_PID"

# Wait for headroom to be ready
for i in $(seq 1 10); do
  if curl -s --noproxy '*' "http://127.0.0.1:$HEADROOM_PORT/health" > /dev/null 2>&1; then
    echo "   ✅ Headroom ready"
    break
  fi
  sleep 1
done

# 2. Start aiburj
echo "   → aiburj on port $PORT"
cd ~/projects/new-api
GLOBAL_WEB_RATE_LIMIT_ENABLE=false ./new-api --port $PORT &
AIBURJ_PID=$!
echo "   PID: $AIBURJ_PID"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  aiburj:  http://localhost:$PORT"
echo "  headroom: http://localhost:$HEADROOM_PORT (压缩代理)"
echo "  upstream: $UPSTREAM_URL"
echo ""
echo "  关闭: kill $HEADROOM_PID $AIBURJ_PID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

wait
