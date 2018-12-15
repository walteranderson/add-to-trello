
export const openSettings = () => {
  browser.tabs.create({
    url: browser.extension.getURL('settings.html')
  })
}
