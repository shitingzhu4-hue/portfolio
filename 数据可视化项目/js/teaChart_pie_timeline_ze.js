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
      this.currentYear = '1842'; // 初始化当前年份

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

      // 增加当前年份追踪
      this.currentYear = Object.keys(this.sourceData)[0];
    }

    get baseOption() {
      return {
        tooltip: { show: false },
        legend: {
          orient: 'vertical',
          left: '66%', //修改为右侧对齐
          top: 'middle',
          right: '20%',   //添加右侧边距
          itemGap: 12,
          itemWidth: 20,
          itemHeight: 14,
          formatter: (name) => {
            const data = this.sourceData[this.currentYear].find(d => d.name === name);
            const value = data ? `${(data.value/1e4).toFixed(1)}万斤` : '0.0万斤';
            // 使用富文本// 强制固定字符宽度
            return `{name|${this.padName(name)}}{value|${value}}`;
          },
          textStyle: {
            color: '#466358',
            fontSize: 14,
            fontFamily: 'monospace',  // 使用等宽字体
            rich: {
              name: { 
                width: 34,  // 固定为4中文字符宽度(14px*4=56px + 竖线)
                align: 'left',
                padding: [0, 4, 0, 0]  //右侧留出间距
              },
              value: {
                width: 88,
                align: 'right',  //数值右对齐
                color: '#7A8B7F',
                fontSize: 13
              }
            }
          },
          // 确保显示所有图例项（即使值为0）
          data: this.getAllCategoryNames()
        },
        series: [{
          type: 'pie',
          center: ['37%', '50%'],  //调整饼图中心位置
          radius: ['30%', '60%'],  //缩小饼图半径
          itemStyle: {
            borderRadius: 8,
            borderColor: '#F5F0E5',
            borderWidth: 3
          },
          label: {
            show: true,
            position: 'outer',  // 改为绝对外部定位
            alignTo: 'none',    // 禁用自动对齐
            padding: [20, 5],   // 增加标签间距
            formatter: '{b|{b}}\n{d|{d}%}',
            rich: {
              b: { color: '#466358', fontSize: 12, padding: [2, 0] },
              d: { color: '#7A8B7F', fontSize: 12, fontWeight: 'bold' }
            },
            alignTo: 'labelLine',
            bleedMargin: 0,     // 增加出血边距
            // lineHeight: 10,
            distanceToLabelLine: 5,  // 增加标签与线的间距
          },
          labelLine: {
            show: true,
            // length: 30,        // 增加第一段线长
            // length2: 40,       // 增加第二段线长
            // smooth: false,     // 取消平滑曲线
            lineStyle: {
              color: '#466358',
              width: 1.2,      // 略微减细线宽
              type: 'dashed',
              // type: 'solid',    // 改为实线            
            length: 10,
            length2: 15,
            smooth: true,
            // lineStyle: {
            //   color: '#466358',
            //   width: 1.5,
              // type: 'dashed'
            // }
            }
          },
          emphasis: { 
            scale: false,
            label: { show: true }
          }
        }],
        timeline: {
          tooltip: { show: false },
          axisType: 'category',
          autoPlay: true,
          playInterval: 2000,
          data: Object.keys(this.sourceData).sort(),
          left: '10%',
          right: '10%',
          label: { color: '#466358', fontSize: 14 }
        }
      };
    }

    // 新增方法：统一名称格式为4字符宽度
    padName(name) {
      const map = {
        '白毫茶': '白  毫  茶',  // 3字 => 补1空格
        '砖茶': '砖　　茶 ',    // 2字 => 补2空格(全角空格)
        '棉布': '棉　　布 ',
        '丝绸': '丝　　绸 ',
        '毛织品': '毛  织  品',  // 3字
        '皮货': '皮　　货 ',
        '其它商品': '其它商品 ' // 4字
      };
      return `${map[name] || name} |`;  // 统一追加竖线
    }


    // 修改时间轴事件处理
    handleTimelineChange(currentIndex) {
      // 修复联动逻辑（关键修改）
      this.currentYear = Object.keys(this.sourceData).sort()[currentIndex];
      this.chart.setOption({ legend: {} }); // 强制刷新图例
      
      // 确保折线图实例存在
      if (window.chartInstances?.lineChart?.highlightYear) {
        window.chartInstances.lineChart.highlightYear(this.currentYear);
      }
    }    
    
    //  动态选项生成
    get dynamicOptions() {
      return Object.keys(this.sourceData).sort().map(year => ({
        title: { 
          text: `${year}年商品比例`,
          left : 'center',  //动态标题居中
          top: 20,
          textStyle: {
            fontSize: 16,
            color: '#6B4226'
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

    // 新增方法：获取所有可能的商品类别名称
    getAllCategoryNames() {
      const names = new Set();
      Object.values(this.sourceData).forEach(yearData => {
        yearData.forEach(item => names.add(item.name));
      });
      return Array.from(names);
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

    initChart() {
      const option = {
        ...this.baseOption,
        options: this.dynamicOptions
      };
      this.chart.setOption(option);

      this.chart.on('timelinechanged', params => {
        this.currentYear = Object.keys(this.sourceData).sort()[params.currentIndex];
        
        // 强制更新图例
        this.chart.setOption({
          legend: { data: this.getAllCategoryNames() }
        });
        
        // 联动折线图
        if (window.chartInstances.lineChart) {
          // 确保传递数字类型年份
          window.chartInstances.lineChart.highlightYear(parseInt(this.currentYear));
        }
      });

      // 添加点击事件二次触发
      this.chart.on('click', params => {
        if (params.seriesType === 'pie') {
          const year = this.currentYear;
          window.chartInstances.lineChart.highlightYear(parseInt(year));
        }
      });
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

  document.addEventListener('DOMContentLoaded', () => {
    new TradePieChart('#pieTimelineChart');
  });
})();