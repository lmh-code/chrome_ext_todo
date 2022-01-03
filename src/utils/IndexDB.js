class IndexDB {
  constructor() {
    this.DB = null
    this.dbName = 'chrome_ext'
    this.version = '1'
  }

  /**
   * @description: 连接数据库，如果不存在默认创建新的数据库
   */
  openDB() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, this.version)
      request.onerror = function(event) {
        console.error(event)
        reject('onerror')
      }

      request.onsuccess = (event) => {
        this.DB = request.result // 可以拿到数据库对象
        resolve('onsuccess')
      }

      // 如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件upgradeneeded
      request.onupgradeneeded = function(event) {
        this.DB = event.target.result
        // 创建数据库中的表
        if (!this.DB.objectStoreNames.contains('chrome_ext_todo')) {
          const objectStore = this.DB.createObjectStore(
            'chrome_ext_todo',
            {
              keyPath: 'id',
              autoIncrement: true
            }
          )
          objectStore.createIndex('id', 'id', { unique: true })
          objectStore.createIndex('todo_key', 'todo_key', { unique: false })
        }
        resolve('onupgradeneeded')
      }
    })
  }

  /**
   * @description: 给对应的表新增数据
   * @param {*} tableName 表名称
   * @param {*} info 插入的信息
   * @return {*}
   */
  insert(tableName, info) {
    return new Promise((resolve, reject) => {
      const request = this.DB.transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .add(info)

      request.onsuccess = function(event) {
        console.log(`表${tableName} -- 数据 ${info} -- 写入成功`)
        event.msg = `表${tableName} -- 数据 ${info} -- 写入成功`
        resolve({
          code: 200,
          data: info,
          msg: '新增数据成功'
        })
      }

      request.onerror = function(event) {
        console.error(`表${tableName} -- 数据 ${info} -- 写入失败`)
        event.msg = `表${tableName} -- 数据 ${info} -- 写入失败`
        reject({
          code: 500,
          data: info,
          msg: '新增数据失败'
        })
      }
    })
  }

  /**
   * @description: 给对应的表新增数据
   * @param {*} tableName 表名称
   * @param {*} info 插入的信息
   * @return {*}
   */
  update(tableName, info) {
    return new Promise((resolve, reject) => {
      const request = this.DB.transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .put(info)

      request.onsuccess = function(event) {
        console.log(`表${tableName} -- 数据 ${info} -- 更新成功`)
        event.msg = `表${tableName} -- 数据 ${info} -- 更新成功`
        resolve({
          code: 200,
          data: info,
          msg: '新增数据成功'
        })
      }

      request.onerror = function(event) {
        console.error(`表${tableName} -- 数据 ${info} -- 更新失败`)
        event.msg = `表${tableName} -- 数据 ${info} -- 更新失败`
        reject({
          code: 500,
          data: info,
          msg: '新增数据失败'
        })
      }
    })
  }

  /**
   * @description: 通过索引获取数据内容
   * @param {*} tableName 表名称
   * @param {*} indexKey 索引名称
   * @param {*} indexVal 索引的值
   * @return {*}
   */
  selectByIndex(tableName, indexKey, indexVal) {
    return new Promise((resolve, reject) => {
      const transaction = this.DB.transaction([tableName], 'readonly')
      const store = transaction.objectStore(tableName)
      const index = store.index(indexKey)
      const request = index.getAll(indexVal)

      request.onsuccess = function(e) {
        resolve({
          code: 200,
          data: e.target.result || [],
          msg: '获取成功'
        })
      }

      request.onerror = function(e) {
        reject({
          code: 500,
          data: e,
          msg: '获取失败'
        })
      }
    })
  }
  /**
   * @description: 根据ID删除
   * @param {*} tableName 表名称
   * @param {*} id
   * @return {*}
   */
  deleteById(tableName, id) {
    return new Promise((resolve, reject) => {
      const request = this.DB.transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .delete(id)

      request.onsuccess = function(e) {
        resolve({
          code: 200,
          msg: '数据删除成功'
        })
      }

      request.onerror = function(e) {
        reject({
          code: 500,
          msg: '数据删除失败'
        })
      }
    })
  }
}
export default new IndexDB()
