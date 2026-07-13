(function () {
  class TradePieChart {
    constructor(selector) {
      this.container = document.querySelector(selector);
      if (!this.container) {
        console.error(`容器 "${selector}" 未找到`);
        return;
      }

      this.chart = echarts.init(this.container);
      this.timer = null;

      // 暴露实例到全局
      window.chartInstances = window.chartInstances || {};
      window.chartInstances.pieChart = this;

      // 原始数据
      this.sourceData = {
        '1842': [
          { value: 2120900, name: '白毫茶' },
          { value: 3837900, name: '砖茶' },
          { value: 1886900, name: '棉布' },
          { value: 4207400, name: '丝绸' },
          { value: 6600, name: '毛织品' },
          { value: 0, name: '皮货' },
          { value: 3076000, name: '其它商品' }

        ],
        '1843': [
          { value: 3691600, name: '白毫茶' },
          { value: 5452300, name: '砖茶' },
          { value: 1054000, name: '棉布' },
          { value: 4352900, name: '丝绸' },
          { value: 0, name: '毛织品' },
          { value: 0, name: '皮货' },
          { value: 1620400, name: '其它商品' }
        ],
        '1844': [
          { value: 5918900, name: '白毫茶' },
          { value: 3728300, name: '砖茶' },
          { value: 730500, name: '棉布' },
          { value: 3986500, name: '丝绸' },
          { value: 5000, name: '毛织品' },
          { value: 2800, name: '皮货' },
          { value: 462000, name: '其它商品' }
        ],
        '1845': [
          { value: 10986000, name: '白毫茶' },
          { value: 6291600, name: '砖茶' },
          { value: 1434900, name: '棉布' },
          { value: 4752500, name: '丝绸' },
          { value: 100500, name: '毛织品' },
          { value: 21100, name: '皮货' },
          { value: 515800, name: '其它商品' }
        ],
        '1846': [
          { value: 12790800, name: '白毫茶' },
          { value: 8944800, name: '砖茶' },
          { value: 1566800, name: '棉布' },
          { value: 5044600, name: '丝绸' },
          { value: 49600, name: '毛织品' },
          { value: 7400, name: '皮货' },
          { value: 2087900, name: '其它商品' }
        ],
        '1847': [
          { value: 11431100, name: '白毫茶' },
          { value: 5706100, name: '砖茶' },
          { value: 1460700, name: '棉布' },
          { value: 4773400, name: '丝绸' },
          { value: 45000, name: '毛织品' },
          { value: 0, name: '皮货' },
          { value: 1500800, name: '其它商品' }
        ],
        '1848': [
          { value: 3969600, name: '白毫茶' },
          { value: 6566700, name: '砖茶' },
          { value: 647600, name: '棉布' },
          { value: 1745200, name: '丝绸' },
          { value: 27900, name: '毛织品' },
          { value: 0, name: '皮货' },
          { value: 491200, name: '其它商品' }
        ],
        '1849': [
          { value: 19051700, name: '白毫茶' },
          { value: 9999300, name: '砖茶' },
          { value: 446400, name: '棉布' },
          { value: 1875900, name: '丝绸' },
          { value: 0, name: '毛织品' },
          { value: 0, name: '皮货' },
          { value: 397600, name: '其它商品' }
        ],
        '1850': [
          { value: 41348000, name: '白毫茶' },
          { value: 8860200, name: '砖茶' },
          { value: 658300, name: '棉布' },
          { value: 1433200, name: '丝绸' },
          { value: 56400, name: '毛织品' },
          { value: 0, name: '皮货' },
          { value: 692700, name: '其它商品' }

        ]
      };

      this.initChart();
    }

    // 基础配置
    get baseOption() {
      return {
        // backgroundColor: '#F5F0E5', // 浅米色背景
        title: {
          textStyle: {
            color: '#6B4226', // 茶褐色
            fontSize: 18,
            fontFamily: 'Microsoft YaHei'
          }
        },
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          itemStyle: {
            borderRadius: 8,
            borderColor: '#F5F0E5',
            borderWidth: 3
          },
          label: {
            formatter: '{b|{b}}\n{hr|}\n{d|{d}%}',
            rich: {
              b: { color: '#466358', fontSize: 14 },
              hr: {
                borderColor: '#466358',
                width: '100%',
                borderWidth: 1,
                height: 0
              },
              d: { color: '#466358', fontSize: 12 }
            }
          },
          legend: {
            orient: 'vertical',
            // left: 280,           // 图例右移
            top: 'center',
            align: 'left'
          }
        }],
        timeline: {
          axisType: 'category',
          autoPlay: true,
          playInterval: 2000,
          data: Object.keys(this.sourceData).sort(),
          left: '10%',
          right: '10%'
        }
      };
    }

    // 动态选项生成
    get dynamicOptions() {
      return Object.keys(this.sourceData).sort().map(year => ({
        title: {
          text: `${year}年商品比例`,
          left: 'center',  //动态标题居中
          top: 1,
          textStyle: {
            fontSize: 16,
            color: '#466358'
          }
        },
        series: [{
          data: this.sourceData[year].map(item => ({
            ...item,
            itemStyle: this.getItemStyle(item.name)
          }))
        }]
      }));
    }

    // 商品颜色映射  颜色透明度修改！
    getItemStyle(name) {
      const colorMap = {
        '白毫茶': 'rgba(255, 215, 0, 0.7)',
        '砖茶': 'rgba(151, 181, 104, 0.7)',
        '棉布': 'rgba(46, 139, 87, 0.7)',
        '丝绸': 'rgba(81, 122, 101, 0.7)',
        '毛织品': 'rgba(160, 82, 45, 0.7)',
        '皮货': 'rgba(205, 133, 63, 0.7)',
        '其它商品': 'rgba(119, 136, 153, 0.7)'
      };
      return { color: colorMap[name] || '#466358' };
    }

    // 初始化图表
    initChart() {
      const option = {
        ...this.baseOption,
        options: this.dynamicOptions
      };

      // 设置初始选项
      this.chart.setOption(option);

      // 绑定时间轴变化事件
      this.chart.on('timelinechanged', params => {
        this.handleTimelineChange(params.currentIndex);
      });

      // 窗口resize处理
      window.addEventListener('resize', this.handleResize.bind(this));
    }

    // 修改时间轴事件处理
    handleTimelineChange(currentIndex) {
      const year = Object.keys(this.sourceData).sort()[currentIndex];
      if (window.chartInstances.lineChart) {
        window.chartInstances.lineChart.bindYearSelection(year);
      }
    }

    // 性能优化
    handleResize() {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.chart.resize();
      }, 200);
    }

    // 释放资源
    dispose() {
      this.chart.dispose();
      window.removeEventListener('resize', this.handleResize);
    }
  }

  // 自动初始化
  document.addEventListener('DOMContentLoaded', () => {
    new TradePieChart('#pieTimelineChart');
  });
})();