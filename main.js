const { app, BrowserWindow } = require('electron');
const waitOn = require('wait-on');
const { exec, execSync } = require('child_process');

let nextJsProcess;
let mainWindow;

async function startNextAndWait() {
    nextJsProcess = exec('npm run dev', { cwd: __dirname });

    await waitOn({ resources: ['http://localhost:3000'], timeout: 30000 });

    return nextJsProcess;
}

async function createWindow() {
    await startNextAndWait();

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: false
        }
    });

    mainWindow.loadURL('http://localhost:3000');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function killNextJsProcess() {
    if (nextJsProcess) {
        if (process.platform === "win32") {
            execSync(`taskkill /pid ${nextJsProcess.pid} /T /F`); // /T -> all subprocess, /F -> force
        } else {
            process.kill(-nextJsProcess.pid, 'SIGTERM');
        }
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    killNextJsProcess();
    app.quit();
});

app.on('activate', function() {
    if (mainWindow === null) {
      createWindow()
    }
})