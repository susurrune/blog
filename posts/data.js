/**
 * 博客文章数据 — 由 build.js 自动生成
 * 请勿手动编辑此文件
 * 生成时间: 2026-05-23T05:57:24.227Z
 * 文章数量: 2
 */
const posts = [
  {
    id: 1,
    title: '从零搭建前端监控系统',
    excerpt: '前端监控是线上应用的"眼睛"。从错误采集到性能分析，一步步搭建一个轻量级的前端监控系统。',
    date: '2026-05-22',
    tags: ["技术","前端","性能优化"],
    content: `
      <h2>为什么需要前端监控？</h2>
      <p>没有监控的前端应用就像蒙眼开车——你不知道用户遇到了什么错误，页面加载有多慢，API 接口是否稳定。</p>
      <p>一个完整的前端监控系统需要覆盖三个维度：</p>
      <ul>
      <li><strong>错误监控</strong> — JavaScript 运行时错误、资源加载失败、未捕获的 Promise 异常</li>
      <li><strong>性能监控</strong> — 页面加载时间、首屏渲染时间、API 响应时间</li>
      <li><strong>用户行为</strong> — PV/UV、页面停留时长、点击热力图</li>
      </ul>
      <h2>错误采集</h2>
      <h3>全局错误捕获</h3>
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
      <h3>资源加载失败</h3>
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
      <h2>性能监控</h2>
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
      <h2>上报策略</h2>
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
      <h2>总结</h2>
      <p>前端监控系统的核心思路其实很简单：<strong>采集 → 聚合 → 上报 → 展示</strong>。关键在于采集要全、上报要轻、聚合要准。</p>
      <blockquote><p>监控不是为了监控而监控，而是为了更快地发现问题、定位问题、解决问题。一个好的监控系统，应该是"用了感觉不到存在，出了问题才知道它多重要"的基建工程。</p></blockquote>
      
    `,
  },
  {
    id: 2,
    title: '发布指南 — 如何写一篇博客',
    excerpt: '在 posts/md/ 中放一个 .md 文件，运行 node build.js，文章自动发布。本文展示了所有支持的 Markdown 语法。',
    date: '2026-05-20',
    tags: ["指南","博客"],
    content: `
      <h2>快速开始</h2>
      <ol>
      <li>在 <code>posts/md/</code> 目录下创建一个 <code>.md</code> 文件</li>
      <li>文件头部用 <code>---</code> 包裹 YAML 格式的元数据</li>
      <li>正文使用 Markdown 编写</li>
      <li>运行 <code>node build.js</code>，自动生成 <code>posts/data.js</code></li>
      <li>刷新浏览器即可看到新文章</li>
      </ol>
      <h2>标题层级</h2>
      <h3>三级标题</h3>
      <h4>四级标题</h4>
      <h5>五级标题</h5>
      <h6>六级标题</h6>
      <h2>文本样式</h2>
      <p>普通文本，<strong>粗体文字</strong>，<em>斜体文字</em>，<strong><em>粗斜体</em></strong>，<del>删除线</del>，<code>行内代码</code>。</p>
      <h2>代码块</h2>
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
      <h2>列表</h2>
      <p>无序列表：</p>
      <ul>
      <li>响应式设计</li>
      <li>性能优化</li>
      <li>可访问性</li>
      <li>ARIA 标签</li>
      <li>键盘导航</li>
      <li>屏幕阅读器支持</li>
      </ul>
      <p>有序列表：</p>
      <ol>
      <li>需求分析</li>
      <li>技术选型</li>
      <li>原型开发</li>
      <li>测试迭代</li>
      </ol>
      <h2>引用</h2>
      <blockquote><p>测量出来的东西，才能被改进。</p></blockquote>
      <blockquote><p>— Peter Drucker</p></blockquote>
      <blockquote></blockquote>
      <blockquote><p>技术选型的核心不是找"最好的"技术，而是找最适合当前团队和当前业务的技术。</p></blockquote>
      <h2>链接与图片</h2>
      <p>访问 <a href="https://github.com">GitHub</a> 查看更多项目。</p>
      <h2>表格</h2>
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
      <h2>分隔线</h2>
      <hr>
      <h2>注意事项</h2>
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
