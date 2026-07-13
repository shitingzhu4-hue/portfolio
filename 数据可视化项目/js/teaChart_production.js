// historicalTeaProductionChart.js
(function() {
    class HistoricalTeaProductionChart {
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
  
      // 历史数据获取
      getHistoricalData() {
        return [
          {
            name: '唐代',
            itemStyle: { color: '#da0d68' },
            children: [
                {
                  name: '盛唐（713-766年）',
                  itemStyle: { color: '#975e6d' },
                  children: [{
                    name: '143.23斤/亩（鲜叶）',
                    value: 143.23,
                    itemStyle: { color: '#f99e1c' },
                    desc: '《四时纂要》记载三年生茶树鲜叶产量，反映唐代早期茶园管理技术'
                  }]
                },
                {
                  name: '中唐（766-835年）',
                  itemStyle: { color: '#e0719c' },
                  children: [{
                    name: '1200万斤',
                    value: 12000000,
                    itemStyle: { color: '#ef5a78' },
                    desc: '蒙顶茶带动生产，形成“新安草市”，文献记载“岁出千万斤”'
                  }]
                },
                {
                  name: '贞元九年（793年）',
                  itemStyle: { color: '#f7f1bd' },
                  children: [{
                    name: '9600万斤',
                    value: 96000000,
                    itemStyle: { color: '#3e0317' },
                    desc: '茶税政策实施（税率10%），刺激商品茶生产'
                  }]
                }
                // 其他唐代时期数据可继续添加...
              ]
            },
            {
              name: '明代',
              itemStyle: { color: '#da1d23' },
              children: [
                {
                  name: '明代前期',
                  itemStyle: { color: '#dd4c51' },
                  children: [{
                    name: '9040万斤',
                    value: 90405116.8,
                    itemStyle: { color: '#e62969' },
                    desc: '严格茶法制度，茶马贸易需求推动'
                  }]
                },
                {
                  name: '明代中期',
                  itemStyle: { color: '#c94a44' },
                  children: [{
                    name: '9476万斤',
                    value: 94758257,
                    itemStyle: { color: '#a5446f' },
                    desc: '茶税政策调整，茶户数量增加'
                  }]
                },
                {
                  name: '明代晚期',
                  itemStyle: { color: '#dd4c51' },
                  children: [{
                    name: '9477万斤',
                    value: 94776209.6,
                    itemStyle: { color: '#f2684b' },
                    desc: '茶法松弛导致私茶泛滥，推测末期产量或突破1亿斤'
                  }]
                }
              ]
            },
            {
              name: '清代',
              itemStyle: { color: '#187a2f' },
              children: [
                {
                  name: '1649-1653年',
                  itemStyle: { color: '#a2b029' },
                  children: [{
                    name: '58万斤（年均）',
                    value: 580550.78,
                    itemStyle: { color: '#62aa3c' },
                    desc: '含官茶、贡茶、商茶，茶马贸易初期'
                  }]
                },
                {
                  name: '1661年',
                  itemStyle: { color: '#3aa255' },
                  children: [{
                    name: '1898万斤',
                    value: 18981346.92,
                    itemStyle: { color: '#03a653' },
                    desc: '产量突增，接近1900万斤'
                  }]
                },
                {
                  name: '1723-1725年',
                  itemStyle: { color: '#5e9a80' },
                  children: [{
                    name: '5918万斤',
                    value: 59177603.55,
                    itemStyle: { color: '#038549' },
                    desc: '茶引数激增，产量达历史高峰'
                  }]
                }
                // 其他清代时期数据可继续添加...
              ]
            }
          ];          
      }
  
      // 核心配置项
      get baseOption() {
        return {
          tooltip: {
            formatter: params => {
              const value = params.value || 0;
              const desc = params.data.desc || '';
              return `${params.name}<br/>产量: ${value.toLocaleString()}斤<br/>${desc}`;
            }
          },
          series: {
            type: 'sunburst',
            data: this.processData(),
            radius: [0, '95%'],
            label: {
              formatter: params => {
                if (params.treePathInfo.length === 3) {
                  const shortDesc = params.data.desc?.substring(0,6) + '...' || '';
                  return `${params.name}\n${shortDesc}`;
                }
                return params.name;
              },
              rich: {
                a: { fontSize: 14, lineHeight: 20 },
                b: { fontSize: 12, color: '#666' }
              }
            },
            levels: [
              {}, 
              {
                r0: '35%',
                r: '70%',
                label: {
                  align: 'right',
                  fontSize: 12,
                  lineHeight: 16
                }
              },
              {
                r0: '70%',
                r: '72%',
                label: {
                  position: 'outside',
                  padding: 3,
                  fontSize: 11,
                  color: '#333',
                  lineHeight: 14
                },
                itemStyle: {
                  borderWidth: 3,
                  borderColor: '#fff'
                }
              }
            ]
          }
        };
      }
  
      // 数据处理
      processData() {
        return this.getHistoricalData();
      }
  
      // 初始化图表
      initChart() {
        this.chart.setOption(this.baseOption);
      }
  
      // 事件绑定
      bindEvents() {
        window.addEventListener('resize', () => this.chart.resize());
      }
  
      // 资源释放
      dispose() {
        this.chart.dispose();
        window.removeEventListener('resize', () => this.chart.resize());
      }
    }
  
    // 自动挂载
    document.addEventListener("DOMContentLoaded", () => {
      new HistoricalTeaProductionChart(".teaChart");
    });
  })();