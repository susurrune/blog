/**
 * 博客文章数据 — 由 build.js 自动生成
 * 请勿手动编辑此文件
 * 生成时间: 2026-06-04T15:41:03.242Z
 * 文章数量: 3
 */
const BLOG_META = {
  title: '雨落 · 代码与笔墨',
  description: '关于编程、架构与思考的笔记',
  url: 'https://susurrune.github.io/blog',
  author: '雨落',
  postCount: 3,
  builtAt: '2026-06-04T15:41:03.243Z',
};

const posts = [
  {
    id: 1,
    slug: 'VSCode安装与ClaudeCode接入DeepSeek',
    title: 'VSCode 安装与 Claude Code 接入 DeepSeek 完整指南',
    excerpt: '从零开始安装配置 VSCode、Claude Code，并通过 CC-Switch 接入 DeepSeek 大模型，打造高效的 AI 辅助编程环境。',
    date: '2026-06-04',
    tags: ["工具","教程","Claude Code","DeepSeek","VSCode"],
    readingTime: 1,
    content: `
      <h2 id="一、安装-claude-code-准备">一、安装 Claude Code 准备</h2>
      <h3 id="1.-环境准备（软件下载）">1. 环境准备（软件下载）</h3>
      <ol>
      <li><strong>Node.js</strong> 下载：</li>
      </ol>
      <p>https://nodejs.org/zh-cn/download</p>
      <ol>
      <li><strong>Git</strong> 下载（推荐 <a href="https://github.com/git-for-windows/git/releases/download/v2.54.0.windows.1/Git-2.54.0-64-bit.exe">Git for Windows x64 Setup</a>）：</li>
      </ol>
      <p>https://git-scm.com/install/windows</p>
      <h3 id="2.-claude-code-安装">2. Claude Code 安装</h3>
      <ol>
      <li>按 <strong>Win+R</strong> 输入 <strong>pwsh</strong> 打开 PowerShell 命令行（也可以点 Win 键后直接搜索 PowerShell）。</li>
      </ol>
      <p>输入以下命令，解除终端脚本运行限制：</p>
      <pre class="language-powershell"><code>   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser</code></pre>
      <ol>
      <li>开始安装 Claude Code（国内网络如果 npm 官方源较慢，可临时切换镜像）：</li>
      </ol>
      <p><strong>（1）切换官方源为国内源：</strong></p>
      <pre class="language-powershell"><code>   npm config set registry https://registry.npmmirror.com</code></pre>
      <p><strong>（2）安装 Claude Code：</strong></p>
      <pre class="language-powershell"><code>   npm install -g @anthropic-ai/claude-code</code></pre>
      <p><strong>（3）切换回官方源：</strong></p>
      <pre class="language-powershell"><code>   npm config set registry https://registry.npmjs.org</code></pre>
      <h3 id="3.-deepseek-api-key-接入-claude-code">3. DeepSeek API Key 接入 Claude Code</h3>
      <ol>
      <li><strong>DeepSeek API Key 获取</strong>：</li>
      </ol>
      <p>https://platform.deepseek.com/api_keys</p>
      <blockquote>
      <p>登录账号并实名认证，创建 DeepSeek 的 API Key，记得复制保存在只有自己能看的地方（比如微信"文件传输助手"或本地新建一个 txt 文件保存好）。</p>
      </blockquote>
      <ol>
      <li><strong>CC-Switch 下载</strong>：</li>
      </ol>
      <p>https://github.com/farion1231/cc-switch/releases</p>
      <blockquote>
      <p>根据自己的电脑系统下载，Windows 下载 <code>CC-Switch-v3.16.1-Windows.msi</code>。</p>
      <p>下方为 Windows 直接下载链接（浏览器访问即下载，需科学上网）： https://github.com/farion1231/cc-switch/releases/download/v3.16.1/CC-Switch-v3.16.1-Windows.msi</p>
      </blockquote>
      <ol>
      <li>使用 CC-Switch 将 Claude Code 的大模型切换为 DeepSeek：</li>
      <ul>
      <li>安装完成后打开 CC-Switch</li>
      <li>选择第一项「终端版 Claude Code」</li>
      <li>点击右上角 <strong>+</strong> 号，选择 <strong>DeepSeek</strong></li>
      <li>填写 DeepSeek 的 API Key 配置信息</li>
      <li>点击「添加」</li>
      </ul>
      </ol>
      <blockquote>
      <p>填写完 DeepSeek 的 API Key 之后点击「添加」，Claude Code 的 AI 大模型就换成了 DeepSeek 的 <code>deepseek-v4-flash</code> 和 <code>deepseek-v4-pro</code>。</p>
      </blockquote>
      <ol>
      <li>按 <strong>Win+R</strong> 输入 <strong>pwsh</strong> 打开终端，输入以下指令即可使用终端版 Claude Code 全自动模式（无需多次点击 Yes）：</li>
      </ol>
      <pre class="language-powershell"><code>   claude --dangerously-skip-permissions</code></pre>
      <hr>
      <h2 id="二、vscode-安装与-claude-code-插件配置">二、VSCode 安装与 Claude Code 插件配置</h2>
      <h3 id="1.-vscode-下载">1. VSCode 下载</h3>
      <p>https://code.visualstudio.com/Download</p>
      <p>下载操作系统对应版本并安装。安装后登录 GitHub（注册一个 GitHub 账号，使用谷歌邮箱或 QQ 邮箱注册均可）。</p>
      <h3 id="2.-vscode-插件安装">2. VSCode 插件安装</h3>
      <ol>
      <li><strong>中文插件安装</strong>：点击左侧插件市场，搜索 <code>chinese</code>，安装「中文（简体）」插件。</li>
      <li><strong>Claude Code 插件安装</strong>：搜索 <code>claude</code>，安装 Claude Code（注意官方信息为 <strong>Anthropic</strong>，不要装错）。</li>
      <li>安装完成后，点击 Claude 图标即可打开对话框界面开始使用。</li>
      </ol>
      <hr>
      <h2 id="三、claude-code-重要-skills-安装">三、Claude Code 重要 Skills 安装</h2>
      <h3 id="1.-github-官方-skills-安装">1. GitHub 官方 Skills 安装</h3>
      <p>https://github.com/anthropics/skills</p>
      <p>将以上链接直接发给 Claude Code，让它安装里面的技能即可。</p>
      <h3 id="2.-其他技能按需选择">2. 其他技能按需选择</h3>
      <p>需要什么技能可以直接让 Claude Code 搜索并安装。如果安装失败，告诉它你的代理端口号即可（它会使用代理进行下载安装）。</p>
      <blockquote>
      <p><strong>常用科学上网软件代理端口对照表</strong></p>
      <p>| 软件 | 代理协议 | 默认端口 | 说明 | |:-----|:--------:|:--------:|:-----| | <strong>V2RayN</strong> | SOCKS5 | <strong>10808</strong> | 本文使用的客户端，推荐与 Claude Code 配合 | | V2RayN | HTTP | <strong>10809</strong> | 同时开启的 HTTP 代理端口 | | <strong>Clash Verge / FlClash</strong> | HTTP / SOCKS5 | <strong>7890</strong> | 界面清爽，功能与 V2RayN 类似 | | <strong>Shadowsocks</strong> | SOCKS5 | <strong>1080</strong> | 经典代理，久经考验 | | <strong>ShadowsocksR</strong> | SOCKS5 | <strong>1080</strong> | SSR 分支，沿用默认端口 | | <strong>Clash for Windows</strong> | HTTP / SOCKS5 | <strong>7890</strong> | 老牌 Clash 客户端 | | <strong>Surge</strong> | SOCKS5 | <strong>6153</strong> | 仅限 macOS 平台 | | <strong>Quantumult X</strong> | SOCKS5 | <strong>1080</strong> | 仅限 iOS 平台 | | <strong>Tor</strong> | SOCKS5 | <strong>9050</strong> / <strong>9150</strong> | 匿名代理，Tor 浏览器用 9150 |</p>
      <p>以上为默认端口，大部分软件支持自定义。如不确定，请查看代理软件设置中的「本地监听地址」或系统代理设置。</p>
      </blockquote>
      <h3 id="3.-skillhub-—-专为中国用户优化的-skills-社区">3. SkillHub — 专为中国用户优化的 Skills 社区</h3>
      <p>可以将以下链接发给 Claude，让它下载国内版的技能：</p>
      <p>https://skillhub.cloud.tencent.com</p>
      
    `,
  },
  {
    id: 2,
    slug: '从零搭建前端监控系统',
    title: '从零搭建前端监控系统',
    excerpt: '前端监控是线上应用的"眼睛"。从错误采集到性能分析，一步步搭建一个轻量级的前端监控系统。',
    date: '2026-05-22',
    tags: ["技术","前端","性能优化"],
    readingTime: 1,
    content: `
      <h2 id="为什么需要前端监控？">为什么需要前端监控？</h2>
      <p>没有监控的前端应用就像蒙眼开车——你不知道用户遇到了什么错误，页面加载有多慢，API 接口是否稳定。</p>
      <p>一个完整的前端监控系统需要覆盖三个维度：</p>
      <ul>
      <li><strong>错误监控</strong> — JavaScript 运行时错误、资源加载失败、未捕获的 Promise 异常</li>
      <li><strong>性能监控</strong> — 页面加载时间、首屏渲染时间、API 响应时间</li>
      <li><strong>用户行为</strong> — PV/UV、页面停留时长、点击热力图</li>
      </ul>
      <h2 id="错误采集">错误采集</h2>
      <h3 id="全局错误捕获">全局错误捕获</h3>
      <pre class="language-javascript"><code>// 捕获运行时错误
      window.onerror = function(message, source, lineno, colno, error) {
        report({
          type: 'runtime_error',
          message: message,
          source: source,
          line: lineno,
          column: colno,
          stack: error?.stack
        });
        return true;
      };
      
      // 捕获未处理的 Promise 异常
      window.addEventListener('unhandledrejection', function(event) {
        report({
          type: 'promise_error',
          message: event.reason?.message || String(event.reason),
          stack: event.reason?.stack
        });
      });</code></pre>
      <h3 id="资源加载失败">资源加载失败</h3>
      <pre class="language-javascript"><code>// 资源加载错误（图片、脚本、样式表）
      window.addEventListener('error', function(event) {
        const target = event.target;
        if (target &amp;&amp; (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
          report({
            type: 'resource_error',
            tag: target.tagName,
            src: target.src || target.href
          });
        }
      }, true); // 捕获阶段监听</code></pre>
      <h2 id="性能监控">性能监控</h2>
      <p>使用 Performance API 采集关键性能指标：</p>
      <pre class="language-javascript"><code>function collectPerformanceMetrics() {
        const timing = performance.timing;
        const nav = performance.navigation;
      
        const metrics = {
          // DNS 解析耗时
          dns: timing.domainLookupEnd - timing.domainLookupStart,
          // TCP 连接耗时
          tcp: timing.connectEnd - timing.connectStart,
          // TTFB（首字节时间）
          ttfb: timing.responseStart - timing.requestStart,
          // DOM 解析耗时
          domParse: timing.domInteractive - timing.domLoading,
          // DOMContentLoaded 时间
          dcl: timing.domContentLoadedEventEnd - timing.navigationStart,
          // 页面完全加载时间
          load: timing.loadEventEnd - timing.navigationStart,
        };
      
        // LCP（最大内容绘制）
        if (performance.getEntriesByType) {
          const paintEntries = performance.getEntriesByType('paint');
          paintEntries.forEach(entry =&gt; {
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
            }
          });
        }
      
        return metrics;
      }</code></pre>
      <h2 id="上报策略">上报策略</h2>
      <p>批量上报 + 压缩，减少对业务的影响：</p>
      <pre class="language-javascript"><code>class Reporter {
        constructor(config) {
          this.buffer = [];
          this.maxSize = config.batchSize || 10;
          this.interval = config.flushInterval || 5000;
          this.endpoint = config.endpoint;
          this._startTimer();
        }
      
        report(data) {
          data.timestamp = Date.now();
          data.url = window.location.href;
          data.userId = getUserToken();
          this.buffer.push(data);
      
          if (this.buffer.length &gt;= this.maxSize) {
            this.flush();
          }
        }
      
        flush() {
          if (this.buffer.length === 0) return;
      
          const payload = this.buffer.slice();
          this.buffer = [];
      
          // 使用 sendBeacon，页面卸载时也能可靠上报
          if (navigator.sendBeacon) {
            navigator.sendBeacon(this.endpoint, JSON.stringify(payload));
          } else {
            new Image().src = \`\${this.endpoint}?data=\${encodeURIComponent(JSON.stringify(payload))}\`;
          }
        }
      
        _startTimer() {
          setInterval(() =&gt; this.flush(), this.interval);
          // 页面关闭前强制上报
          window.addEventListener('beforeunload', () =&gt; this.flush());
        }
      }</code></pre>
      <h2 id="总结">总结</h2>
      <p>前端监控系统的核心思路其实很简单：<strong>采集 → 聚合 → 上报 → 展示</strong>。关键在于采集要全、上报要轻、聚合要准。</p>
      <blockquote>
      <p>监控不是为了监控而监控，而是为了更快地发现问题、定位问题、解决问题。一个好的监控系统，应该是"用了感觉不到存在，出了问题才知道它多重要"的基建工程。</p>
      </blockquote>
      
    `,
  },
  {
    id: 3,
    slug: '00-格式示例',
    title: '发布指南 — 如何写一篇博客',
    excerpt: '在 posts/md/ 中放一个 .md 文件，运行 node build.js，文章自动发布。本文展示了所有支持的 Markdown 语法。',
    date: '2026-05-20',
    tags: ["指南","博客"],
    readingTime: 1,
    content: `
      <h2 id="快速开始">快速开始</h2>
      <ol>
      <li>在 <code>posts/md/</code> 目录下创建一个 <code>.md</code> 文件</li>
      <li>文件头部用 <code>---</code> 包裹 YAML 格式的元数据</li>
      <li>正文使用 Markdown 编写</li>
      <li>运行 <code>node build.js</code>，自动生成 <code>posts/data.js</code></li>
      <li>刷新浏览器即可看到新文章</li>
      </ol>
      <h2 id="标题层级">标题层级</h2>
      <h3 id="三级标题">三级标题</h3>
      <h4 id="四级标题">四级标题</h4>
      <h5 id="五级标题">五级标题</h5>
      <h6 id="六级标题">六级标题</h6>
      <h2 id="文本样式">文本样式</h2>
      <p>普通文本，<strong>粗体文字</strong>，<em>斜体文字</em>，<strong><em>粗斜体</em></strong>，<del>删除线</del>，<code>行内代码</code>。</p>
      <h2 id="代码块">代码块</h2>
      <pre class="language-javascript"><code>function greet(name) {
        return \`Hello, \${name}!\`;
      }
      console.log(greet('World'));</code></pre>
      <pre class="language-python"><code>def fib(n):
          a, b = 0, 1
          for _ in range(n):
              a, b = b, a + b
          return a</code></pre>
      <p>无语言标识的纯文本块：</p>
      <pre><code>This is a plain text block.
      It has no syntax highlighting.</code></pre>
      <h2 id="列表">列表</h2>
      <p>无序列表：</p>
      <ul>
      <li>响应式设计</li>
      <li>性能优化</li>
      <li>可访问性</li>
      <ul>
      <li>ARIA 标签</li>
      <li>键盘导航</li>
      <li>屏幕阅读器支持</li>
      </ul>
      </ul>
      <p>有序列表：</p>
      <ol>
      <li>需求分析</li>
      <li>技术选型</li>
      <li>原型开发</li>
      <li>测试迭代</li>
      </ol>
      <h2 id="引用">引用</h2>
      <blockquote>
      <p>测量出来的东西，才能被改进。 — Peter Drucker</p>
      <p>技术选型的核心不是找"最好的"技术，而是找最适合当前团队和当前业务的技术。</p>
      </blockquote>
      <h2 id="链接与图片">链接与图片</h2>
      <p>访问 <a href="https://github.com">GitHub</a> 查看更多项目。</p>
      <h2 id="表格">表格</h2>
      <table>
      <thead>
      <tr><th>特性</th><th>描述</th><th>优先级</th></tr>
      </thead>
      <tbody>
      <tr><td>零依赖</td><td>无需安装任何包</td><td>高</td></tr>
      <tr><td>自动排序</td><td>按日期降序排列</td><td>高</td></tr>
      <tr><td>增量构建</td><td>保留已有文章 ID</td><td>中</td></tr>
      <tr><td>热更新</td><td>支持实时预览</td><td>低</td></tr>
      </tbody>
      </table>
      <h2 id="分隔线">分隔线</h2>
      <hr>
      <h2 id="注意事项">注意事项</h2>
      <ul>
      <li>日期格式必须为 <code>YYYY-MM-DD</code></li>
      <li><code>tags</code> 是数组，可以有多个标签</li>
      <li><code>excerpt</code> 会显示在文章列表的卡片上</li>
      <li>正文中可以直接写 HTML 标签（会被保留）</li>
      <li>文件按日期降序排列，最新的在最前面</li>
      </ul>
      
    `
  }
];
