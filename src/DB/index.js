import { isArray } from '@/utils/validate'
import { CHROME_EXT_TODO } from './constant'
class IndexDB {
  constructor(dbName, version = '1') {
    this.DB = null
    this.dbName = dbName
    this.version = version
  }

  /**
   * @description: 连接数据库，如果不存在默认创建新的数据库
   */
  openDB(callback) {
    const request = window.indexedDB.open(this.dbName, this.version)
    request.onerror = function(event) {
      console.error(event.currentTarget.error.message)
    }
    request.onsuccess = function() {
      this.DB = request.result // 可以拿到数据库对象
      if (callback && typeof callback === 'function') {
        callback(this.DB)
      }
    }
    request.onupgradeneeded = function(event) {
      this.DB = event.target.result
      // 创建数据库中的表 chrome_ext_todo
      if (!this.DB.objectStoreNames.contains(CHROME_EXT_TODO)) {
        const objectStore = this.DB.createObjectStore(
          CHROME_EXT_TODO,
          {
            keyPath: 'id',
            autoIncrement: true
          }
        )
        objectStore.createIndex('id', 'id', { unique: true })
        objectStore.createIndex('todo_key', 'todo_key', { unique: false })
      }
    }
  }

  /**
   * @description: 给对应的表新增数据
   * @param {*} tableName 表名称
   * @param {*} data 插入的信息 对象或者数组
   * @return {*}
   */
  insert(tableName, data) {
    return new Promise((resolve, reject) => {
      this.openDB(function(DB) {
        const store = DB.transaction([tableName], 'readwrite')
          .objectStore(tableName)

        const request = isArray(data) ? data.forEach(v => store.put(v)) : store.put(data)

        request.onsuccess = function() {
          console.log(`表${tableName} -- 数据 ${data} -- 写入成功`)
          resolve({
            code: 200,
            data,
            msg: '新增数据成功'
          })
        }

        request.onerror = function() {
          console.error(`表${tableName} -- 数据 ${data} -- 写入失败`)
          reject({
            code: 500,
            data,
            msg: '新增数据失败'
          })
        }
      })
    })
  }

  /**
   * @description: 根据主键删除表数据
   * @param {*} tableName 表名称
   * @param {*} id 主键值
   * @return {*}
   */
  deleteByPrimaryKey(tableName, id) {
    return new Promise((resolve, reject) => {
      this.openDB(function(DB) {
        const request = DB.transaction([tableName], 'readwrite')
          .objectStore(tableName)
          .delete(id)

        request.onsuccess = function() {
          resolve({
            code: 200,
            msg: '数据删除成功'
          })
        }

        request.onerror = function() {
          reject({
            code: 500,
            msg: '数据删除失败'
          })
        }
      })
    })
  }

  /**
   * @description: 根据主键对表数据进行更新
   * @param {*} tableName 表名称
   * @param {*} data 插入的信息
   * @return {*}
   */
  updateByPrimaryKey(tableName, data) {
    return new Promise((resolve, reject) => {
      this.openDB(function(DB) {
        const request = DB.transaction([tableName], 'readwrite')
          .objectStore(tableName)
          .put(data)

        request.onsuccess = function() {
          console.log(`表${tableName} -- 数据 ${data} -- 更新成功`)
          resolve({
            code: 200,
            data,
            msg: '更新数据成功'
          })
        }

        request.onerror = function() {
          console.error(`表${tableName} -- 数据 ${data} -- 更新失败`)
          reject({
            code: 500,
            data,
            msg: '更新数据失败'
          })
        }
      })
    })
  }

  /**
   * @description: 通过索引 获取数据内容
   * @param {*} tableName 表名称
   * @param {*} indexKey 索引名称
   * @param {*} indexVal 索引的值
   * @return {*}
   */
  selectByIndex(tableName, indexKey, indexVal) {
    return new Promise((resolve, reject) => {
      this.openDB(function(DB) {
        const transaction = DB.transaction([tableName], 'readonly')
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
    })
  }

  /**
   * @description: 根据条件查询
   * @param {function} condition 条件函数
   */
  selectByCondition(tableName, condition) {
    const result = []
    return new Promise((resolve, reject) => {
      this.openDB(function(DB) {
        const request = DB.transaction([tableName]).objectStore(tableName).openCursor()

        request.onsuccess = function(event) {
          const cursor = event.target.result
          if (cursor) {
            if (condition(cursor.value)) {
              result.push(cursor.value)
            }
            cursor.continue()
          } else {
            resolve({
              code: 200,
              data: result,
              msg: '获取数据成功'
            })
            console.log('没有更多数据了！')
          }
        }

        request.onerror = function(e) {
          reject({
            code: 500,
            data: e,
            msg: '获取失败'
          })
        }
      })
    })
  }
}
export default new IndexDB('chrome_ext')
