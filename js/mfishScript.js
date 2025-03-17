//黑夜模式
var isOpen = true;
var isAuto = false;
var interval;
var nowTime = new Date();

// 页面加载完成后执行
window.onload = function () {
    // 获取 localStorage 中的值
    var dataMap = localStorage.getItem('data');
    if (null != dataMap) {
        var data = new Map(Object.entries(JSON.parse(dataMap)));
        var key = formatDate(nowTime);
        var nowData = data.get(key);
        if (null != nowData) {
            var val = nowData.val;
            var countElement = document.getElementById('clickCount');
            countElement.textContent = null === val ? 0 : val; // 更新文本值
        }
    }
};

//监听全局空格事件
document.onkeydown = function (e) {
    var code = window.event ? e.keyCode : e.which;
    if (code == 32) {
        var muImage = document.getElementById('muImage');
        // 手动添加缩放效果
        muImage.style.transform = 'scale(0.95)';
        // 触发点击事件
        muImage.click();
        // 恢复原始大小
        setTimeout(() => {
            muImage.style.transform = '';
        }, 100);
    }
}

//全局监听点击事件
document.addEventListener('click', function (event) {
    var targetElement = event.target;
    if (targetElement.closest(".settings-icon1") || targetElement.closest(".icon4")) {
        return;
    }

    if (!targetElement.closest("#sidePanel")) {
        const sidePanel = document.getElementById("sidePanel");
        sidePanel.classList.remove("visible");
        sidePanel.classList.add("hidden");
    }
})

//播放函数
function playSound() {
    var sound = document.getElementById("muyuSound");
    sound.currentTime = 0;
    sound.play();
}

//木鱼点击事件
function showTooltip(event) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerText = '功德+1';
    document.body.appendChild(tooltip);

    if (isOpen) {
        tooltip.style.color = '#fff';
    } else {
        tooltip.style.color = '#000';
    }

    var countElement = document.getElementById('clickCount');
    // 获取当前值并加 1
    var currentValue = parseInt(countElement.textContent, 10);
    var clickVal = currentValue + 1;
    countElement.textContent = clickVal; // 更新文本值

    // 数据存储到localStorage
    var data = localStorage.getItem("data");
    if (data != null) {
        var dataMap = new Map(Object.entries(JSON.parse(data)));
        if (dataMap.size > 8) {
            //移除首个元素
            dataMap.delete(dataMap.keys().next().value);
        }
        var key = formatDate(nowTime);
        var nowData = dataMap.get(key);
        if (null != nowData) {
            nowData.val = clickVal;
            dataMap.set(key, nowData);
        } else {
            var data = {days: key, val: clickVal};
            dataMap.set(key, data);
        }
        localStorage.setItem("data", JSON.stringify(Object.fromEntries(dataMap)));
    } else {
        var key = formatDate(nowTime);
        var dataMap = new Map();
        var data = {days: key, val: clickVal};
        dataMap.set(key, data);
        localStorage.setItem("data", JSON.stringify(Object.fromEntries(dataMap)));
    }

    setTimeout(() => {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            tooltip.remove();
        }, 200);
    }, 200);
}

/**
 * 一级菜单栏击事件
 * @param element
 */
function clickEven(element) {
    var type = element.getAttribute('value');
    if ('0' == type) {
        blackAndWhiteMode();
    } else if ('1' == type) {
        showStatMode();
    } else {
        autoMode();
    }
}

/**
 * 黑白模式
 * @param
 */
function blackAndWhiteMode() {
    var container = document.getElementsByClassName('container')[0];
    //白天模式
    if (isOpen) {
        container.style.backgroundColor = '#ffffff';
        document.getElementsByClassName('settings-icon')[0].style.backgroundImage = "url('../img/白天模式(黑).png')";
        document.getElementsByClassName('settings-icon1')[0].style.backgroundImage = "url('../img/统计(黑).png')";
        document.getElementsByClassName('settings-icon2')[0].style.backgroundImage = "url('../img/自动模式(黑).png')";
        document.getElementsByTagName('img')[0].style.filter = "brightness(0%)";
        var h1Element = document.querySelector('.topText h1');
        h1Element.style.color = '#000'; // 改变字体颜色为红色

        var h4Element = document.querySelector('.topText h4');
        h4Element.style.color = '#000'; // 改变字体颜色为红色

        //改变title文本颜色
        var tooltiptext = document.getElementsByClassName('tooltiptext');
        for (let i = 0; i < tooltiptext.length; i++) {
            tooltiptext[i].style.color = '#000';
        }


        isOpen = false;
    } else {
        container.style.backgroundColor = '#000';
        document.getElementsByClassName('settings-icon')[0].style.backgroundImage = "url('../img/白天模式(白).png')";
        document.getElementsByClassName('settings-icon1')[0].style.backgroundImage = "url('../img/统计(白).png')";
        document.getElementsByClassName('settings-icon2')[0].style.backgroundImage = "url('../img/自动模式(白).png')";
        document.getElementsByTagName('img')[0].style.filter = "brightness(100%)";

        var h1Element = document.querySelector('.topText h1');
        h1Element.style.color = '#fff'; // 改变字体颜色为红色

        var h4Element = document.querySelector('.topText h4');
        h4Element.style.color = '#fff'; // 改变字体颜色为红色

        var tooltiptext = document.getElementsByClassName('tooltiptext');
        for (let i = 0; i < tooltiptext.length; i++) {
            tooltiptext[i].style.color = '#fff';
        }

        isOpen = true;
    }
}

