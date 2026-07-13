// teaChart_combo.js
(function () {
  class TeaComboChart {
    constructor(selector) {
      this.container = document.querySelector(selector);
      if (!this.container) {
        console.error(`容器 "${selector}" 未找到`);
        return;
      }

      this.chart = echarts.init(this.container);
      this.currentDimension = 1;
      this.countries = [
        '英国', '欧洲其他地区', '加拿大', '中国',
        '日本', '印度及斯里兰卡', '其他地区'
      ];

      this.initChart();
      this.bindEvents();
    }

    // 基础数据
    get datasetSource() {
      return [
        ['来源地', '1871~1880', '1881~1893', '1894~1900', '1901~1905', '1906~1910'],
        ['英国', 293.43, 244.4, 307.3, 481, 888],
        ['欧洲其他地区', 22.68, 18.14, 24.49, 96, 364],
        ['加拿大', 73.56, 396, 1118, 1710, 2490],
        ['中国', 30800, 37700, 43300, 42400, 28400],
        ['日本', 20210, 32700, 32000, 34300, 38500],
        ['印度及斯里兰卡', 794.4, 453.6, 1690, 5110, 7060],
        ['其他地区', 1340, 1.81, 266, 386, 456]
      ];
    }

    // 基础配置
    get baseOption() {
      return {
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            let html = `<div style="font-family:华文楷体;color:#4a2c2a">${params[0].name}</div>`;
            params.forEach(item => {
              const rawValue = item.data[item.seriesIndex + 1];
              html += `<div style="display:flex;align-items:center;">
                          <span style="display:inline-block;width:10px;height:10px;background:${item.color};margin-right:5px"></span>
                          ${item.seriesName}: <strong style="color:#7ba23f;margin-left:5px">${rawValue}万斤</strong>
                      </div>`;
            });
            return html;
          }
        },
        dataset: { source: this.datasetSource },
        color: ['#8c5642', '#7ba23f', '#d3b683', '#4a2c2a', '#9c9359', '#b5495b', '#6d8346'],
        backgroundColor: 'rgba(0,0,0,0)',
        title: {
          textStyle: {
            fontSize: 26,
            fontFamily: '华文行楷',
            color: '#4a2c2a'
          },
          subtextStyle: {
            fontSize: 14,
            color: '#7ba23f',
            fontFamily: '华文楷体'
          },
          top: 25,
          left: 'center'
        },
        legend: {
          data: this.countries,
          top: 65,
          right: '5%',
          orient: 'vertical',
          itemGap: 12,
          textStyle: {
            color: '#4a2c2a',
            fontFamily: '华文楷体',
            fontSize: 14
          }
        },
        yAxis: {
          type: 'log',
          logBase: 10,
          min: 1,
          max: 100000,
          name: '进口量（万斤）',
          axisLabel: {
            formatter: value => {
              if (value >= 10000) return `${value / 10000}亿`;
              if (value >= 1000) return `${value / 1000}千`;
              return value;
            },
            color: '#6d8346',
            fontFamily: '华文楷体'
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#d3b683'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#4a2c2a',
              width: 2
            }
          }
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            rotate: 45,
            formatter: function (value) {
              if (typeof value === 'string') {
                return value.replace('~', '\n');
              }
              return value;
            },
            color: '#6d8346',
            fontSize: 12,
            fontFamily: '华文楷体',
            margin: 15
          },
          axisTick: {
            alignWithLabel: true,
            lineStyle: { color: '#4a2c2a' }
          }
        },
        grid: { top: '60%', bottom: 60 },
        series: this.generateSeries()
      };
    }

    // 生成系列配置
    generateSeries() {
      const lineSeries = this.countries.map(name => ({
        name,
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: {  
          focus: 'series',
          blurScope: 'coordinateSystem',
          label: {
            show: true,
            formatter: '{b}: {@[1]}万斤'
          }
        }
      }));

      return [...lineSeries, {
        type: 'pie',
        id: 'pie',
        radius: ['32%', '48%'], 
        center: ['50%', '32%'], 
        itemStyle: {
          borderRadius: 8,
          borderColor: '#f5efe0',
          borderWidth: 3,
          opacity: 1 // 初始透明度为1
        },
        label: {
          formatter: '{b|{b}}\n{hr|}\n{value|{@1871~1880}万斤}',
          rich: {
            b: {
              color: '#4a2c2a',
              fontSize: 12,
              fontFamily: '华文楷体',
              padding: [0, 0, 5, 0]
            },
            hr: {
              borderColor: '#8c5642',
              width: '100%',
              borderWidth: 1,
              height: 0
            },
            value: {
              color: '#7ba23f',
              fontSize: 12,
              fontFamily: '华文楷体',
              fontWeight: 'bold'
            }
          }
        },
        encode: {
          itemName: '来源地',
          value: '1871~1880',
          tooltip: '1871~1880'
        },
        grid: {
          top: '50%',
          bottom: 80,
          right: '12%',
          left: '12%'
        },
        data: this.datasetSource.slice(1).map(row => ({
          name: row[0],
          value: row[1],
          itemStyle: { opacity: 1 } // 数据项初始透明度为1
        }))
      }];
    }

    // 初始化图表
    initChart() {
      this.chart.setOption(this.baseOption);
    }

    // 事件绑定
    bindEvents() {
      this.chart.on('legendselectchanged', params => this.handleLegendChange(params));
      this.chart.on('mouseover', { seriesType: 'line' }, event => this.handleLineHover(event));
      window.addEventListener('resize', () => this.chart.resize());
    }

    // 处理折线图悬停
    handleLineHover(event) {
      const dimensionName = event.name;
      const dimensionIndex = this.datasetSource[0].indexOf(dimensionName);

      if (dimensionIndex > 0) {
        this.currentDimension = dimensionIndex;
        this.updatePieChart();
      }
    }

    // 图例选择处理
    handleLegendChange(params) {
      const selected = params.selected || {};
      const newSeries = this.baseOption.series.map(series => {
        if (series.type === 'line') {
          return { ...series, silent: !selected[series.name] };
        }
        if (series.id === 'pie') {
          return { ...series, data: this.getFilteredPieData(selected) };
        }
        return series;
      });

      this.chart.setOption({ series: newSeries });
    }

    // 更新饼图
    updatePieChart() {
      const selected = this.chart.getOption().legend[0].selected;
      this.chart.setOption({
        series: [{
          id: 'pie',
          label: {
            formatter: params => `{b|${params.name}}\n{hr|}\n{value|${params.value}万斤}`
          },
          encode: { value: this.currentDimension, tooltip: this.currentDimension },
          data: this.getFilteredPieData(selected),
          itemStyle: { opacity: 1 } // 明确设置透明度
        }]
      });
    }

    // 获取饼图数据
    getFilteredPieData(selected) {
      return this.datasetSource
        .slice(1)
        .filter(row => selected[row[0]])
        .map(row => ({
          name: row[0],
          value: row[this.currentDimension],
          itemStyle: { opacity: 1 } // 数据项透明度
        }));
    }
  }

  // 初始化
  document.addEventListener('DOMContentLoaded', () => {
    new TeaComboChart('.teaChart');
  });
})();