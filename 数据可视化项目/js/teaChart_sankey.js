var dom = document.getElementById('container');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var app = {};
    
    var option;

    option = {
  backgroundColor: 'rgba(0,0,0,0)',
  title: {
    text: '历代茶类与冲泡方式关系',
    left: 'center',
    textStyle: { color: '#7CB342' },
    top:15,
    fontSize:50
  },
  series: [{
    type: 'sankey',
    layout: 'none',
    emphasis: { focus: 'adjacency' },
    top:150,
    bottom:100,
    nodeWidth: 5,    // 缩小节点宽度
    nodeGap:93,// 缩小节点间距
    nodeAlign: 'justify',
    draggable: false,
    // 手动控制节点位置（关键！）
    data: [
      // ----------- 第一层：朝代 -----------
      { name: '唐', itemStyle: { color: '#db8e5a' }, depth: 0},
      { name: '明', itemStyle: { color: '#5D4037' }, depth: 0},
      { name: '清', itemStyle: { color: '#a94927' }, depth: 0},
      
      // ----------- 第二层：茶类 -----------
    
      { name: '绿茶', depth: 1, itemStyle: { color: '#7d9d41' },tooltip: '绿茶：不发酵茶，代表有龙井、碧螺春、松萝茶、信阳毛尖、庐山云雾、阳羡茶、黄山毛峰、太平猴魁、恩施玉露、滇青' },  
      { name: '白茶', depth: 1, itemStyle: { color: '#ffe5d9' },tooltip: '白茶：微发酵茶，代表有白毫银针、白牡丹、寿眉 、云南白茶' },
      { name: '黄茶', depth: 1, itemStyle: { color: '#f5e547' },tooltip: '黄茶：轻微发酵茶，代表有君山银针、蒙顶黄芽、霍山黄芽、北港毛尖、沩山毛尖'  },
      { name: '红茶', depth: 1, itemStyle: { color: '#cf4831' } ,tooltip: '红茶：全发酵茶，代表有正山小种、祁门红茶、滇红' }, 
      { name: '乌龙茶', depth: 1, itemStyle: { color: '#a68a6a' },tooltip: '乌龙茶：半发酵茶，代表有武夷岩茶（大红袍、水仙、肉桂）、铁观音、凤凰单丛、黄金桂、冻顶乌龙' },
      { name: '黑茶', depth: 1, itemStyle: { color: '#546E7A' },tooltip: '黑茶：后发酵茶，代表有普洱茶、安化黑茶' },
      { name: '花茶', depth: 1, itemStyle: { color: '#f7d193' },tooltip: '花茶：再加工茶，代表有茉莉花茶、桂花茶、玫瑰花茶、玉兰茶' },
      
      
      
      // ----------- 第三层：冲泡方式 -----------
      // 通过 y 坐标进一步错位
      { name: '窨制后直接冲泡', depth: 2, itemStyle: { color: '#FF5722' } },
      { name: '瀹饮法（直接冲泡）', depth: 2, itemStyle: { color: '#3F51B5' }},
      { name: '闷黄工艺后沸水冲泡', depth: 2, itemStyle: { color: '#CDDC39' }},
      { name: '煎茶法（烤饼碾末煮饮）', depth: 2, itemStyle: { color: '#009688' } },
      { name: '高温冲泡/煮饮', depth: 2, itemStyle: { color: '#9E9E9E' }},
      { name: '自然萎凋清饮/煮饮', depth: 2, itemStyle: { color: '#8D6E63' } },
      { name: '功夫茶泡法（多次冲泡）', depth: 2, itemStyle: { color: '#4DB6AC' } }
    ],
    links: [
      // 链接关系（value 全部设为 1，统一细线条）
      // 唐朝
      { source: '唐', target: '绿茶', value: 0.1 },
      { source: '绿茶', target: '煎茶法（烤饼碾末煮饮）', value: 0.1 },
      { source: '唐', target: '红茶', value: 0.1 },
      { source: '红茶', target: '煎茶法（烤饼碾末煮饮）', value: 0.1 },
      { source: '唐', target: '黑茶', value: 0.1 },
      { source: '黑茶', target: '自然萎凋清饮/煮饮', value: 0.1 },
      { source: '唐', target: '乌龙茶', value: 0.1 },
      { source: '乌龙茶', target: '高温冲泡/煮饮', value: 0.1 },
      { source: '唐', target: '黄茶', value: 0.1 },
      { source: '黄茶', target: '煎茶法（烤饼碾末煮饮）', value: 0.1 },
      { source: '唐', target: '白茶', value: 0.1 },
      { source: '白茶', target: '自然萎凋清饮/煮饮', value: 0.1 },
      { source: '唐', target: '花茶', value: 0.1 },
      { source: '花茶', target: '窨制后直接冲泡', value: 0.1},
      
      // 明朝
      { source: '明', target: '绿茶', value: 0.1 },
      { source: '绿茶', target: '瀹饮法（直接冲泡）', value:  0.1 },
      { source: '明', target: '白茶', value: 0.1 },
      { source: '白茶', target: '自然萎凋清饮/煮饮', value:  0.1 },
      { source: '明', target: '黑茶', value: 0.1 },
      { source: '黑茶', target: '自然萎凋清饮/煮饮', value:  0.1 },
      { source: '明', target: '乌龙茶', value: 0.1 },
      { source: '乌龙茶', target: '高温冲泡/煮饮', value: 0.1 },
      { source: '明', target: '黄茶', value: 0.1 },
      { source: '黄茶', target: '闷黄工艺后沸水冲泡', value: 0.1 },
      { source: '明', target: '花茶', value: 0.1 },
      { source: '花茶', target: '窨制后直接冲泡', value: 0.1},
      { source: '明', target: '红茶', value:  0.1},
      { source: '红茶', target: '高温冲泡/煮饮', value: 0.1 },
      
      // 清朝
      { source: '清', target: '乌龙茶', value:  0.1 },
      { source: '乌龙茶', target: '功夫茶泡法（多次冲泡）', value:  0.1 },
      { source: '清', target: '绿茶', value:  0.1 },
      { source: '绿茶', target: '煎茶法（烤饼碾末煮饮）', value:  0.1 },
      { source: '清', target: '红茶', value:  0.1 },
      { source: '红茶', target: '高温冲泡/煮饮', value:  0.1 },
      { source: '清', target: '黄茶', value:  0.1 },
      { source: '黄茶', target: '闷黄工艺后沸水冲泡', value:  0.1 },
      { source: '清', target: '白茶', value:  0.1 },
      { source: '白茶', target: '自然萎凋清饮/煮饮', value:  0.1 },
      { source: '清', target: '再加工茶类', value:  0.1},
      { source: '再加工茶类', target: '蒸压后掰碎煮饮/冲泡', value: 0.1}
    ],
    lineStyle: { 
      curveness: 0.3,
      color: 'source', // 继承源节点颜色
      opacity:0.8,    // 降低透明度
      width: 0.3     // 直接控制线条粗细（关键！）
    },
    label: { 
      color: '#333',
      fontSize: 14,   // 缩小标签字号
      position: 'right'
    }
  }],
  tooltip: { 
    trigger: 'item',
    formatter: function(params) {
      // 判断是否为连接线（通过是否存在 source 属性）
      if (params.data && params.data.source) {
        return params.data.source + ' > ' + params.data.target; // 格式化为“源 > 目标”
      }
      else if (params.data && params.data.tooltip) {
       return params.data.tooltip; // 优先使用节点自定义的 tooltip
      }
      else {
        return params.name; // 节点悬停时仍显示名称
       }
    }
  }
};

    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }

    window.addEventListener('resize', myChart.resize);