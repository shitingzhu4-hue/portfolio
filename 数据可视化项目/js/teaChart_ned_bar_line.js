// teaChart_ned_bar_line.js
(function() {
    class TeaNedBarLineChart {
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
          total: [234932, 365036, 1075001, 1366760, 1803274, 2584402, 2405232, 2471829, 683971, 2714789],
          tea: [203603, 201584, 590328, 960403, 1614841, 2087036, 1777256, 1738936, 367316, 2150192],
          ratio: [86.7, 55.3, 54.9, 70.3, 89.6, 80.8, 73.9, 70.4, 53.7, 79.2]
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
          grid: this.gridConfig,
          animationDuration: 1500,
          animationEasing: 'cubicOut'
        };
      }
  
      // 提示框配置
      get tooltipConfig() {
          return {
            backgroundColor: '#FFF5E6', // 米白色背景
            borderColor: '#8B4513',
            borderWidth: 2,
            textStyle: { color: '#5A3E36' }
          };
      }
  
      // 工具箱配置
      get toolboxConfig() {
        return {
          top: '10%',
          feature: {
            //dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true, title: '保存图表' }
          }
        };
      }
  
      // 图例配置
      get legendConfig() {
        return {
          data: ['中荷总货值', '中荷茶叶货值', '中荷比重'],
          top: '10%'
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
            name: '货值（荷盾）',
            nameTextStyle: { color: '#5A3E36' }, // 深棕色轴名
            axisLine: { lineStyle: { color: '#5A3E36' } },
            splitLine: { lineStyle: { type: 'dashed' } }, // 虚线网格
            axisLabel: { 
              formatter: value => `${(value / 10000).toFixed(0)}万`,
              color: '#5A3E36' // 标签颜色统一
            },
            max: 3000000,
            interval: 500000
          },
          {
            type: 'value',
            name: '比重（%）',
            nameTextStyle: { color: '#5A3E36' }, // 保持相同配色
            axisLine: { lineStyle: { color: '#5A3E36' } },
            splitLine: { show: false }, // 取消辅助线避免视觉干扰
            axisLabel: {
              formatter: '{value}%',
              color: '#5A3E36' // 标签颜色统一
            },
            min: 0,
            max: 100,
            interval: 10,
            offset: 20 // 右侧偏移防止重叠
          }
        ];
      }
  
      // 在chartSeries中修改颜色配置
      get chartSeries() {
        return [
          {
            name: '中荷总货值',
            type: 'bar',
            data: this.chartData.total,
            itemStyle: { 
              color: '#8B4513', // 茶褐色（茶箱木质色）
              borderRadius: [5,5,0,0] // 圆角柱状图
            },
            barWidth: '25%'
          },
          {
            name: '中荷茶叶货值',
            type: 'bar',
            data: this.chartData.tea,
            itemStyle: { 
              color: '#6B8E23',
              borderRadius: [5,5,0,0]
            },
            barWidth: '25%',
            label: {
              show: true,
              position: 'top',
              distance: 10, // 标签与柱子间距
              formatter: ({ value }) => {
                const formatted = (value / 10000).toFixed(1);
                return `${formatted}万`; // 显示带1位小数的万单位
              },
              color: '#5A3E36',
              fontSize: 12,
              fontWeight: 'bold',
              backgroundColor: '#FFF5E6', // 米黄色背景
              borderColor: '#8B4513', // 茶褐色边框
              borderWidth: 1,
              borderRadius: 4,
              padding: [4, 6], // 文字内边距
              shadowColor: 'rgba(0,0,0,0.1)',
              shadowBlur: 4
            }
          },
          {
            name: '中荷比重',
            type: 'line',
            yAxisIndex: 1,
            data: this.chartData.ratio,
            symbol: 'image://image/tea-leaf.png', // 使用茶叶图标作为数据点
            symbolSize: 20,
            lineStyle: { 
              width: 3, 
              color: '#D2691E', // 红茶色
              type: 'dotted' // 虚线增强文艺感
            }
          }
        ];
      }
  
      // 网格配置
      get gridConfig() {
        return {
          left: '10%',
          right: '10%',
          bottom: '15%',
          top: '20%'
        };
      }
  
      // 提示框格式化
      tooltipFormatter(params) {
        return `年份：${params[0].name}<br>` +
          params.map(item => 
            `${item.marker} ${item.seriesName}: ` +
            (item.seriesType === 'bar' 
              ? `${item.value.toLocaleString()}荷盾`
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
      new TeaNedBarLineChart('.teaChart');
    });
  })();