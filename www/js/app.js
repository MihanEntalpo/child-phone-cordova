const statusBox = document.getElementById('status');
const exitButton = document.getElementById('exitButton');

const kiosk = {
    async enable() {
        if (navigator.kiosk?.lock) {
            await navigator.kiosk.lock();
            return 'Режим киоска активирован';
        }
        return 'Требуется плагин режима киоска (navigator.kiosk.lock отсутствует)';
    },
    async disable() {
        if (navigator.kiosk?.unlock) {
            await navigator.kiosk.unlock();
            return 'Режим киоска отключён';
        }
        return 'Не удалось отключить: нет реализации navigator.kiosk.unlock';
    },
};

function setStatus(message) {
    if (statusBox) {
        statusBox.textContent = message;
    }
}

async function onDeviceReady() {
    setStatus('Включаем режим киоска…');
    try {
        const message = await kiosk.enable();
        setStatus(message);
    } catch (error) {
        console.error('Ошибка активации киоска', error);
        setStatus('Ошибка активации киоска: ' + error.message);
    }
}

async function handleExit() {
    setStatus('Запрос на выход…');
    try {
        const message = await kiosk.disable();
        setStatus(message);
    } catch (error) {
        console.error('Ошибка выхода из киоска', error);
        setStatus('Ошибка выхода: ' + error.message);
    }
}

if (exitButton) {
    exitButton.addEventListener('click', handleExit);
}

document.addEventListener('deviceready', onDeviceReady, false);
// Для локального просмотра в браузере (без Cordova)
if (!window.cordova) {
    onDeviceReady();
}
