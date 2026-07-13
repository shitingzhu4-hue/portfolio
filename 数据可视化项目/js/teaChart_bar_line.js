// teaChart_bar_line.js
(function() {
    class TeaBarLineChart {
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
          years: [1730, 1736, 1740, 1750, 1760, 1766, 1770, 1780, 1790, 1793],
          total: [469879, 121152, 186214, 507102, 707000, 1587266, 1413816, 2026043, 4669811, 3521171],
          tea: [374311, 87079, 132960, 366231, 653000, 1370818, 1323849, 125983, 4103828, 3126198],
          ratio: [73, 71, 71, 72, 92, 86, 94, 55, 88, 89]
        };
      }
  
      // 基础配置
      get baseOption() {
        return {
          tooltip: this.tooltipConfig,
          toolbox: this.toolboxConfig,
          legend: this.legendConfig,
          xAxis: this.xAxisConfig,
          yAxis: this.yAxisConfig,
          series: this.chartSeries,
          grid: this.gridConfig
        };
      }
  
      // 提示框配置
      get tooltipConfig() {
        return {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: { color: '#999' }
          },
          formatter: params => this.tooltipFormatter(params)
        };
      }
  
      // 工具箱配置
      get toolboxConfig() {
        return {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true, title: '保存图表' }
          }
        };
      }
  
      // 图例配置
      get legendConfig() {
        return {
          data: ['中英总货值', '中英茶叶货值', '中英比重'],
          top: 30
        };
      }
  
      // X轴配置
      get xAxisConfig() {
        return [{
          type: 'category',
          data: this.chartData.years,
          axisLabel: { rotate: 45 },
          name: '年份',
          axisPointer: { type: 'shadow' }
        }];
      }
  
      // Y轴配置
      get yAxisConfig() {
        return [
          {
            type: 'value',
            name: '货值（万两）',
            axisLabel: { formatter: value => `${(value / 10000).toFixed(0)}万` },
            max: 5000000,
            interval: 1000000
          },
          {
            type: 'value',
            name: '比重（%）',
            min: 0,
            max: 100,
            interval: 10,
            axisLabel: { formatter: '{value}%' }
          }
        ];
      }
  
      // 数据系列
      get chartSeries() {
        return [
          {
            name: '中英总货值',
            type: 'bar',
            data: this.chartData.total,
            itemStyle: { color: '#5470C6' },
            barWidth: '20%'
          },
          {
            name: '中英茶叶货值',
            type: 'bar',
            data: this.chartData.tea,
            itemStyle: { color: '#91CC75' },
            barWidth: '20%'
          },
          {
            name: '中英比重',
            type: 'line',
            yAxisIndex: 1,
            data: this.chartData.ratio,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: { width: 2, color: '#EE6666' },
            itemStyle: { color: '#EE6666' }
          }
        ];
      }
  
      // 网格配置
      get gridConfig() {
        return {
          left: '10%',
          right: '10%',
          bottom: '20%'
        };
      }
  
      // 提示框格式化
      tooltipFormatter(params) {
        return `年份：${params[0].name}<br>` +
          params.map(item => 
            `${item.marker} ${item.seriesName}: ` +
            (item.seriesType === 'bar' 
              ? `${item.value.toLocaleString()}两`
              : `${item.value}%`)
          ).join('<br>');
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
      new TeaBarLineChart('.teaChart');
    });
  })();