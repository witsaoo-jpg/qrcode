// --- ส่วนของ PWA & Service Worker ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.log('Service Worker failed', err));
    });
}

let deferredPrompt;
const installBox = document.getElementById('installPrompt');
const installBtn = document.getElementById('btnInstall');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBox.classList.remove('hidden');
});

installBtn.addEventListener('click', () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                installBox.classList.add('hidden');
            }
            deferredPrompt = null;
        });
    }
});

// --- ส่วนของ QR Code Logic ---
function generateQR() {
    const text = document.getElementById('text').value;
    if (!text) {
        alert('กรุณากรอกข้อมูลก่อนครับ');
        return;
    }

    const size = parseInt(document.getElementById('size').value);
    const colorDark = document.getElementById('colorDark').value;
    const colorLight = document.getElementById('colorLight').value;

    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';

    // สร้าง QR Code (สร้างขนาดจริงตามที่เลือก)
    new QRCode(qrContainer, {
        text: text,
        width: size,
        height: size,
        colorDark: colorDark,
        colorLight: colorLight,
        correctLevel: QRCode.CorrectLevel.H
    });

    const resultDiv = document.getElementById('qrResult');
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function downloadQR() {
    const qrContainer = document.getElementById('qrcode');
    const sourceCanvas = qrContainer.querySelector('canvas');
    if (!sourceCanvas) return;

    const labelText = document.getElementById('labelText').value;
    const labelSize = parseInt(document.getElementById('labelSize').value);
    const size = parseInt(document.getElementById('size').value);
    const colorDark = document.getElementById('colorDark').value;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scale = size / 300; 
    const fontSize = labelSize * scale * 2.5;
    const padding = size * 0.05;
    const bottomSpace = labelText ? (fontSize * 2.5) : padding;

    canvas.width = size + (padding * 2);
    canvas.height = size + padding + bottomSpace;

    // Background White
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw QR
    ctx.drawImage(sourceCanvas, padding, padding, size, size);

    // Draw Text
    if (labelText) {
        ctx.fillStyle = colorDark;
        ctx.font = `600 ${fontSize}px 'Kanit', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, canvas.width / 2, size + padding + (bottomSpace / 2) - (padding/2));
    }

    const link = document.createElement('a');
    link.download = `QR-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}
