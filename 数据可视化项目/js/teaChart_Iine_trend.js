// teaChart_line_trend.js
(function() {
    class TeaTrendChart {
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
      get chartData() {
        return {
          years: [1888, 1889, 1890, 1891, 1892, 1893, 1894, 1895, 1896, 1897],
          china: [108400000, 83904000, 81504000, 63200000, 54600000, 49500000, 49300000, 42200000, 37100000, 31752000],
          india: [78720000, 85740000, 91320000, 91600000, 100800000, 97600000, 104000000, 104500000, 107300000, 116200000],
          srilanka: [14176000, 34490000, 31120000, 36400000, 57800000, 59100000, 65400000, 69300000, 75500000, 86200000]
        };
      }
  
      // 基础配置
      get baseOption() {
        return {
          title: this.titleConfig,
          tooltip: this.tooltipConfig,
          legend: this.legendConfig,
          grid: this.gridConfig,
          toolbox: this.toolboxConfig,
          xAxis: this.xAxisConfig,
          yAxis: this.yAxisConfig,
          series: this.chartSeries
        };
      }
  
      // 标题配置
      get titleConfig() {
        return {
          text: '英国市场茶叶输入量趋势（1888-1897）',
          left: 'center'
        };
      }
  
      // 提示框配置
      get tooltipConfig() {
        return {
          trigger: 'axis',
          formatter: params => this.tooltipFormatter(params)
        };
      }
  
      // 图例配置
      get legendConfig() {
        return {
          data: ['中国茶', '印度茶', '斯里兰卡茶'],
          top: 30
        };
      }
  
      // 网格配置
      get gridConfig() {
        return {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        };
      }
  
      // 工具箱配置
      get toolboxConfig() {
        return {
          feature: {
            saveAsImage: { title: '保存图片' }
          }
        };
      }
  
      // X轴配置
      get xAxisConfig() {
        return {
          type: 'category',
          boundaryGap: false,
          data: this.chartData.years,
          name: '年份',
          axisLabel: { rotate: 45 }
        };
      }
  
      // Y轴配置
      get yAxisConfig() {
        return {
          type: 'value',
          name: '输入量（斤）',
          axisLabel: {
            formatter: value => `${(value / 1000000).toFixed(0)}M`
          }
        };
      }
  
      // 数据系列
      get chartSeries() {
        return [
          {
            name: '中国茶',
            type: 'line',
            stack: 'Total',
            data: this.chartData.china,
            smooth: true,
            lineStyle: { width: 2 },
            itemStyle: { color: '#d48265' }
          },
          {
            name: '印度茶',
            type: 'line',
            stack: 'Total',
            data: this.chartData.india,
            smooth: true,
            lineStyle: { width: 2 },
            itemStyle: { color: '#91c7ae' }
          },
          {
            name: '斯里兰卡茶',
            type: 'line',
            stack: 'Total',
            data: this.chartData.srilanka,
            smooth: true,
            lineStyle: { width: 2 },
            itemStyle: { color: '#749f83' }
          }
        ];
      }
  
      // 提示框格式化
      tooltipFormatter(params) {
        return params.map(item => 
          `${item.marker} ${item.seriesName}: ${item.value.toLocaleString()}斤`
        ).join('<br>') + `<br>年份：${params[0].name}`;
      }
  
      // 初始化图表
      initChart() {
        this.chart.setOption(this.baseOption);
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
      new TeaTrendChart('.teaChart');
    });
  })();