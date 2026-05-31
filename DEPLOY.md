# aiburj 部署指南

## 环境要求（服务器）

- Linux (Ubuntu 22.04+ / Debian 12+ / CentOS 8+)
- Docker 24+ & Docker Compose v2
- 内存 ≥ 2GB，存储 ≥ 20GB

## 一、服务器初始化

```bash
# 1. 安装 Docker（国内用阿里云镜像）
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
sudo systemctl enable docker && sudo systemctl start docker

# 2. 安装 Docker Compose
sudo apt install docker-compose-plugin  # Debian/Ubuntu
# 或: sudo yum install docker-compose-plugin  # CentOS

# 3. 验证
docker --version && docker compose version
```

## 二、部署 aiburj

```bash
# 1. 克隆项目
git clone https://github.com/18879240488/new-api.git aiburj
cd aiburj

# 2. 创建环境变量文件（替换为你的真实密码）
cat > .env.docker << 'EOF'
DB_USER=aiburj
DB_PASSWORD=<生成一个随机密码>
REDIS_PASSWORD=<生成一个随机密码>
SESSION_SECRET=<生成一个64位随机字符串>
TZ=Asia/Shanghai
EOF

# 3. 启动全部服务（PostgreSQL + Redis + aiburj）
docker compose -f docker-compose.prod.yml up -d

# 4. 查看启动日志
docker compose -f docker-compose.prod.yml logs -f aiburj

# 5. 验证
curl http://localhost:3000/api/status
```

## 三、配置反向代理（Nginx）

```nginx
server {
    listen 80;
    server_name api.aiburj.com;  # 替换为你的域名

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade ***upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host ***t;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_buffering off;  # SSE 流式必须关闭
    }
}
```

## 四、常用运维命令

```bash
# 查看服务状态
docker compose -f docker-compose.prod.yml ps

# 重启服务
docker compose -f docker-compose.prod.yml restart aiburj

# 查看实时日志
docker compose -f docker-compose.prod.yml logs -f --tail=200

# 备份数据库
docker exec aiburj-postgres pg_dump -U aiburj aiburj > backup.sql

# 更新部署（拉新代码后）
git pull
docker compose -f docker-compose.prod.yml up -d --build

# 完全停止并清理
docker compose -f docker-compose.prod.yml down -v  # ⚠️ 会删除数据！
```

## 五、HTTPS 配置（Let's Encrypt）

```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d api.aiburj.com
```
