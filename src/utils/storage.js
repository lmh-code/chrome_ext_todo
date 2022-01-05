const set = (items) => {
  return new Promise((resolve) => {
    chrome.storage.sync.set(items, () => {
      resolve(true)
    })
  })
}

const get = (keys) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, (items) => {
      resolve(items)
    })
  })
}

const remove = (keys) => {
  return new Promise((resolve) => {
    chrome.storage.sync.remove(keys, () => {
      resolve(true)
    })
  })
}

const clear = () => {
  return new Promise((resolve) => {
    chrome.storage.sync.clear(() => {
      resolve(true)
    })
  })
}

export default {
  set,
  get,
  remove,
  clear
}
