(function() {
  class TeaChart {
    constructor(selector) {  //改为接收选择器
      this.container = document.querySelector(selector);
      if (!this.container) {
        console.error(`容器 #${selector} 未找到`);
        return;
      }

      this.chart = echarts.init(this.container);
      this.timer = null;
      this.currentOption = null;

      // 暴露实例到全局
      window.chartInstances = window.chartInstances || {};
      window.chartInstances.lineChart = this;

      // 添加触摸事件
      this.bindTouchEvents();


      // 初始化数据
      this.teaData = {
        years: [1836,1837,1838,1839,1840,1841,1842,1843,1844,1845,1846,1847,1848,1849,1850],
        whiteTea: [900,1900,1000,15200,122100,136200,47700,75500,122200,253200,268600,240400,89200,516000,1145600],
        brickTea: [141100,100800,113600,172700,155800,171400,325500,455500,338300,551500,820800,505000,543900,852800,761400]
      };

      // 计算总量
      this.totalWhiteTea = this.teaData.whiteTea.reduce((a, b) => a + b, 0);
      this.totalBrickTea = this.teaData.brickTea.reduce((a, b) => a + b, 0);

      // 初始化图表
      this.initChart();
    }
  
          // 新增方法：年份联动
          bindYearSelection(year) {
            const index = this.teaData.years.indexOf(Number(year));
            if (index > -1) {
                this.chart.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: index
                });
                this.highlightChart(); // 触发高亮效果
            }
        }
        
        // 新增方法：触摸事件处理
      bindTouchEvents() {
          this.chart.getZr().on('touchstart', e => {
              if (e.touches.length > 1) return;
              this.stopAutoSwitch();
          });
  
          this.chart.getZr().on('touchend', e => {
              this.startAutoSwitch();
          });
      }
  
      // 新增方法：高亮效果
      highlightChart() {
          this.container.classList.add('highlight');
          setTimeout(() => {
              this.container.classList.remove('highlight');
          }, 2000);
      }

    // 获取折线图配置
        // 获取折线图配置
        get scatterOption() {
          return {
            xAxis: {
              type: 'category',
              data: this.teaData.years,
              name: '年份',
              axisLabel: { rotate: 45 }
            },
            yAxis: {
              name: '茶叶数量 (斤)',
              scale: true,
              axisLabel: { 
                formatter: value => value >= 1e6 ? `${(value/1e6).toFixed(1)}M` : `${(value/1e3).toFixed(0)}K`
              }
            },
            tooltip: {
              trigger: 'axis', // 修复关键点：明确指定触发类型
              formatter: params => {
                const total = params.reduce((sum, cur) => sum + cur.value, 0);
                return `<strong>${params[0].name}年</strong><br>
                        ${params.map(item => `
                        <span style="border-left:3px solid ${item.color};padding-left:5px">
                        ${item.seriesName}: ${(item.value/1e4).toFixed(1)}万斤
                        </span>`).join('<br>')}
                        <hr style="margin:5px 0">
                        <div style="text-align:right">合计：${(total/1e4).toFixed(1)}万斤</div>`;
              }
            },
            legend: { 
              data: ['白毫茶', '砖茶'],
              top: 25
            },
            grid: { top: 80, bottom: 100 },
            series: [
              this.createSeries('白毫茶', this.teaData.whiteTea, '#FFD700'),
              this.createSeries('砖茶', this.teaData.brickTea, '#8B4513', 'dashed')
            ]
          };
        }
    
        // 获取柱状图配置
        get barOption() {
          return {
            xAxis: {
              type: 'category',
              data: ['白毫茶总和', '砖茶总和'],
              axisLabel: { interval: 0 }
            },
            yAxis: {
              name: '总数量 (斤)',
              axisLabel: { formatter: value => `${(value / 1e6).toFixed(1)}M` }
            },
            tooltip: {
              trigger: 'item',
              formatter: params => `${params.name}<br>总量: ${params.value.toLocaleString()}斤`
            },
            series: [{
              type: 'bar',
              name: '茶叶总量', // 修复关键点：添加系列名称
              data: [this.totalWhiteTea, this.totalBrickTea],
              itemStyle: {
                color: '#FFFACD',
                borderRadius: [5, 5, 0, 0]
              },
              label: {
                show: true,
                position: 'top',
                formatter: params => `${(params.value / 1e6).toFixed(1)}M`
              },
              universalTransition: {
                enabled: true,
                delay: (idx, count) => Math.random() * 400
              }
            }]
          };
        }

        // 新增性能优化
        handleResize() {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.chart.resize();
            }, 200);
        }

    // 创建系列通用方法
    createSeries(name, data, color, lineType = 'solid') {
      const colorMap = {
          '白毫茶': '#C9A769', // 茶叶黄
          '砖茶': '#6B4226'    // 茶砖棕
      };
      return {
        type: 'line',
        name,
        data,
        itemStyle: { 
            color: colorMap[name] || color,
            borderWidth: 2
        },
        lineStyle: {
            color: colorMap[name] || color,
            width: 3,
            type: lineType,
            shadowColor: 'rgba(0,0,0,0.2)',
            shadowBlur: 8
        },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: colorMap[name] + '80'
            }, {
                offset: 1,
                color: colorMap[name] + '10'
            }])
        },
        universalTransition: {
          enabled: true,
          delay: (idx, count) => Math.random() * 400
        }
      };
    }

    initChart() {
      // 初始显示折线图
      this.chart.setOption(this.scatterOption);
      this.currentOption = this.scatterOption;

      // 启动自动切换
      this.startAutoSwitch();

      // 窗口自适应
      window.addEventListener('resize', this.handleResize.bind(this));
    }

    // 启动自动切换
    startAutoSwitch(interval = 2000) {
      this.stopAutoSwitch();
      this.timer = setInterval(() => {
        this.currentOption = this.currentOption === this.scatterOption 
          ? this.barOption 
          : this.scatterOption;
        this.chart.setOption(this.currentOption, true);
      }, interval);
    }

    // 停止自动切换
    stopAutoSwitch() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }

    // 窗口调整处理
    handleResize() {
      this.chart.resize();
    }


    // 释放资源
    dispose() {
      this.stopAutoSwitch();
      this.chart.dispose();
      window.removeEventListener('resize', this.handleResize);
    }
  }


  // 自动初始化
  document.addEventListener('DOMContentLoaded', () => {
    new TeaChart('#lineBarChart'); // 确保选择器格式正确
  });
})();