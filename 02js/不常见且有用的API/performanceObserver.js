// 监控页面是否出现卡顿

const observer = new PerformanceObserver(list => {
  for (const entry of list.getEntries()) {
    console.log(entry)
  }
})

observer.observe({
  entryTypes: ['longtask']
})
