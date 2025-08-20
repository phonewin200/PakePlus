function execute() {
    document.title = "课本点读-点读通";

    // 隐藏 .nav-item
    var navItem = document.querySelector('.nav-item');
    if (navItem) {
        navItem.style.display = 'none';
    }

    // 隐藏 .copyright
    var copyright = document.querySelector('.copyright');
    if (copyright) {
        copyright.style.display = 'none';
    }

    //修改hotspot-box样式
    const boxs = document.querySelectorAll('.hotspot-box');
    boxs.forEach(box => {
        box.style.border = '0px';
        box.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    });

    //修改hotspot-box-hover样式
    // 动态添加 CSS 类定义
    const style = document.createElement('style');
    style.innerHTML = `
    .hotspot-box-hover {
    	border:1px solid !important;
        background-color: rgba(0, 255, 0, 0.2) !important;
        border-color: rgba(0, 255, 0, 0.4) !important;
        box-shadow : 0 0 10px rgba(0, 255, 0, 0.5) !important;
    }
    .hotspot-box-hover {
    	border:1px solid !important;
        background-color: rgba(0, 0, 0, 0) !important;
        border-color: rgba(0, 255, 0, 0.4) !important;
        box-shadow : 0 0 10px rgba(0, 255, 0, 0.5) !important;
    }
    `;
    document.head.appendChild(style);

    // 绑定事件
    document.querySelectorAll('.hotspot-box').forEach(box => {
        box.addEventListener('mouseenter', () => {
            box.classList.add('hotspot-box-hover');
        });
        box.addEventListener('mouseleave', () => {
            box.classList.remove('hotspot-box-hover');
        });
    });

    //将'完全免费使用'改为'课本同步使用'
    document.querySelectorAll('div.book-publisher').forEach(function(div) {
        if (div.textContent.trim() === '完全免费使用') {
            div.textContent = '课本同步使用';
        }
    });

}

function doInterval() {
    let time = 1;
    const intervalId = setInterval(() => {
        execute();
        time++;

        // 当执行次数超过500次（约5秒，因为每10ms执行一次）
        if (time > 500) {
            clearInterval(intervalId);
            console.log("定时器已清除，共执行了", time, "次");
        }
    }, 10);

}

doInterval();


//检测窗口变化
window.addEventListener('resize', () => {
    doInterval()
});


// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    mySet();
});

function mySet() {
    const target = document.getElementById('directoryOverlay');
    if (!target) {
        console.warn('未找到 id="directoryOverlay" 的元素');
        return;
    }

    // 读取 localStorage 中的翻译状态
    let name = '翻译隐藏';
    const translation = localStorage.getItem('translation'); // 0: 隐藏, 1: 显示
    if (translation === '0') {
        name = '翻译显示';
    }

    // 插入设置面板
    target.insertAdjacentHTML('afterend', `
        <div class="directory-overlay" id="setOverlay" style="display: none;">
            <div class="directory-container">
                <div class="directory-title">设置</div>
                <ul class="directory-list">
                    <li class="directory-item" onclick="window.location.href='index.php'">到达首页</li>
                    <li class="directory-item" onclick="translationSet()">${name}</li>                       
                </ul>
            </div>
        </div>
    `);

    // ✅ 将函数挂载到 window 上，使其可在 HTML 中调用
    window.showSet = function() {
        document.getElementById('setOverlay').style.display = 'block';
    };

    window.hideSet = function() {
        document.getElementById('setOverlay').style.display = 'none';
    };

    window.translationSet = function() {
        const current = localStorage.getItem('translation');
        // 切换状态：0 → 1，1 → 0，null → 0
        const next = current === '0' ? '1' : '0';
        localStorage.setItem('translation', next);

        // 更新按钮文字
        const item = document.querySelector('#setOverlay .directory-item[onclick="translationSet()"]');
        item.textContent = next === '0' ? '翻译显示' : '翻译隐藏';

        hideSet(); // 关闭设置面板
    };

    // ✅ 修改 header 按钮点击事件
    const firstButton = document.querySelector('.header .header-btn');
    if (firstButton) {
        firstButton.innerHTML = '设置';
        firstButton.onclick = function(e) {
            e.preventDefault();
            showSet();
        };
    }

    // ✅ 点击遮罩层关闭（排除内部容器）
    const setOverlay = document.getElementById('setOverlay');
    setOverlay.addEventListener('click', function(e) {
        // 只有点击遮罩层本身（非内部容器）才关闭
        if (e.target === setOverlay) {
            hideSet();
        }
    });

    // 覆盖翻译功能
    window.showTranslation = function(text) {
        if (!text || '-' == text) return;
        const translationBox = document.getElementById('translationBox');
        translationBox.textContent = text;
        const current = localStorage.getItem('translation');
        translationBox.style.display = current === '0' ? 'none' : 'block';
        // 点击翻译框隐藏
        translationBox.onclick = function() {
            hideTranslation();
        };
    }
}