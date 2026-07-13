// teaChart_advanced.js
(function() {
    class TeaAdvancedChart {
        constructor(selector) {
            this.container = document.querySelector(selector);
            this.chart = echarts.init(this.container);
            this.initChart();
            this.bindEvents();
        }

        // 茶文化配色方案
        get teaColors() {
            return {
                china: '#8B4513',       // 茶汤色
                britain: '#3C2F1E',     // 茶叶色
                accent: '#769164',      // 茶具青瓷色
                bg: '#FFF9F0'           // 茶席米白色
            };
        }

        // 整合后的历史数据
        get chartData() {
            return {
                years: [1730, 1740, 1750, 1760, 1770, 1780, 1790, 1888, 1890, 1892, 1894, 1896],
                china: [null, null, null, null, null, null, null, 108400000, 81504000, 54600000, 49300000, 37100000],
                britain: [469879, 186214, 507102, 707000, 1413816, 2026043, 4669811, 78720000, 91320000, 100800000, 104000000, 107300000],
                ratio: [73, 71, 72, 92, 94, 55, 88, null, null, null, null, null]
            };
        }

        get baseOption() {
            return {
                title: {
                    text: '中英茶叶贸易历史趋势',
                    left: 'center',
                    textStyle: {
                        color: this.teaColors.britain,
                        fontSize: 20,
                        fontFamily: 'SimSun'
                    }
                },
                tooltip: this.tooltipConfig,
                legend: {
                    data: ['中国出口量', '英国进口量', '贸易占比'],
                    top: 35,
                    textStyle: { color: this.teaColors.britain }
                },
                grid: {
                    left: '12%',
                    right: '10%',
                    containLabel: true,
                    backgroundColor: this.teaColors.bg
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.chartData.years,
                    axisLine: { lineStyle: { color: this.teaColors.britain } },
                    axisLabel: {
                        rotate: 45,
                        color: this.teaColors.britain
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '贸易量（万两/斤）',
                    axisLine: { lineStyle: { color: this.teaColors.britain } },
                    axisLabel: {
                        formatter: value => `${(value/10000).toFixed(0)}万`,
                        color: this.teaColors.britain
                    },
                    splitLine: { lineStyle: { type: 'dashed' } }
                },
                series: [
                    {
                        name: '中国出口量',
                        type: 'line',
                        smooth: true,
                        symbol: 'image://image/tea_icon.png',  // 茶叶图标
                        symbolSize: 20,
                        data: this.chartData.china,
                        lineStyle: {
                            color: this.teaColors.china,
                            width: 3
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0, color: '#F4E7D6'
                            }, {
                                offset: 1, color: '#FFF9F0'
                            }])
                        }
                    },
                    {
                        name: '英国进口量',
                        type: 'bar',
                        barWidth: '30%',
                        data: this.chartData.britain,
                        itemStyle: {
                            color: this.teaColors.britain,
                            borderRadius: [5, 5, 0, 0]
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: this.teaColors.accent
                            }
                        }
                    },
                    {
                        name: '贸易占比',
                        type: 'line',
                        smooth: true,
                        data: this.chartData.ratio,
                        symbol: 'circle',
                        symbolSize: 10,
                        lineStyle: {
                            color: this.teaColors.accent,
                            width: 2,
                            type: 'dotted'
                        },
                        itemStyle: {
                            color: this.teaColors.accent,
                            borderWidth: 2
                        }
                    }
                ],
                graphic: [{
                    type: 'image',
                    style: {
                        image: 'image/tea_pattern.png',  // 茶纹背景
                        width: 200,
                        height: 200,
                        opacity: 0.1
                    },
                    left: 'center',
                    top: 'middle'
                }]
            };
        }

        // 茶文化特色提示框
        get tooltipConfig() {
            return {
                trigger: 'axis',
                backgroundColor: this.teaColors.bg,
                borderColor: this.teaColors.accent,
                formatter: params => {
                    let china = params.find(p => p.seriesName === '中国出口量');
                    let britain = params.find(p => p.seriesName === '英国进口量');
                    let ratio = params.find(p => p.seriesName === '贸易占比');
                    
                    return `<div style="border-left:4px solid ${this.teaColors.china};padding-left:8px">
                            ${china ? `中国出口：${china.value ? china.value.toLocaleString()+'斤' : '无数据'}<br>` : ''}
                            ${britain ? `英国进口：${britain.value.toLocaleString()}两<br>` : ''}
                            ${ratio ? `占比：${ratio.value}%` : ''}
                            </div>`;
                }
            };
        }

        initChart() {
            this.chart.setOption(this.baseOption);
        }

        bindEvents() {
            window.addEventListener('resize', () => this.chart.resize());
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        new TeaAdvancedChart('.teaChart');
    });
})();