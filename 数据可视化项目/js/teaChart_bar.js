// teaChart_bar.js
(function() {
    class TeaBarChart {
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
  
      // 主数据
      get mainData() {
        return [
          {
            value: 9600,
            name: '唐代',
            itemStyle: { color: '#FFA500' },
            drilldown: 'tang'
          },
          {
            value: 9477.6,
            name: '明代', 
            itemStyle: { color: '#FFD700' },
            drilldown: 'ming'
          },
          {
            value: 139661.4,
            name: '清代',
            itemStyle: { color: '#8B4513' },
            drilldown: 'qing'
          }
        ];
      }
  
      // 下钻数据
      get drilldownData() {
        return {
          tang: [
            ['盛唐（亩产）', 0.0143],
            ['中唐（766-835）', 1200],
            ['贞元九年（793）', 9600],
            ['晚唐（836-907）', 10000]
          ],
          ming: [
            ['明代前期', 9040.5],
            ['明代中期', 9475.8],
            ['明代晚期', 9477.6]
          ],
          qing: [
            ['初期（1649-1653）', 58.1],
            ['高峰期（1723-1725）', 59177.6],
            ['出口期（1840-1912）', 139661.4]
          ]
        };
      }
  
      // 基础配置
      get baseOption() {
        return {
          title: {
            text: '中国历代茶叶产量数据图',
            subtext: '点击柱子查看详细时期数据',
            left: 'center',
            textStyle: { color: '#7CB342' }
          },
          tooltip: {
            trigger: 'item',
            formatter: params => this.tooltipFormatter(params)
          },
          xAxis: {
            data: this.mainData.map(item => item.name)
          },
          yAxis: {
            name: '产量',
            axisLabel: {
              formatter: value => this.axisFormatter(value)
            }
          },
          series: [{
            type: 'bar',
            data: this.mainData,
            label: {
              show: true,
              position: 'top',
              formatter: params => this.labelFormatter(params.value)
            }
          }]
        };
      }
  
      // 格式化方法
      tooltipFormatter(params) {
        return `朝代：${params.name}<br/>代表产量：${params.value}万斤`;
      }
  
      axisFormatter(value) {
        return value >= 10000 ? `${(value/10000).toFixed(1)}亿斤` : `${value}万斤`;
      }
  
      labelFormatter(value) {
        return value > 10000 ? 
          `${(value/10000).toFixed(1)}亿斤` : 
          `${value}万斤`;
      }
  
      // 初始化图表
      initChart() {
        this.chart.setOption(this.baseOption);
      }
  
      // 事件处理
      bindEvents() {
        this.chart.on('click', params => this.handleClick(params));
      }
  
      handleClick(params) {
        if (params.data?.drilldown) {
          this.showDrilldown(params.data.drilldown);
        }
      }
  
      // 显示下钻数据
      showDrilldown(drilldownId) {
        const drillData = this.drilldownData[drilldownId];
        
        this.chart.setOption({
          xAxis: { data: drillData.map(i => i[0]) },
          series: [{
            type: 'bar',
            data: drillData,
            label: {
              formatter: p => this.drilldownLabelFormatter(p.value)
            }
          }],
          graphic: [{
            type: 'text',
            right: 20,
            top: 20,
            style: {
              text: '返回总览',
              fill: '#666',
              fontSize: 14
            },
            onclick: () => this.resetChart()
          }]
        });
      }
  
      // 下钻标签格式化
      drilldownLabelFormatter(value) {
        return value > 1000 ? 
          `${(value/10000).toFixed(1)}亿` : 
          `${value}万`;
      }
  
      // 重置图表
      resetChart() {
        this.chart.setOption(this.baseOption);
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
      new TeaBarChart('.teaChart');
    });
  })();