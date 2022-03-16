const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { remove } = require("fs-jetpack");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 390,
    height: 630,
    backgroundColor: "#333333",
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");
  win.webContents.openDevTools({ mode: "detach" });
  app.on("ready", () => {
    win.show();
  });

  ipcMain.on("min", () => {
    win.minimize();
  });

  ipcMain.on("close", () => {
    win.close();
  });

  ipcMain.handle("openSetupFile", async () => {
    const file = await dialog.showOpenDialog(win, {
      properties: ["openFile"],
      filters: [{ name: "JSON files", extensions: ["json"] }],
    });
    return file;
  });

  ipcMain.handle("saveSetupFile", async () => {
    const date = new Date();
    const file = await dialog.showSaveDialog(win, {
      defaultPath: `/setups/setup-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.json`,
      filters: [{ name: "JSON file", extensions: ["json"] }],
    });
    return file;
  });

  ipcMain.handle("openThemeFile", async () => {
    const file = await dialog.showOpenDialog(win, {
      properties: ["openFile"],
      filters: [{ name: "RDR Theme files", extensions: ["rdrtheme"] }],
    });
    return file;
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});