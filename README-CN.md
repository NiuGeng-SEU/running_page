# 个人跑步仪表盘 (Running Page)

专为跑者打造的现代化单页跑步数据看板，用于记录与展示跑步数据、目标达成进度、运动轨迹热力图及个人最佳成绩。

基于 **React 19**、**Vite**、**Tailwind CSS** 与 **Mapbox GL** 构建，通过 GitHub Actions 与 **Intervals.icu** 自动化同步。

🌐 **在线站点**: [https://run.gengniu.org](https://run.gengniu.org)

---

## 功能特性

- **现代单页仪表盘 (Dashboard)**:
  - 核心指标一览无余，告别繁琐的页面跳转，极速流畅。
- **周度 / 月度 / 年度目标追踪**:
  - 周目标进度条（支持按周日到周六完整自然周计算）。
  - 连续运动天数（Streak）统计。
  - 月度与年度跑步里程目标追踪。
- **Mapbox 交互路线地图**:
  - 支持亮色/暗色地图模式自适应。
  - 动态渲染活动轨迹，支持点击单次活动高亮显示。
  - 支持按省份/州快速筛选路线。
- **GitHub 风格运动热力图**:
  - 全年每日跑步频次与里程打卡格子展示。
  - 悬浮显示配速、距离与运动时长。
  - 支持一键导出热力图为 PNG 图片。
- **详细活动日志**:
  - 分页表格展示，支持按里程筛选（全部、10km+、20km+、40km+）。
  - 展示距离、用时、配速、爬升高度及具体跑步时间。
- **个人最佳成绩 (Personal Bests)**:
  - 自动识别并展示 5K、10K、半马、全马等最佳记录。
- **轨迹墙 (Tracks) 与日历小部件**:
  - 全屏轨迹聚合展示与月度活动日历。
- **深色/浅色模式与多语言**:
  - 支持跟随系统、强制浅色或深色主题；支持中英文无缝切换。

---

## 快速配置 (`config.yml`)

项目根目录下的 `config.yml` 提供了全部个性化设置，修改保存即可生效：

```yaml
# config.yml

# Mapbox Access Token（若在 GitHub Actions 中配置了 Secret 则此处可留空）
mapbox_token: ''

# 个人头像 URL
avatar: 'https://img.gengniu.org/2026/08/cc3b3ad9.jpg'

# 默认语言：en（英文）| zh（中文）
locale: en

# 默认外观主题：system（跟随系统）| light（浅色）| dark（深色）
theme: system

# 页面主题预设：dashboard
theme_preset: dashboard

# 运动目标设置（单位：km）
goals:
  all:
    yearly: 2000     # 年度目标 2000 km
    monthly: 150     # 月度目标 150 km
    weekly: 35       # 周度目标 35 km
    unit: distance
  Run:
    yearly: 2000
    monthly: 150
    weekly: 35
    unit: distance
```

---

## 数据同步 (Data Synchronization)

数据主要通过 GitHub Actions 定时任务自动化拉取，目前默认的数据源为 **Intervals.icu**。

### 1. Intervals.icu 自动同步（主数据源）

1. 登录 [Intervals.icu](https://intervals.icu)，进入 **Settings** &rarr; **Developer Settings** 获取你的 **Athlete ID** 并生成 **API Key**。
2. 在 GitHub 仓库设置中添加 Secrets（**Settings &rarr; Secrets and variables &rarr; Actions**）：
   - `INTERVALS_ICU_ATHLETE_ID`
   - `INTERVALS_ICU_API_KEY`
   - `MAPBOX_TOKEN`
3. 每天定时通过 `.github/workflows/run_data_sync.yml` 自动拉取最新跑步记录并生成展示数据，也可以在 Actions 页面手动点击 **Run workflow** 触发同步。

#### 本地同步命令：
```bash
python run_page/intervals_icu_sync.py <athlete_id> <api_key>
```

### 2. 本地文件手动同步 (GPX / FIT)

若有外部单次活动文件，可手动导入：

- **GPX 文件**: 将文件放入 `GPX_OUT/` 目录，执行：
  ```bash
  python run_page/gpx_sync.py
  ```
- **FIT 文件**: 将文件放入 `FIT_OUT/` 目录，执行：
  ```bash
  python run_page/fit_sync.py
  ```

---

## 本地开发与构建

### 环境要求

- **Node.js**: &gt;= 20.x
- **Python**: &gt;= 3.11
- **包管理器**: [pnpm](https://pnpm.io/) (`corepack enable pnpm`)

### 启动步骤

1. **安装 Python 依赖**:
   ```bash
   pip install -r requirements.txt
   ```

2. **安装前端依赖**:
   ```bash
   pnpm install
   ```

3. **启动本地开发调试服务**:
   ```bash
   pnpm dev
   ```
   浏览器访问 [http://localhost:5173](http://localhost:5173)。

4. **构建生产静态文件**:
   ```bash
   pnpm build
   ```

5. **代码格式化与规范检查**:
   ```bash
   pnpm run check        # 使用 Prettier 检查前端格式
   pnpm run lint         # 使用 ESLint 检查前端代码
   black . --check       # 使用 Black 检查 Python 代码格式
   ruff check .          # 使用 Ruff 进行 Python 静态检查
   ```

---

## 自动化部署

### GitHub Pages

项目已配置 `.github/workflows/gh-pages.yml` 实现全自动部署：

1. 每次数据同步工作流完成后，会自动触发 Pages 部署流水线。
2. 构建生成静态页面并发布至 GitHub Pages。
3. 自定义域名：当前绑定于 `run.gengniu.org`。

---

## 开源协议

MIT License.
