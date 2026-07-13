// teaChart_mulberry.js
(function() {
  class TeaSankeyChart {
    constructor(selector, dataUrl) {
      this.container = document.querySelector(selector);
      if (!this.container) {
        console.error(`容器 "${selector}" 未找到`);
        return;
      }
      
      this.dataUrl = dataUrl;
      this.chart = null;
      this.init();
    }

    async init() {
      try {
        // 异步加载数据
        const data = await this.loadData();
        
        // 初始化图表
        this.chart = echarts.init(this.container, null, {
          renderer: 'canvas',
          useDirtyRect: false
        });
        
        this.initChart(data);
        this.bindEvents();
        
      } catch (error) {
        console.error('图表初始化失败:', error);
        this.showError();
      }
    }

    // 数据加载方法
    async loadData() {
      const response = await fetch(this.dataUrl);
      if (!response.ok) throw new Error(`HTTP错误! 状态码: ${response.status}`);
      return response.json();
    }

    // 图表初始化
    initChart(data) {
      const option = {
        ...this.baseOption,
        series: [{
          ...this.baseOption.series[0],
          data: data.nodes,
          links: data.links
        }]
      };
      this.chart.setOption(option);
    }

    // 错误显示
    showError() {
      this.container.innerHTML = `
        <div style="color: #721c24; background: #f8d7da; 
          padding: 20px; border-radius: 4px; text-align: center">
          <h3>数据加载失败</h3>
          <p>请检查网络连接或数据文件路径</p>
          <button onclick="location.reload()">重试</button>
        </div>
      `;
    }

    // 基础配置项
    get baseOption() {
      return {
        backgroundColor: '#fff',
        title: {
          text: '历代茶类与冲泡方式关系',
          left: 'center',
          textStyle: { 
            color: '#7CB342',
            fontSize: 24
          },
          top: 15
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} → {c}'
        },
        series: [{
          type: 'sankey',
          layout: 'none',
          emphasis: { focus: 'adjacency' },
          top: 100,
          bottom: 80,
          nodeWidth: 10,
          nodeGap: 80,
          nodeAlign: 'justify',
          draggable: false,
          lineStyle: {
            curveness: 0.3,
            color: 'source',
            opacity: 0.8,
            width: 0.5
          },
          label: {
            color: '#333',
            fontSize: 12,
            position: 'right'
          }
        }]
      };
    }

    // 事件绑定
    bindEvents() {
      window.addEventListener('resize', this.handleResize.bind(this));
      this.chart.on('click', this.handleChartClick.bind(this));
    }

    // 处理图表点击事件
    handleChartClick(params) {
      console.log('点击节点:', params.name);
      // 示例：点击节点时高亮相关连接线
      this.chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        name: params.name
      });
    }

    // 窗口调整处理
    handleResize() {
      this.chart.resize();
      console.log('图表已自适应窗口变化');
    }

    // 更新数据方法
    async updateData(newDataUrl) {
      try {
        const newData = await this.loadData(newDataUrl);
        this.chart.setOption({
          series: [{
            data: newData.nodes,
            links: newData.links
          }]
        });
        console.log('数据更新成功');
      } catch (error) {
        console.error('数据更新失败:', error);
      }
    }

    // 释放资源
    dispose() {
      window.removeEventListener('resize', this.handleResize);
      this.chart.dispose();
      console.log('图表资源已释放');
    }

    // 显示加载状态（增强功能）
    showLoading(text = '数据加载中...') {
      this.container.innerHTML = `
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        ">
          <div class="loader" style="
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
          "></div>
          <p style="margin-top: 10px; color: #666;">${text}</p>
        </div>
      `;
    }

    // 隐藏加载状态
    hideLoading() {
      this.container.innerHTML = '';
    }
  }


  // 初始化实例时传入数据路径
  document.addEventListener('DOMContentLoaded', () => {
    new TeaSankeyChart('#container', './js/tea_mulberry.json');
  });
})();