#!/bin/bash
# 一键部署到 Vercel 快捷脚本

echo "🚀 准备部署【小太阳萌趣背单词】到 Vercel..."
cd "$(dirname "$0")"

# 检查构建
echo "📦 正在执行本地生产构建..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ 构建失败，请检查错误日志。"
  exit 1
fi

echo "✨ 构建成功！"
echo "🌐 正在调用 Vercel CLI 部署..."
echo "💡 提示：如果是首次使用，终端会提示你在浏览器中完成一次性免费登录认证。"
echo ""

# 使用 npx 直接运行 vercel CLI
npx vercel --prod

echo ""
echo "🎉 部署完成！请在上方输出中查看你的专属访问网址（.vercel.app）。"
