// === 1. 全局变量 ===
let timeOffset = 0;
const fontThemes = ['theme-youyuan', 'theme-heiti', 'theme-jianzhi'];
let currentThemeIndex = 0;
const slides = document.querySelectorAll('.bg-slide');
let currentSlide = 0;
const importantNames = ['梅智慧', '邢丁元'];

// === 2. 字体切换逻辑 ===
function initFont() {
    const saved = localStorage.getItem('fontTheme');
    currentThemeIndex = (saved && fontThemes.includes(saved)) ? fontThemes.indexOf(saved) : 0;
    document.body.classList.add(fontThemes[currentThemeIndex]);
}
function toggleFont() {
    document.body.classList.remove(fontThemes[currentThemeIndex]);
    currentThemeIndex = (currentThemeIndex + 1) % fontThemes.length;
    document.body.classList.add(fontThemes[currentThemeIndex]);
    localStorage.setItem('fontTheme', fontThemes[currentThemeIndex]);
}

// === 3. FPS 帧率计算器 ===
let lastFpsUpdate = performance.now();
let frameCount = 0;
function fpsLoop() {
    frameCount++;
    const now = performance.now();
    if (now - lastFpsUpdate >= 1000) {
        document.getElementById('fps-counter').textContent = Math.round((frameCount * 1000) / (now - lastFpsUpdate)) + ' FPS';
        frameCount = 0; lastFpsUpdate = now;
    }
    requestAnimationFrame(fpsLoop);
}

// === 4. 背景图横向平移 ===
function initBackground() {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[0].classList.add('active');
    setInterval(slideBackground, 30000);
}
function slideBackground() {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (currentSlide + 1) % slides.length;
    void slides[currentSlide].offsetWidth;
    slides[currentSlide].classList.add('active');
}

// === 5. 在线网络时间与主题切换 ===
function initOnlineTime() {
    fetch('https://acs.m.taobao.com/h5/mtop.common.getTimestamp/3.0/')
        .then(res => res.json())
        .then(data => { if (data?.data?.t) timeOffset = parseInt(data.data.t) - Date.now(); })
        .catch(() => {})
        .finally(() => { updateTimeAndTheme(); setInterval(updateTimeAndTheme, 1000); });
}
function updateTimeAndTheme() {
    const now = new Date(Date.now() + timeOffset);
    const hours = now.getHours();
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    let greeting = '你好';
    if (hours >= 6 && hours < 12) greeting = '早上好 ☀️';
    else if (hours >= 12 && hours < 14) greeting = '中午好 🍱';
    else if (hours >= 14 && hours < 18) greeting = '下午好 ☕';
    else if (hours >= 18 && hours < 24) greeting = '晚上好 🌙';
    else greeting = '夜深了，早点休息 💤';
    document.getElementById('greeting-text').textContent = greeting;
    document.getElementById('date-display').textContent = `今天是 ${now.getMonth()+1}月${now.getDate()}日 ${days[now.getDay()]}`;
    document.getElementById('clock-display').textContent = now.toLocaleTimeString('zh-CN', { hour12: false });
    if (hours >= 18 || hours < 6) document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
}

// === 6. 天气抓取 ===
function loadWeather() {
    fetch('https://wttr.in/Wuhu?format=j1')
        .then(res => res.json())
        .then(data => {
            const current = data.current_condition[0];
            const weatherMap = { 'Sunny': '晴', 'Clear': '晴', 'Partly cloudy': '多云', 'Cloudy': '阴', 'Overcast': '阴', 'Light rain': '小雨', 'Moderate rain': '中雨', 'Heavy rain': '大雨', 'Light drizzle': '毛毛雨', 'Mist': '薄雾', 'Fog': '大雾' };
            const descCN = weatherMap[current.weatherDesc[0].value] || current.weatherDesc[0].value;
            let emoji = descCN.includes('晴') ? '☀️' : descCN.includes('多云') ? '⛅' : descCN.includes('阴') ? '☁️' : descCN.includes('雨') ? '🌧️' : '🌤️';
            document.getElementById('weather-display').innerHTML = `${emoji} ${descCN} ${current.temp_C}°C`;
        })
        .catch(() => { document.getElementById('weather-display').innerHTML = '🌤️ 天气获取失败'; });
}

// === 7. 数据请求与渲染 ===
function loadDataAndRender() {
    Promise.all([
        fetch('data/duty.json').then(res => res.json()),
        fetch('data/courses.json').then(res => res.json())
    ]).then(([dutyData, coursesData]) => {
        const mergedData = { ...dutyData, ...coursesData };
        renderDashboard(mergedData);
        setInterval(() => renderTodayCourses(mergedData), 60000);
    }).catch(err => {
        console.error('数据加载失败:', err);
        document.getElementById('today-courses').innerHTML = '<div style="color:red;font-size:14px;text-align:center;padding:20px 0;">❌ 数据加载失败，请检查 data 文件夹</div>';
    });
}

function renderDashboard(data) {
    renderTodayCourses(data);
    renderTodayDuty(data);
    renderRules(data);
    renderFullTables(data);
}

