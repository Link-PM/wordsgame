# 汉字解谜（Hanzi Puzzle）

一个适配手机端的网页小游戏：每关给一句填空的成语 / 诗句，玩家用桌上的素材，通过拖动、旋转、加热、摩擦等操作把它们**变成**填空需要的字，填进去过关。

关卡设计见 [`汉字解谜_关卡设计v4.md`](汉字解谜_关卡设计v4.md)，共 18 关。

## 技术栈

零构建：纯 HTML + CSS + 原生 ES 模块，**不需要 npm / 打包工具**。用任意静态服务器打开即可（本机用 Python 自带的服务器最省事）。

## 启动

在项目根目录（`D:\WordsGame`）下：

```powershell
python -m http.server 8000
```

然后浏览器打开 <http://localhost:8000>。

### 手机上调试

手机和电脑连同一个 Wi‑Fi，用电脑的局域网 IP 访问，例如 `http://192.168.x.x:8000`。
查 IP：PowerShell 里运行 `ipconfig`，看「IPv4 地址」。

## 目录结构

```
index.html              入口
styles/main.css         全部样式
src/
  main.js               启动 / 界面路由
  engine/               通用引擎（与具体关卡无关）
    dom.js              DOM 构建辅助
    draggable.js        Pointer Events 拖动（鼠标 + 触摸）
    token.js            可拖动素材：显示字、变形、翻转、融合
    slot.js             题面里的填空格
    stage.js            游戏区域：拖放命中、距离判定、填空检测
  game/
    progress.js         通关进度（localStorage）
  levels/
    data.js             18 关的元数据（题面 / 答案 / 素材 / 玩法）
    registry.js         已实现关卡的按需加载登记表
    level-01.js         第 1 关《水能载舟》——参考实现
  ui/
    level-select.js     选关界面
    level-screen.js     单关界面
```

## 进度

- ✅ 引擎骨架、选关、单关框架、进度存档
- ✅ **全部 18 关均已实现并逐关验证通过**（每关都能按设计机制走到过关，无控制台报错）
- ✅ 通用特效库 `effects.js` + 复用机制 `mechanics.js`（融合 / 邻近加热 / 斧砍 / 旋转 / 翻转 / 摩擦等同类交互跨关复用）
- 自主决策记录见 [`docs/DECISIONS.md`](docs/DECISIONS.md)

### 新增一关怎么做

1. 在 `src/levels/` 下新建 `level-NN.js`，导出 `{ meta, init({ stage, Token, Slot, meta }) }`，`init` 里创建 token、写交互逻辑，返回 `{ destroy }` 用于清理。
2. 在 `src/levels/registry.js` 的 `loaders` 里登记 `NN: () => import('./level-NN.js')`。
3. 把 `data.js` 里该关的 `implemented` 改成 `true`。
