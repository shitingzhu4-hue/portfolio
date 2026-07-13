// teaChart_ned_bar_line.js
(function() {
    class TeaNedBarLineChart {
      constructor(selector) {
        this.container = document.querySelector(selector);
        if (!this.container) {
          console.error(`容器 "${selector}" 未找到`);
          return;
        }
  
        // 在构造函数中计算其他商品货值
        this.chartData = this.getChartData();
        
        this.chart = echarts.init(this.container);
        this.initChart();
        this.bindEvents();
      }
  
      // 基础数据（作为方法返回）
      getChartData() {
        const years = [1730, 1736, 1740, 1750, 1760, 1766, 1770, 1780, 1790, 1793];
        const total = [234932, 365036, 1075001, 1366760, 1803274, 2584402, 2405232, 2471829, 683971, 2714789];
        const tea = [203603, 201584, 590328, 960403, 1614841, 2087036, 1777256, 1738936, 367316, 2150192];
        const ratio = [86.7, 55.3, 54.9, 70.3, 89.6, 80.8, 73.9, 70.4, 53.7, 79.2];
        
        // 计算其他商品货值
        const other = total.map((t, i) => t - tea[i]);
        
        return { years, total, tea, ratio, other };
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
            trigger: 'axis',
            backgroundColor: '#FFF5E6', // 米白色背景
            borderColor: '#8B4513',
            borderWidth: 2,
            textStyle: { color: '#5A3E36' },
            formatter: this.tooltipFormatter.bind(this)  // 绑定格式化函数
          };
      }
  
      // 工具箱配置
      get toolboxConfig() {
        return {
          top: '10%',
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true, title: '保存图表' }
          }
        };
      }
  
      // 图例配置
      get legendConfig() {
        return {
          data: ['中荷茶叶货值', '中荷其他货值', '中荷比重'],  // 修改图例名称
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
  
      // 在chartSeries中修改为堆叠柱状图，并隐藏"中荷其他货值"柱子
      get chartSeries() {
        return [
          // 其他货值堆叠部分（隐藏显示）
          {
            name: '中荷其他货值',
            type: 'bar',
            stack: 'total',  // 相同堆叠分组
            data: this.chartData.other,
            itemStyle: { 
              color: '#8B4513', // 茶褐色（其他商品）
              borderRadius: [0,0,0,0] // 底部不需要圆角
            },
            barWidth: '25%',
            show: false  // 新增：隐藏该柱状图系列
          },
          // 茶叶货值堆叠部分（放在顶部）
          {
            name: '中荷茶叶货值',
            type: 'bar',
            stack: 'total',  // 堆叠分组名称
            data: this.chartData.tea,
            itemStyle: { 
              color: '#6B8E23', // 茶叶绿色
              borderRadius: [5,5,0,0] // 只有顶部有圆角
            },
            barWidth: '25%',
            label: {
              show: true,
              position: 'top',  // 标签显示在柱子顶部
              distance: 10, // 标签与柱子间距
              formatter: ({ value }) => {
                const formatted = (value / 10000).toFixed(1);
                return `${formatted}万`; // 显示带1位小数的万单位
              },
              color: '#5A3E36',  // 深棕色文字
              fontSize: 12,
              fontWeight: 'bold',
              backgroundColor: '#FFF5E6', // 米黄色背景
              borderColor: '#8B4513', // 茶褐色边框
              borderWidth: 1,
              borderRadius: 4,
              padding: [2, 4] // 文字内边距
            }
          },
          // 比重折线图保持不变
          {
            name: '中荷比重',
            type: 'line',
            yAxisIndex: 1,
            data: this.chartData.ratio,
            symbol: 'circle', // 使用简单圆形代替图片
            symbolSize: 10,
            lineStyle: { 
              width: 3, 
              color: '#D2691E', // 红茶色
              type: 'dotted' // 虚线增强文艺感
            },
            itemStyle: { 
              color: 'transparent', // 透明色
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
  
      // 提示框格式化（适配堆叠结构）
      tooltipFormatter(params) {
        // 确保所有系列数据都可用
        const teaSeries = params.find(p => p.seriesName === '中荷茶叶货值');
        const otherSeries = params.find(p => p.seriesName === '中荷其他货值');
        const ratioSeries = params.find(p => p.seriesName === '中荷比重');
        
        // 获取各系列值
        const year = teaSeries.name;
        const teaValue = teaSeries.value;
        const otherValue = otherSeries ? otherSeries.value : 0;
        const totalValue = teaValue + otherValue;
        const ratioValue = ratioSeries ? ratioSeries.value : 0;
        
        // 构建提示内容
        return `
          <div style="font-weight:bold;margin-bottom:5px;">${year}年贸易数据</div>
          <div>${teaSeries.marker} 茶叶货值: ${teaValue.toLocaleString()}荷盾</div>
          <div>${otherSeries ? otherSeries.marker : ''} 其他货值: ${otherValue.toLocaleString()}荷盾</div>
          <div style="border-top:1px dashed #ccc;margin:5px 0;padding-top:5px;">
            <span style="font-weight:bold;">↳ 总货值: ${totalValue.toLocaleString()}荷盾</span>
          </div>
          <div>${ratioSeries.marker} 茶叶占比: ${ratioValue}%</div>
        `;
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