function renderTodayCourses(data) {
    const now = new Date(Date.now() + timeOffset);
    const todayKey = { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri' }[now.getDay()];
    const courseContainer = document.getElementById('today-courses');
    if (!todayKey) { courseContainer.innerHTML = '<div style="color:var(--text-muted);font-size:15px;text-align:center;padding:30px 0;">周末无课程安排，好好休息！🎉</div>'; return; }
    courseContainer.innerHTML = '';
    let hasCourse = false;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    data.courses.forEach(course => {
        const lesson = course[todayKey];
        if (lesson) {
            hasCourse = true;
            const [sH, sM] = course.start.split(':').map(Number); const [eH, eM] = course.end.split(':').map(Number);
            const sMin = sH * 60 + sM; const eMin = eH * 60 + eM;
            let statusHtml = currentMinutes >= sMin && currentMinutes <= eMin ? '<span class="status-badge status-ongoing">进行中</span>' : (currentMinutes < sMin ? '<span class="status-badge status-upcoming">即将开始</span>' : '<span class="status-badge status-done">已结束</span>');
            courseContainer.innerHTML += `<div class="course-item"><div class="course-time">${course.start} ~ ${course.end}</div><div class="course-info"><span class="course-subject">${lesson.sub}</span><span class="course-teacher">👨‍🏫 ${lesson.tea}</span></div>${statusHtml}</div>`;
        }
    });
    if (!hasCourse) courseContainer.innerHTML = '<div style="color:var(--text-muted);font-size:15px;text-align:center;padding:30px 0;">今日无课程安排 🎈</div>';
}

function renderTodayDuty(data) {
    const now = new Date(Date.now() + timeOffset);
    const todayWeek = { 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六', 0: '周日' }[now.getDay()];
    const dutyContainer = document.getElementById('today-duty');
    if (todayWeek === '周六' || todayWeek === '周日') { dutyContainer.innerHTML = '<div style="color:var(--text-muted);font-size:15px;text-align:center;padding:30px 0;">周末无值日安排~ 🏖️</div>'; return; }
    const todayDutyList = data.duty.filter(d => d.week === todayWeek && d.round === '第一轮');
    dutyContainer.innerHTML = '';
    if (todayDutyList.length > 0) {
        todayDutyList.forEach(duty => {
            dutyContainer.innerHTML += `<div class="duty-item"><div class="duty-role">👑 ${duty.leader} <span style="font-size:12px;color:var(--text-muted);font-weight:normal;">(组长)</span></div><div class="duty-members"><span class="member-tag">${duty.m1}</span><span class="member-tag">${duty.m2}</span><span class="member-tag">${duty.m3}</span></div></div>`;
        });
        dutyContainer.innerHTML += `<div style="font-size:12px; color:var(--text-muted); margin-top:15px; text-align:center;">💡 当前显示【第一轮】值日安排</div>`;
    } else { dutyContainer.innerHTML = '<div style="color:var(--text-muted);font-size:15px;text-align:center;padding:30px 0;">今日无值日安排</div>'; }
}

function renderRules(data) {
    if (data.dutyRules) {
        let rulesHtml = data.dutyRules;
        importantNames.forEach(name => { rulesHtml = rulesHtml.replace(new RegExp(name, 'g'), `<span class="highlight-name">${name}</span>`); });
        document.getElementById('rules-content').innerHTML = rulesHtml;
    }
}

function renderFullTables(data) {
    const tbodyDuty = document.querySelector('#duty-table tbody');
    tbodyDuty.innerHTML = ''; let currentRound = '';
    data.duty.forEach(row => {
        if (row.round !== currentRound) { currentRound = row.round; tbodyDuty.innerHTML += `<tr><td colspan="5" class="round-header">✨ ${currentRound}</td></tr>`; }
        tbodyDuty.innerHTML += `<tr><td>${row.week}</td><td>${row.leader}</td><td>${row.m1}</td><td>${row.m2}</td><td>${row.m3}</td></tr>`;
    });
    const tbodyCourse = document.querySelector('#course-table tbody');
    tbodyCourse.innerHTML = '';
    data.courses.forEach(row => {
        tbodyCourse.innerHTML += `<tr><td><b>${row.section}</b></td><td style="font-size:12px;color:var(--text-muted);">${row.start} ~ ${row.end}</td><td>${row.mon.sub}<br><span style="font-size:11px;color:var(--text-muted);">${row.mon.tea}</span></td><td>${row.tue.sub}<br><span style="font-size:11px;color:var(--text-muted);">${row.tue.tea}</span></td><td>${row.wed.sub}<br><span style="font-size:11px;color:var(--text-muted);">${row.wed.tea}</span></td><td>${row.thu.sub}<br><span style="font-size:11px;color:var(--text-muted);">${row.thu.tea}</span></td><td>${row.fri.sub}<br><span style="font-size:11px;color:var(--text-muted);">${row.fri.tea}</span></td></tr>`;
    });
}

function toggleAccordion(btn) {
    document.getElementById('full-tables').classList.toggle('open');
    btn.classList.toggle('open');
}

// === 8. 页面初始化 ===
window.addEventListener('DOMContentLoaded', () => {
    initFont(); initBackground(); initOnlineTime(); loadWeather(); requestAnimationFrame(fpsLoop);
    loadDataAndRender();
});