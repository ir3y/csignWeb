const API_BASE_URL = "https://api-csign.darkyu.me";

const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
document.getElementById('current-date').textContent = `${yyyy}/${mm}/${dd}`;

const params = new URLSearchParams(window.location.search);
const sessionCode = params.get('s');

if (sessionCode) {
    fetch(`${API_BASE_URL}/api/status?s=${encodeURIComponent(sessionCode)}`)
        .then(res => res.json())
        .then(data => {
            if (data.blocked) {
                document.getElementById('main-content').style.display = 'none';
                const errBox = document.getElementById('error-box');
                errBox.style.display = 'block';
                errBox.textContent = data.reason;
            }
        })
        .catch(() => {
        });
}

const form = document.getElementById('sign-form');
const msg = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.style.color = '#333';
    msg.textContent = '簽到處理中...';

    const name = document.getElementById('name').value.trim();
    const code = document.getElementById('code').value.trim();

    try {
        const res = await fetch(`${API_BASE_URL}/api/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, code })
        });
        const data = await res.json();

        if (res.ok) {
            msg.style.color = '#188038';
            msg.textContent = '✅ ' + data.message;
            form.reset();
        } else {
            msg.style.color = '#d93025';
            msg.textContent = '❌ ' + data.message;
        }
    } catch (err) {
        msg.style.color = '#d93025';
        msg.textContent = '❌ 無法連線至簽到伺服器，請確認機器人是否已啟動';
    }
});