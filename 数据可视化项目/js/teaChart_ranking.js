// teaChart_ranking.js
(function() {
    class TeaRankingChart {
      constructor(selector) {
        this.container = document.querySelector(selector);
        if (!this.container) {
          console.error(`容器 "${selector}" 未找到`);
          return;
        }
  
        this.chart = echarts.init(this.container);
        this.currentYearIndex = 0;
        this.timer = null;
        this.initChart();
      }
  
      // 原始数据
      get teaData() {
        return [
          { year: 1888, china: 108400000, india: 78720000, srilanka: 14176000 },
          { year: 1889, china: 83904000, india: 85740000, srilanka: 34490000 },
          { year: 1890, china: 81504000, india: 91320000, srilanka: 31120000 },
          { year: 1891, china: 63200000, india: 91600000, srilanka: 36400000 },
          { year: 1892, china: 54600000, india: 100800000, srilanka: 57800000 },
          { year: 1893, china: 49500000, india: 97600000, srilanka: 59100000 },
          { year: 1894, china: 49300000, india: 104000000, srilanka: 65400000 },
          { year: 1895, china: 42200000, india: 104500000, srilanka: 69300000 },
          { year: 1896, china: 37100000, india: 107300000, srilanka: 75500000 },
          { year: 1897, china: 31752000, india: 116200000, srilanka: 86200000 }
        ];
      }
  
      // 颜色配置
      get colorMap() {
        return {
          china: '#d48265',
          india: '#91c7ae',
          srilanka: '#749f83'
        };
      }
  
      // 基础配置
      get baseOption() {
        return {
          title: {
            text: '英国市场茶叶输入量动态排序 (1888-1897)',
            left: 'center'
          },
          xAxis: {
            max: 'dataMax',
            name: '输入量 (斤)'
          },
          yAxis: {
            type: 'category',
            data: ['中国茶', '印度茶', '斯里兰卡茶'],
            inverse: true,
            animationDuration: 300,
            animationDurationUpdate: 300,
            max: 2,
            name: '茶叶种类'
          },
          series: [{
            realtimeSort: true,
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              formatter: '{@value} 斤',
              valueAnimation: true
            }
          }],
          animationDuration: 0,
          animationDurationUpdate: 3000,
          animationEasing: 'linear',
          animationEasingUpdate: 'linear'
        };
      }
  
      // 初始化图表
      initChart() {
        this.updateChart();
        this.startAutoPlay();
        this.bindEvents();
      }
  
      // 更新图表数据
      updateChart() {
        const data = this.teaData[this.currentYearIndex];
        const option = {
          ...this.baseOption,
          title: {
            ...this.baseOption.title,
            text: `年份：${data.year} 总输入量：${this.formatTotal(data)}斤`
          },
          series: [{
            ...this.baseOption.series[0],
            data: this.generateSeriesData(data)
          }]
        };
        this.chart.setOption(option);
      }
  
      // 生成系列数据
      generateSeriesData(data) {
        return [
          { value: data.china, itemStyle: { color: this.colorMap.china } },
          { value: data.india, itemStyle: { color: this.colorMap.india } },
          { value: data.srilanka, itemStyle: { color: this.colorMap.srilanka } }
        ];
      }
  
      // 格式化总量显示
      formatTotal(data) {
        return (data.china + data.india + data.srilanka).toLocaleString();
      }
  
      // 自动播放
      startAutoPlay() {
        this.timer = setInterval(() => {
          this.currentYearIndex = (this.currentYearIndex + 1) % this.teaData.length;
          this.updateChart();
        }, 3000);
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
        clearInterval(this.timer);
        this.chart.dispose();
        window.removeEventListener('resize', this.handleResize);
      }
    }
  
    // 自动初始化
    document.addEventListener('DOMContentLoaded', () => {
      new TeaRankingChart('.teaChart');
    });
  })();