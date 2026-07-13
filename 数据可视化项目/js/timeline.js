// teaTimeline.js
(function() {
    class TeaTimeline {
        constructor(selector) {
            this.container = d3.select(selector);
            if (this.container.empty()) {
                console.error(`容器 "${selector}" 未找到`);
                return;
            }

            // 配置参数
            this.config = {
                width: 1200,
                itemHeight: 120,
                timelinePadding: 40,
                colors: {
                    tang: "#d32f2f",
                    song: "#1976d2",
                    ming: "#fbc02d",
                    qing: "#388e3c",
                    other: "#666"
                }
            };

            this.teaData = this.processData(this.getOriginalData());
            this.initViz();
            this.addInteractions();
        }

        // 原始数据
        getOriginalData() {
            return [
                // 唐代著作
                { dynasty: "唐", title: "《茶经》", author: "陆羽", time: 760, status: "存", class: "tang" },
                { dynasty: "唐", title: "《煎茶水记》", author: "张又新", time: 825, status: "存", class: "tang" },
                { dynasty: "唐", title: "《十六汤品》", author: "苏廙", time: 900, status: "存", class: "tang" },
                { dynasty: "唐", title: "《茶酒论》", author: "王敷", time: 803, status: "存", class: "tang" },
                { dynasty: "唐", title: "《采茶录》", author: "温庭筠", time: 860, status: "辑佚", class: "tang" },
                { dynasty: "唐", title: "《顾渚山记》", author: "陆羽", time: 765, status: "佚", class: "tang" },
                { dynasty: "唐", title: "《茶记》", author: "陆羽", time: 760, status: "佚", class: "tang" },
                { dynasty: "唐", title: "《水品》", author: "陆羽", time: 0, status: "佚", class: "tang" }, // 时间不详
                { dynasty: "唐", title: "《茶述》", author: "裴汶", time: 812, status: "佚", class: "tang" },

                // 五代十国
                { dynasty: "五代蜀", title: "《茶谱》", author: "毛文锡", time: 935, status: "佚", class: "song" },

                // 北宋著作
                { dynasty: "北宋", title: "《茗荈录》", author: "陶榖", time: 966, status: "存", class: "song" },
                { dynasty: "北宋", title: "《述煮茶小品》", author: "叶清臣", time: 1040, status: "存", class: "song" },
                { dynasty: "北宋", title: "《大明水记》", author: "欧阳修", time: 1048, status: "存", class: "song" },
                { dynasty: "北宋", title: "《茶录》", author: "蔡襄", time: 1051, status: "存", class: "song" },
                { dynasty: "北宋", title: "《东溪试茶录》", author: "宋子安", time: 1064, status: "存", class: "song" },
                { dynasty: "北宋", title: "《品茶要录》", author: "黄儒", time: 1075, status: "存", class: "song" },
                { dynasty: "北宋", title: "《本朝茶法》", author: "沈括", time: 1091, status: "存", class: "song" },
                { dynasty: "北宋", title: "《斗茶记》", author: "唐庚", time: 1112, status: "存", class: "song" },
                { dynasty: "北宋", title: "《大观茶论》", author: "赵佶", time: 1107, status: "存", class: "song" },
                { dynasty: "北宋", title: "《宣和北苑贡茶录》", author: "熊蕃撰，熊克增补", time: 1123, status: "存", class: "song" },
                { dynasty: "北宋", title: "《北苑茶录》", author: "丁谓", time: 999, status: "佚", class: "song" },
                { dynasty: "北宋", title: "《补茶经》", author: "周绛", time: 1012, status: "佚", class: "song" },
                { dynasty: "北宋", title: "《北苑拾遗》", author: "刘异", time: 1041, status: "佚", class: "song" },
                { dynasty: "北宋", title: "《茶法易览》", author: "沈立", time: 1057, status: "佚", class: "song" },
                { dynasty: "北宋", title: "《建安茶记》", author: "吕惠卿", time: 1080, status: "佚", class: "song" },
                { dynasty: "北宋", title: "《茶谱》", author: "王端礼", time: 1100, status: "佚", class: "song" },
                { dynasty: "北宋", title: "《茶论》", author: "沈括", time: 1090, status: "佚", class: "song" },

                // 南宋著作
                { dynasty: "南宋", title: "《茶录》", author: "曾慥", time: 1136, status: "存", class: "song" },
                { dynasty: "南宋", title: "《北苑别录》", author: "佚名", time: 1145, status: "佚", class: "song" },
                { dynasty: "南宋", title: "《邛州先茶记》", author: "魏了翁", time: 1228, status: "存", class: "song" },
                { dynasty: "南宋", title: "《北苑别录》", author: "赵汝砺", time: 1186, status: "存", class: "song" },
                { dynasty: "南宋", title: "《茶具图赞》", author: "审安老人", time: 1269, status: "存", class: "song" },
                { dynasty: "南宋", title: "《茶山节对》", author: "蔡宗颜", time: 1140, status: "佚", class: "song" },
                { dynasty: "南宋", title: "《茶谱遗事》", author: "蔡宗颜", time: 1140, status: "佚", class: "song" },
                { dynasty: "南宋", title: "《茶苑总录》", author: "曾伉", time: 1140, status: "佚", class: "song" },
                { dynasty: "南宋", title: "《北苑煎茶法》", author: "佚名", time: 1140, status: "佚", class: "song" },
                { dynasty: "南宋", title: "《茶法总例》", author: "佚名", time: 1140, status: "佚", class: "song" },
                { dynasty: "南宋", title: "《茶杂文》", author: "佚名", time: 1140, status: "佚", class: "song" },
                { dynasty: "南宋", title: "《北苑修贡录》", author: "佚名", time: 1181, status: "佚", class: "song" },
                { dynasty: "南宋", title: "《茹芝续茶谱》", author: "桑庄", time: 1220, status: "佚", class: "song" },
                { dynasty: "南宋", title: "《茶苑杂录》", author: "佚名", time: 1270, status: "佚", class: "song" },
                { dynasty: "南宋", title: "《壑源茶录》", author: "章炳文", time: 1270, status: "佚", class: "song" },
                { dynasty: "南宋", title: "《建茶论》", author: "罗大经", time: 1270, status: "佚", class: "song" },

                // 时间不详条目
                { dynasty: "不详", title: "《龙焙美成茶录》", author: "范逵", time: 0, status: "佚", class: "other" },
                { dynasty: "不详", title: "《论茶》", author: "谢宗", time: 0, status: "佚", class: "other" },
                { dynasty: "不详", title: "《北苑杂述》", author: "佚名", time: 0, status: "佚", class: "other" },

                // 明代著作
                { dynasty: "明", title: "《茶谱》", author: "顾元庆", time: 1590, status: "存", class: "ming" },
                { dynasty: "明", title: "《本草纲目·茶》", author: "李时珍", time: 1578, status: "存", class: "ming" },
                { dynasty: "明", title: "《煮泉小品》", author: "田艺蘅", time: 1576, status: "存", class: "ming" },
                { dynasty: "明", title: "《茶寮记》", author: "陆树声", time: 1576, status: "存", class: "ming" },
                { dynasty: "明", title: "《茶疏》", author: "许次纾", time: 1590, status: "存", class: "ming" }, // 修正作者名
                { dynasty: "明", title: "《茶录》", author: "冯时可", time: 1590, status: "存", class: "ming" },
                { dynasty: "明", title: "《茶笺》", author: "闻龙", time: 1590, status: "存", class: "ming" },
                { dynasty: "明", title: "《岕茶笺》", author: "冯可宾", time: 1590, status: "存", class: "ming" },
                { dynasty: "明", title: "《茶史补》", author: "余怀", time: 1640, status: "存", class: "ming" },

                // 清代著作
                { dynasty: "清", title: "《续茶经》", author: "陆廷灿", time: 1734, status: "存", class: "qing" }
            ];
        }

        // 数据预处理
        processData(data) {
            return data.sort((a,b) => {
                if(a.time === 0) return 1;
                if(b.time === 0) return -1;
                return a.time - b.time;
            });
        }

        // 初始化可视化
        initViz() {
            // 创建基础结构
            this.svg = this.container
                .append("svg")
                .attr("width", this.config.width)
                .attr("height", this.calculateHeight());

            // 绘制时间线
            this.drawTimeline();
            
            // 绘制数据节点
            this.drawNodes();
            
            // 绘制朝代标记
            this.drawDynastyMarkers();
        }

        // 计算总高度
        calculateHeight() {
            return this.teaData.length * this.config.itemHeight + 200;
        }

        // 绘制时间轴线
        drawTimeline() {
            this.svg.append("line")
                .attr("x1", this.config.width/2)
                .attr("y1", this.config.timelinePadding)
                .attr("x2", this.config.width/2)
                .attr("y2", this.teaData.length * this.config.itemHeight)
                .attr("stroke", "#8d6e63")
                .attr("stroke-width", 6);
        }

        // 绘制数据节点
        drawNodes() {
            const nodes = this.svg.selectAll(".node")
                .data(this.teaData)
                .enter()
                .append("g")
                .attr("class", d => `node ${d.class}`)
                .attr("transform", (d,i) => 
                    `translate(${i%2 === 0 ? 
                        this.config.width/2 - 350 : 
                        this.config.width/2 + 50}, 
                    ${i*this.config.itemHeight + this.config.timelinePadding})`);

            // 绘制卡片
            nodes.append("rect")
                .attr("width", 300)
                .attr("height", 100)
                .attr("rx", 6)
                .attr("fill", "#fff")
                .attr("stroke", d => this.config.colors[d.class] || "#666")
                .attr("stroke-width", 4);

            // 状态指示器
            nodes.append("circle")
                .attr("cx", 290)
                .attr("cy", 20)
                .attr("r", 6)
                .attr("fill", d => d.status === "存" ? "#4caf50" : "#f44336");

            // 文本内容
            nodes.append("foreignObject")
                .attr("width", 280)
                .attr("height", 90)
                .attr("x", 10)
                .attr("y", 10)
                .append("xhtml:div")
                .style("font-family", "'Segoe UI', Arial, sans-serif")
                .html(d => `
                    <h3 style="margin:0 0 8px">${d.title}</h3>
                    <p style="margin:4px 0">作者：${d.author}</p>
                    <p style="margin:4px 0">朝代：${d.dynasty}</p>
                    <p style="margin:4px 0">时间：${d.time === 0 ? '时间不详' : `约${d.time}年`}</p>
                `);

            // 时间连接线
            nodes.append("line")
                .attr("x1", i => i%2 === 0 ? 300 : -50)
                .attr("y1", 50)
                .attr("x2", i => i%2 === 0 ? 350 : -100)
                .attr("y2", 50)
                .attr("stroke", "#8d6e63")
                .attr("stroke-width", 2);
        }

        // 绘制朝代标记
        drawDynastyMarkers() {
            const dynasties = [
                {name: "唐", y: 0, color: this.config.colors.tang},
                {name: "宋", y: 800, color: this.config.colors.song},
                {name: "明", y: 1500, color: this.config.colors.ming},
                {name: "清", y: 1700, color: this.config.colors.qing}
            ];

            dynasties.forEach(d => {
                this.svg.append("rect")
                    .attr("x", 0)
                    .attr("y", d.y)
                    .attr("width", this.config.width)
                    .attr("height", 30)
                    .attr("fill", d.color)
                    .attr("opacity", 0.8);
                
                this.svg.append("text")
                    .attr("x", 20)
                    .attr("y", d.y + 20)
                    .attr("fill", "white")
                    .style("font-size", "16px")
                    .text(`${d.name}`);
            });
        }

        // 添加交互功能
        addInteractions() {
            // 缩放功能
            const zoom = d3.zoom()
                .scaleExtent([0.5, 5])
                .on("zoom", (event) => {
                    this.svg.attr("transform", event.transform);
                });

            this.svg.call(zoom);

            // 工具提示
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("background", "white")
                .style("padding", "10px")
                .style("border-radius", "4px")
                .style("box-shadow", "0 2px 8px rgba(0,0,0,0.1)");

            this.svg.selectAll(".node")
                .on("mouseover", (event, d) => {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip.html(`
                        <h3>${d.title}</h3>
                        <p>作者：${d.author}</p>
                        <p>创作年代：${d.time === 0 ? '时间不详' : `${d.time}年`}</p>
                        <p>保存状态：${d.status}</p>
                    `)
                    .style("left", `${event.pageX + 15}px`)
                    .style("top", `${event.pageY - 28}px`);
                })
                .on("mouseout", () => {
                    tooltip.transition().duration(500).style("opacity", 0);
                });
        }

        // 更新数据
        updateData(newData) {
            this.teaData = this.processData(newData);
            this.svg.remove();
            this.initViz();
            this.addInteractions();
        }

        // 筛选功能
        filterData(condition) {
            const filteredData = this.teaData.filter(condition);
            this.updateData(filteredData);
        }

        // 导出为PNG
        exportPNG() {
            const serializer = new XMLSerializer();
            const source = serializer.serializeToString(this.svg.node());
            const image = new Image();
            image.src = "data:image/svg+xml;base64," + btoa(source);
            
            const canvas = document.createElement("canvas");
            canvas.width = this.config.width;
            canvas.height = this.calculateHeight();
            const ctx = canvas.getContext("2d");
            
            image.onload = () => {
                ctx.drawImage(image, 0, 0);
                const link = document.createElement("a");
                link.download = "tea-timeline.png";
                link.href = canvas.toDataURL();
                link.click();
            };
        }
    }

    // 自动初始化
    document.addEventListener('DOMContentLoaded', () => {
        const timeline = new TeaTimeline('.timeline');
        
        // 暴露公共方法
        window.teaTimeline = {
            filter: (condition) => timeline.filterData(condition),
            export: () => timeline.exportPNG(),
            update: (data) => timeline.updateData(data)
        };
    });
})();