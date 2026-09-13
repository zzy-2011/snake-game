# 🐍 贪吃蛇 (Snake)

经典贪吃蛇小游戏，纯 HTML5 Canvas 实现，**无任何外部图片或依赖**。

## 玩法
- **方向键 / WASD** 控制方向，**手机滑动**屏幕
- 吃到苹果身体变长、分数 +10，速度逐渐加快
- 撞墙或咬到自己即结束；最高分保存在浏览器 `localStorage`

## 特性
- 20×20 网格，圆角方块蛇身与苹果
- 键盘 + 触屏滑动双操作
- 实时分数 + 最高分记录

## 运行
直接用浏览器打开 `index.html`，或启动本地服务器：

```bash
python -m http.server 8000
# 访问 http://localhost:8000
```

## 在线试玩
**https://zzy-2011.github.io/snake-game/**

## 文件结构
```
snake-game/
├── index.html
├── style.css
└── game.js
```
