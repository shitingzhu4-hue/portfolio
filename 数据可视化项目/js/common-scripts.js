// common-scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // 加载公共元素
    loadCommonElements();
    
    // 页面跳转逻辑
    const pages = ['tea-poetry.html', 'tea-history.html', 'tea-arts.html', 'tea-regions.html', 'tea-export.html'];
    let currentPageIndex = 0;
    
    // 根据当前页面URL设置当前页面索引
    const currentPage = window.location.pathname.split('/').pop();
    currentPageIndex = pages.indexOf(currentPage) !== -1 ? pages.indexOf(currentPage) : 0;
    
    // 下一页按钮点击事件
    document.getElementById('nextPageBtn').addEventListener('click', function() {
        if (currentPageIndex < pages.length - 1) {
            currentPageIndex++;
            window.location.href = pages[currentPageIndex];
        } else {
            // 如果已经在最后一页，可以循环回到第一页
            window.location.href = pages[0];
        }
    });
    
    // 返回按钮点击事件
    document.getElementById('backButton').addEventListener('click', function() {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            window.location.href = pages[currentPageIndex];
        } else {
            // 如果已经在第一页，可以循环到最后一页
            window.location.href = pages[pages.length - 1];
        }
    });
    
    // 背景音乐
    const backgroundMusic = new Audio('av/中央民族乐团 - 渔舟唱晚.mp3'); // 修改为你的音乐路径
    backgroundMusic.loop = true;
    let isPlaying = false;
    
    // 音乐控制
    document.getElementById('musicControl').addEventListener('click', function() {
        if (isPlaying) {
            backgroundMusic.pause();
            this.style.backgroundColor = 'rgba(78, 156, 144, 0.7)';
            this.innerHTML = '<div class="control-icon music-icon">🎵</div>';
            isPlaying = false;
        } else {
            backgroundMusic.play();
            this.style.backgroundColor = 'rgba(78, 156, 144, 1)';
            this.innerHTML = '<div class="control-icon music-icon">🔊</div>';
            isPlaying = true;
        }
    });
    
    // 默认暂停音乐
    backgroundMusic.pause();
    
    // 问号按钮点击事件
    document.getElementById('helpButton').addEventListener('click', function() {
        const helpInfo = document.getElementById('helpInfo');
        if (helpInfo.style.display === 'block') {
            helpInfo.style.display = 'none';
        } else {
            helpInfo.style.display = 'block';
        }
    });
    
    // 显示/隐藏侧边导航栏
    document.querySelector('.side-nav-show').addEventListener('mouseover', function() {
        document.querySelector('.side-nav').style.left = '0';
    });
    
    document.querySelector('.side-nav').addEventListener('mouseleave', function() {
        this.style.left = '-120px';
    });
});

// 加载公共元素
function loadCommonElements() {
    const commonElementsDiv = document.createElement('div');
    commonElementsDiv.id = 'commonElements';
    document.body.insertBefore(commonElementsDiv, document.body.firstChild);
    
    fetch('common-elements.html')
        .then(response => response.text())
        .then(html => {
            commonElementsDiv.innerHTML = html;
        })
        .catch(error => {
            console.error('加载公共元素时出错:', error);
        });
}