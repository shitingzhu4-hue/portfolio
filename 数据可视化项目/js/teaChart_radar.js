// teaChart_radar.js
(function() {
    class TeaRadarChart {
      constructor(selector) {
        this.container = document.querySelector(selector);
        if (!this.container) {
          console.error(`容器 "${selector}" 未找到`);
          return;
        }
  
        this.chart = echarts.init(this.container);
        this.initChart();
        this.bindEvents();
      }
  
      // 基础数据
      get teaData() {
        return [
          { 
            name: '唐代',
            value: [5,5,4,3,2],
            reason: '气候温暖+人口南迁+经济重心南移+交通发展',
            color: '#FFB74D' 
          },
          {
            name: '宋元',
            value: [5,3,2,2,1],
            reason: '气温下降+种植北界南移',
            color: '#E65100'
          },
          {
            name: '明代',
            value: [5,4,2,3,1],
            reason: '江南人口增长+技术市场影响',
            color: '#F57C00' 
          },
          {
            name: '清代',
            value: [5,5,5,5,3],
            reason: '技术革新+市场需求+交通改善',
            color: '#FFE0B2' 
          }
        ];
      }
  
      // 基础配置
      get baseOption() {
        return {
          title: {
            text: '茶种植地域分布变化雷达图',
            left: 'center',
            textStyle: { color: '#FB8C00' }
          },
          legend: {
            data: this.teaData.map(item => item.name),
            bottom: 10,
            textStyle: { color: '#666' }
          },
          radar: {
            indicator: [
              { name: '长江流域', max: 5 },
              { name: '东南沿海', max: 5 },
              { name: '珠江流域', max: 5 },
              { name: '西南地区', max: 5 },
              { name: '北方地区', max: 5 }
            ],
            shape: 'polygon',
            axisName: { color: '#E65100' },
            splitArea: { show: false },
            axisLine: { lineStyle: { color: 'rgba(46,69,89,0.2)' } }
          },
          tooltip: {
            trigger: 'item',
            formatter: params => this.tooltipFormatter(params),
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderColor: '#2E4550',
            textStyle: { 
              color: '#333',
              fontSize: 14
            }
          }
        };
      }
  
      // 动态配置
      get dynamicSeries() {
        return {
          type: 'radar',
          emphasis: { 
            lineStyle: { width: 4 },
            areaStyle: { opacity: 0.8 }
          },
          data: this.teaData.map(item => ({
            name: item.name,
            value: item.value,
            reason: item.reason,
            itemStyle: { color: item.color },
            lineStyle: { 
              width: 2,
              color: item.color
            },
            areaStyle: { opacity: 0.3 },
            symbol: 'circle',
            symbolSize: 6,
            label: {
              show: true,
              formatter: params => params.data.name,
              position: 'top',
              lineStyle: { type: 'dashed', width: 1, color: '#2E4559' },
              offset: [0, 20]
            }
          }))
        };
      }
  
      // 提示框格式化
      tooltipFormatter(params) {
        return `
          <div style="font-weight:bold;color:${params.color}">${params.name}</div>
          <hr style="margin:5px 0;border-color:#eee">
          ${params.data.reason.replace(/\+/g, '<br>')}
        `;
      }
  
      // 初始化图表
      initChart() {
        const option = {
          ...this.baseOption,
          series: [this.dynamicSeries]
        };
        this.chart.setOption(option);
      }
  
      // 事件绑定
      bindEvents() {
        window.addEventListener('resize', this.handleResize.bind(this));
      }
  
      // 窗口调整处理
      handleResize() {
        this.chart.resize();
      }
  
      // 释放资源
      dispose() {
        this.chart.dispose();
        window.removeEventListener('resize', this.handleResize);
      }
    }
  
    // 自动初始化
    document.addEventListener('DOMContentLoaded', () => {
      new TeaRadarChart('.teaChart');
    });
  })();