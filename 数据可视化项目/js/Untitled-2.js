// teaChart_sunburst.js
(function() {
    class TeaSunburstChart {
        constructor(selector) {
            this.container = document.querySelector(selector);
            if (!this.container) {
                console.error(`容器 "${selector}" 未找到`);
                return;
            }

            this.chart = echarts.init(this.container);
            this.colorPalette = [
                '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
                '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
            ];
            this.initChart();
            this.bindEvents();
        }
        // 元数据
        get metaData() {
            return {
                "陆羽": {籍贯: "竟陵（今湖北天门）", 身份: "文人", 史料出处: "（宋）欧阳修等：《新唐书》卷196"},
                "张又新": {籍贯: "深州陆泽（今河北深州）", 身份: "官僚", 史料出处: "（宋）欧阳修等：《新唐书》卷175"},
                "苏廙": {籍贯: "不详", 身份: "不详", 史料出处: "无"},
                "王敷": {籍贯: "不详", 身份: "官僚", 史料出处: "（唐）王敷：《茶酒论》"},
                "温庭筠": {籍贯: "太原祁县（今山西晋中）", 身份: "官僚", 史料出处: "（宋）欧阳修等：《新唐书》卷91"},
                "裴汶": {籍贯: "不详", 身份: "官僚", 史料出处: "（宋）谈钥：《嘉泰吴兴志》卷14"},
                "毛文锡": {籍贯: "高阳（今河北高阳县）", 身份: "官僚", 史料出处: "（清）吴任臣：《十国春秋》卷41"},
                "陶榖": {籍贯: "邠州新平（今陕西邠县）", 身份: "官僚", 史料出处: "（元）脱脱：《宋史》卷269"},
                "叶清臣": {籍贯: "长州（今江苏苏州）", 身份: "官僚", 史料出处: "（元）脱脱：《宋史》卷295"},
                "欧阳修": {籍贯: "吉州庐陵（今江西吉安县）", 身份: "官僚", 史料出处: "（元）脱脱：《宋史》卷319"},
                "蔡襄": {籍贯: "兴化仙游（今福建仙游县）", 身份: "官僚", 史料出处: "（元）脱脱：《宋史》卷320"},
                "宋子安": {籍贯: "建安（今福建建瓯）", 身份: "不详", 史料出处: "无"},
                "黄儒": {籍贯: "建安（今福建建瓯）", 身份: "官僚", 史料出处: "（清）纪昀等：《钦定四库全书总目》卷115"},
                "沈括": {籍贯: "钱塘（今浙江杭州）", 身份: "官僚", 史料出处: "（元）脱脱：《宋史》卷331"},
                "唐庚": {籍贯: "眉州丹稜（今四川丹棱县）", 身份: "官僚", 史料出处: "（元）脱脱：《宋史》卷443"},
                "赵佶": {籍贯: "汴京（今河南开封）", 身份: "皇帝", 史料出处: "（元）脱脱：《宋史》卷19-22"},
                "熊蕃": {籍贯: "建阳（今福建南平）", 身份: "官僚", 史料出处: "（元）脱脱：《宋史》卷445"},
                "丁谓": {籍贯: "苏州长洲（今江苏吴县）", 身份: "官僚", 史料出处: "（元）脱脱：《宋史》卷283"},
                "周绛": {籍贯: "常州溧阳（今江苏常州）", 身份: "官僚", 史料出处: "（清）毕沅：《续资治通鉴》卷56"},
                "刘异": {籍贯: "福建福州（今福建福州）", 身份: "官僚", 史料出处: "（宋）梁克家：《淳熙三山志》卷26"},
                "沈立": {籍贯: "历阳（今安徽和县）", 身份: "官僚", 史料出处: "（元）脱脱：《宋史》卷333"},
                "吕惠卿": {籍贯: "泉州晋江（今福建晋江县）", 身份: "官僚", 史料出处: "（元）脱脱：《宋史》卷471"},
                "王端礼": {籍贯: "吉水（今江西吉安）", 身份: "官僚", 史料出处: "（明）余之祯等纂修：《万历吉安府志》卷25"},
                "曾慥": {籍贯: "福建晋江（今福建泉州）", 身份: "官僚", 史料出处: "（宋）李心传：《建炎以来系年要录》卷3"},
                "魏了翁": {籍贯: "邛州蒲江（今四川成都）", 身份: "官僚", 史料出处: "（元）脱脱：《宋史》卷437"},
                "赵汝砺": {籍贯: "汴京（今河南开封）", 身份: "宗室", 史料出处: "（清）纪昀等：《钦定四库全书总目》卷115"},
                "审安老人": {籍贯: "不详", 身份: "不详", 史料出处: "无"},
                "蔡宗颜": {籍贯: "不详", 身份: "官僚", 史料出处: "（宋）陈振孙：《直斋书录解题》卷14"},
                "曾伉": {籍贯: "不详", 身份: "官僚", 史料出处: "（元）马端临：《文献通考》卷218"},
                "罗大经": {籍贯: "庐陵（今江西吉水）", 身份: "官僚", 史料出处: "（宋）罗大经：《鹤林玉露》甲编卷4"},
                "桑庄": {籍贯: "高邮（今江苏高邮）", 身份: "官僚", 史料出处: "（宋）陈耆卿：《嘉定赤城志》卷34"},
                "章炳文": {籍贯: "京兆（今陕西西安）", 身份: "不详", 史料出处: "（宋）陈振孙：《直斋书录解题》卷11"},
                "范逵": {籍贯: "不详", 身份: "不详", 史料出处: "无"},
                "谢宗": {籍贯: "不详", 身份: "不详", 史料出处: "无"},
            };
        }

        // 原始数据
        get rawData() {
            return [
                { dynasty: "唐", titles: "《茶经》、《顾渚山记》、《茶记》、《水品》", author: "陆羽" },
                { dynasty: "唐", titles: "《煎茶水记》", author: "张又新" },
                { dynasty: "唐", titles: "《十六汤品》", author: "苏廙" },
                { dynasty: "唐", titles: "《茶酒论》", author: "王敷" },
                { dynasty: "唐", titles: "《采茶录》", author: "温庭筠" },
                { dynasty: "唐", titles: "《茶述》", author: "裴汶" },
                { dynasty: "五代蜀", titles: "《茶谱》", author: "毛文锡" },
                { dynasty: "北宋", titles: "《茗荈录》", author: "陶榖" },
                { dynasty: "北宋", titles: "《述煮茶小品》", author: "叶清臣" },
                { dynasty: "北宋", titles: "《大明水记》", author: "欧阳修" },
                { dynasty: "北宋", titles: "《茶录》", author: "蔡襄" },
                { dynasty: "北宋", titles: "《东溪试茶录》", author: "宋子安" },
                { dynasty: "北宋", titles: "《品茶要录》", author: "黄儒" },
                { dynasty: "北宋", titles: "《本朝茶法》、《茶论》", author: "沈括" },
                { dynasty: "北宋", titles: "《斗茶记》", author: "唐庚" },
                { dynasty: "北宋", titles: "《大观茶论》", author: "赵佶" },
                { dynasty: "北宋", titles: "《宣和北苑贡茶录》", author: "熊蕃撰，熊克增补" },
                { dynasty: "北宋", titles: "《北苑茶录》", author: "丁谓" },
                { dynasty: "北宋", titles: "《补茶经》", author: "周绛" },
                { dynasty: "北宋", titles: "《北苑拾遗》", author: "刘异" },
                { dynasty: "北宋", titles: "《茶法易览》", author: "沈立" },
                { dynasty: "北宋", titles: "《建安茶记》", author: "吕惠卿" },
                { dynasty: "北宋", titles: "《茶谱》", author: "王端礼" },
                { dynasty: "南宋", titles: "《茶录》", author: "曾慥" },
                { dynasty: "南宋", titles: "《邛州先茶记》", author: "魏了翁" },
                { dynasty: "南宋", titles: "《北苑别录》", author: "赵汝砺" },
                { dynasty: "南宋", titles: "《茶具图赞》", author: "审安老人" },
                { dynasty: "南宋", titles: "《茶山节对》、《茶谱遗事》", author: "蔡宗颜" },
                { dynasty: "南宋", titles: "《茶苑总录》", author: "曾伉" },
                { dynasty: "南宋", titles: "《建茶论》", author: "罗大经" },
                { dynasty: "南宋", titles: "《北苑煎茶法》", author: "不著撰人" },
                { dynasty: "南宋", titles: "《茶法总例》", author: "不著撰人" },
                { dynasty: "南宋", titles: "《茶杂文》", author: "不著撰人" },
                { dynasty: "南宋", titles: "《北苑修贡录》", author: "不著撰人" },
                { dynasty: "南宋", titles: "《茹芝续茶谱》", author: "桑庄" },
                { dynasty: "南宋", titles: "《茶苑杂录》", author: "不著撰人" },
                { dynasty: "南宋", titles: "《壑源茶录》", author: "章炳文" },
                { dynasty: "成书时间不详", titles: "《龙焙美成茶录》", author: "范逵" },
                { dynasty: "成书时间不详", titles: "《论茶》", author: "谢宗" },
                { dynasty: "成书时间不详", titles: "《北苑杂述》", author: "佚名" },
            ];
        }

        processExcelData() {
            let currentDynasty = "唐";
            return this.rawData.map(row => {
                // 修正1：增强朝代继承逻辑
                if (row.dynasty && row.dynasty.trim() !== "") {
                    currentDynasty = row.dynasty.replace(/[\n]/g, "");
                }
                
                // 修正2：正确处理合著情况
                const rawAuthor = (row.author || "佚名").trim();
                const authors = rawAuthor
                    .split(/[，、撰]/) // 支持多种分隔符
                    .map(a => a.replace(/增补|注|编|等/g, "").trim()) // 清除修饰词
                    .filter(a => a);
    
                return {
                    dynasty: currentDynasty,
                    titles: row.titles,
                    author: authors[0] || "佚名", // 取第一位作者
                    meta: this.metaData[rawAuthor] || {} // 保留原始作者名查询
                };
            });
        }

        transformData() {
            const root = { name: "唐宋茶书", children: [] };
            const data = this.processExcelData();

            data.forEach(row => {
                const titles = row.titles.split(/[、\n]/g)
                    .map(t => t.trim().replace(/[《》]/g, ""))
                    .filter(t => t && t !== "》" && t !== "《");
        
                titles.forEach(title => {
                    // 第一层：朝代
                    let dynastyNode = root.children.find(n => n.name === row.dynasty);
                    if (!dynastyNode) {
                        dynastyNode = { name: row.dynasty, value: 0, children: [] };
                        root.children.push(dynastyNode);
                    }
        
                    // 第二层：诗人（原作者层）
                    let poetNode = dynastyNode.children.find(n => n.name === row.author);
                    if (!poetNode) {
                        poetNode = { 
                            name: row.author, 
                            value: 0, 
                            children: [],
                            meta: row.meta
                        };
                        dynastyNode.children.push(poetNode);
                    }
        
                    // 第三层：书籍
                    if (!poetNode.children.some(b => b.name === title)) {
                        poetNode.children.push({ name: title, value: 1 });
                    }
                });
            });

            const propagateValue = (node) => {
                if (!node.children) return node.value || 0;
                node.value = node.children.reduce((sum, child) => sum + propagateValue(child), 0);
                return node.value;
            };

            propagateValue(root);
            return root;
        }

        get baseOption() {
            return {
                color: this.colorPalette,
                animationDuration: 2000,
                animationEasing: 'elasticOut',
                series: [{
                    type: 'sunburst',
                    data: [this.transformData()],
                    radius: ['10%', '98%'],
                    nodeClick: false,
                    sort: null,
                    label: {
                        rotate: 'radial',
                        fontSize: 12,
                        formatter: ({ name }) => {
                            const maxLen = this.chart.getWidth() < 768 ? 4 : 6;
                            return name.length > maxLen ? name.substr(0,maxLen)+'...' : name;
                        },
                        color: '#333',
                        textBorderColor: 'rgba(255,255,255,0.8)',
                        textBorderWidth: 2
                    },
                    itemStyle: {
                        borderWidth: 1,
                        borderColor: '#fff',
                        borderRadius: [0, 8, 12, 4] // 不同层级不同圆角
                    },
                    levels: [
                        { // 中心标题层
                            r0: '0%',
                            r: '15%',
                            label: { show: false }
                        },
                        { // 朝代层
                            r0: '15%',
                            r: '30%',
                            itemStyle: { color: '#4A6B3F' },
                            label: { fontSize: 14 }
                        },
                        { // 诗人层（原作者层）
                            r0: '30%',
                            r: '50%',
                            itemStyle: { color: '#8A9B6E' },
                            label: { 
                                position: 'inside',
                                formatter: ({ name }) => {
                                    const maxLen = this.chart.getWidth() < 768 ? 4 : 5;
                                    return name.length > maxLen ? name.substr(0,maxLen)+'..' : name;
                                }
                            }
                        },
                        { // 书籍层
                            r0: '50%',
                            r: '98%',
                            itemStyle: { color: '#B7B8A6' },
                            label: {
                                position: 'inside',
                                fontSize: 11,
                                formatter: ({ name }) => {
                                    const maxLen = this.chart.getWidth() < 768 ? 6 : 8;
                                    return name.length > maxLen ? name.substr(0,maxLen)+'...' : name;
                                }
                            }
                        }
                    ]
                    // emphasis: {
                    //     focus: 'ancestor',
                    //     itemStyle: {
                    //         shadowBlur: 20,
                    //         shadowColor: 'rgba(0,0,0,0.3)',
                    //         scale: 1.05 // 悬停放大效果
                    //     },
                    //     label: {
                    //         show: true,
                    //         fontWeight: 'bold',
                    //         color: '#2d5c7f'
                    //     }
                    // }
                }]
            };
        }
        
        initTooltip() {
            this.chart.on('mouseover', params => {
                if (params.data?.meta) {
                    const meta = params.data.meta;
                    const tooltip = document.createElement('div');
                    tooltip.className = 'enhanced-tooltip';
                    tooltip.innerHTML = `
                        <div class="tooltip-header">${params.name}</div>
                        ${meta.籍贯 ? `<div>籍贯：${meta.籍贯}</div>` : ''}
                        ${meta.身份 ? `<div>身份：${meta.身份}</div>` : ''}
                        ${meta.史料出处 ? `<div>史料出处：${meta.史料出处}</div>` : ''}
                    `;
                    
                    document.body.appendChild(tooltip);
                    const { clientX, clientY } = params.event;
                    tooltip.style.left = `${clientX + 15}px`;
                    tooltip.style.top = `${clientY - tooltip.offsetHeight/2}px`;
                }
            });

            this.chart.on('mouseout', () => {
                document.querySelectorAll('.enhanced-tooltip').forEach(t => t.remove());
            });
        }

        initChart() {
            this.chart.setOption(this.baseOption);
            this.initTooltip();
            
            // 初始展开动画
            setTimeout(() => {
                this.chart.dispatchAction({
                    type: 'sunburstExpandNode',
                    targetNodeId: '0_0'
                });
            }, 500);
        }

        bindEvents() {
            window.addEventListener('resize', () => this.chart.resize());
        }

        dispose() {
            this.chart.dispose();
            window.removeEventListener('resize', () => this.chart.resize());
        }
    }

    // 添加工具提示样式
    const style = document.createElement('style');
    style.textContent = `
        .enhanced-tooltip {
            position: fixed;
            background: rgba(255,255,255,0.95);
            border: 1px solid #ddd;
            padding: 12px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            min-width: 200px;
            z-index: 1000;
            font-size: 14px;
            line-height: 1.6;
            pointer-events: none;
        }
        .tooltip-header {
            font-weight: bold;
            margin-bottom: 8px;
            color: #2d5c7f;
            border-bottom: 1px solid #eee;
            padding-bottom: 4px;
        }
    `;
    document.head.appendChild(style);

    // 自动初始化
    document.addEventListener('DOMContentLoaded', () => {
        new TeaSunburstChart('.teaChart');
    });
})();