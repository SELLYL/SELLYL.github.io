module.exports = {
  base: '/',
  title: 'Silas`s Lab', // 替换为您的博客名，例如 "茂林的科技日志"
  description: '探索前沿科技，分享开发心得',
  theme: 'reco',
  themeConfig: {
    type: 'blog',
    mode: 'dark', // 启用深色模式，更具科技感
    modePicker: true, // 允许用户切换亮暗模式
    author: 'Li Maolin', // 替换为您的名字
    authorAvatar: '/avatar.png', // 准备一个头像图片放在 .vuepress/public/ 下
    nav: [
      { text: '首页', link: '/', icon: 'reco-home' },
      { text: '时间轴', link: '/timeline/', icon: 'reco-date' },
      { text: '分类', link: '/categories/', icon: 'reco-category' },
      { text: '标签', link: '/tags/', icon: 'reco-tag' },
      { 
        text: '项目', 
        items: [
          { text: 'GitHub', link: 'https://github.com/yourusername', icon: 'reco-github' },
          { text: '开源项目', link: '/projects/' }
        ]
      }
    ],
    blogConfig: {
      category: {
        location: 2,
        text: '分类'
      },
      tag: {
        location: 3,
        text: '标签'
      },
      socialLinks: [
        { icon: 'reco-github', link: 'https://github.com/yourusername' },
        { icon: 'reco-juejin', link: 'https://juejin.cn/user/yourid' }, // 可选
        { icon: 'reco-mail', link: 'mailto:your-email@example.com' }
      ]
    },
    // 科技感配色方案
    accentColor: '#3eaf7c', // 主色调，使用科技感的青色/绿色
    footer: {
      since: 2024,
      // 自定义页脚，增加科技感标语
      record: 'MIT Licensed | Copyright © 2025-Present Li Maolin',
      recordLink: '',
      cyberSecurityRecord: '知识共享，探索未来。',
      cyberSecurityLink: ''
    },
    // 激活丝滑的页面切换动画
    smoothScroll: true
  },
  // 自定义头部，引入外部字体和样式
  head: [
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;500;600&display=swap' }],
    ['link', { rel: 'stylesheet', href: '/css/custom.css' }], // 我们的自定义样式文件
    ['script', { src: '/js/effects.js' }] ,// 可选：用于添加动态效果
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css' }],
    ['script', {}, `
      document.addEventListener('DOMContentLoaded', function() {
        // 延迟执行以确保 DOM 完全加载
        setTimeout(function() {
          if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
          }
        }, 100);
        
        // 监听路由变化，在页面切换时重新高亮
        if (typeof window !== 'undefined' && window.$vuepress) {
          window.$vuepress.router.afterEach(function() {
            setTimeout(function() {
              if (typeof Prism !== 'undefined') {
                Prism.highlightAll();
              }
            }, 200);
          });
        }
      });
  `]
  ],
  plugins: [
    //代码高亮
     ['@vuepress/plugin-prismjs', {
      // 预加载 C++ 和其他语言
      preload: [
        'cpp',
        'c',
        'python',
        'java',
        'bash',
        'javascript',
        'css'
      ]
    }],
    // 动态光标效果插件（可选，但能极大增强科技感）
    ['cursor-effects', {
      size: 2,
      shape: 'star',
      zIndex: 999999999,
    }],
    // 阅读进度条插件
    ['reading-progress', {
      // 科技感配色
      color: "var(--accent-color, #3eaf7c)",
    }]
  ],
  markdown: {
    lineNumbers: false// 显示代码行号，提升技术感  
  }
}