/**
 * 数据统计
 * @param
 */
function showStatMode() {
    const sidePanel = document.getElementById("sidePanel");
    sidePanel.classList.remove("hidden");
    sidePanel.classList.add("visible");

    // 根据当前模式添加暗黑模式类
    if (!isOpen) {
        sidePanel.classList.add("dark-mode");
    } else {
        sidePanel.classList.remove("dark-mode");
    }

    var item = localStorage.getItem("data");
    if (item != null) {
        var dataMap = new Map(Object.entries(JSON.parse(item)));
        var nowData = dataMap.get(formatDate(nowTime));

        if (nowData == undefined || nowData == null) {
            nowData = {days: formatDate(nowTime), val: 0};
        }

        // 求和
        var sum = 0;
        var maxVal = 0;
        dataMap.forEach(function (item) {
            sum = sum + item.val;
            if (item.val > maxVal) maxVal = item.val;
        });

        // 创建标题
        var html = `<h2>功德统计</h2>`;

        // 今日功德卡片
        html += `
        <div class="stat-card">
          <h3>今日功德</h3>
          <div class="stat-value">${nowData.val}</div>
          <div class="progress-container">
            <div class="progress-bar" style="width: ${maxVal > 0 ? (nowData.val / maxVal * 100) : 0}%"></div>
          </div>
        </div>
      `;

        // 近7日累计功德卡片
        html += `
        <div class="stat-card">
          <h3>近期累计功德</h3>
          <div class="stat-value">${sum}</div>
        </div>
      `;

        // 每日功德记录
        var sortedData = Array.from(dataMap.values()).sort((a, b) => {
            return new Date(b.days) - new Date(a.days);
        });

        sortedData.forEach(function (item) {
            html += `
          <div class="stat-card">
            <h3>${item.days}</h3>
            <div class="stat-value">${item.val}</div>
            <div class="progress-container">
              <div class="progress-bar" style="width: ${maxVal > 0 ? (item.val / maxVal * 100) : 0}%"></div>
            </div>
          </div>
        `;
        });

        sidePanel.innerHTML = html;
    } else {
        // 没有数据时显示的内容
        sidePanel.innerHTML = `
        <h2>功德统计</h2>
        <div class="stat-card">
          <h3>今日功德</h3>
          <div class="stat-value">0</div>
        </div>
        <div class="stat-card">
          <h3>暂无历史数据</h3>
        </div>
      `;
    }
}

/**
 * 自动模式
 * @param
 */
function autoMode() {
    if (!isAuto) {
        autoPlay();
        interval = setInterval(autoPlay, 1400)
        isAuto = true;
    } else {
        clearInterval(interval);
        isAuto = false;
    }
}

//自动播放
function autoPlay() {
    showTooltip();
    playSound();
}


/**
 * 二级菜单点击事件
 * @param
 */
function toggleMenu() {
    var center = document.getElementsByClassName("center")[0];
    const menuItems = document.getElementById('menuItems');

    if (menuItems.classList.contains('show')) {
        // 收起菜单
        menuItems.classList.add('fade');
        menuItems.classList.remove('show');
        center.style.background = 'rgb(255, 255, 255,0.08)';

        // 延迟移除fade类，等待动画完成
        // 增加延迟时间以确保所有图标的动画都能完成
        setTimeout(() => {
            menuItems.classList.remove('fade');
        }, 1500);
    } else {
        // 展开菜单
        menuItems.classList.remove('fade');
        menuItems.classList.add('show');
        center.style.background = 'rgb(255, 255, 255,0.9)';
    }
}


//二级菜单点击事件
function clickMenu(element) {
    var value = element.getAttribute('value');
    if ('0' == value) {
        //播放音乐
    } else if ('1' == value) {
        //黑白模式
        blackAndWhiteMode();
    } else if ('2' == value) {
        //自动播放模式
        autoMode();
    } else if ('3' == value) {
        //数据统计
        showStatMode();
    } else if ('4' == value) {
        //切换木鱼
    } else if ('5' == value) {
        showMessage("敬请期待");
    } else if ('6' == value) {
        showMessage("敬请期待");
    } else {
        showMessage("敬请期待");
    }
}

/**
 * 显示消息提示
 * @param message 消息内容
 */
function showMessage(message) {
    // 创建消息元素
    const messageEl = document.createElement('div');
    if(isOpen){
        messageEl.className = 'message-tip-black';
    }else{
        messageEl.className = 'message-tip-white';
    }

    messageEl.innerText = message;
    document.body.appendChild(messageEl);

    // 1秒后开始淡出
    setTimeout(() => {
        messageEl.style.opacity = '0';
        // 等待过渡效果完成后移除元素
        setTimeout(() => {
            messageEl.remove();
        }, 500);
    }, 1000);
}

/**
 * 格式化方法
 * @param date
 * @returns {string}
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}
