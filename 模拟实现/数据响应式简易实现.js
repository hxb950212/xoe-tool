// vue里面的数据响应式的主要原理
// 对象属性监听
function observe(obj) {
  if (!obj || typeof obj !== 'object') {
    return
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}

// 通过 Dep 解耦属性的依赖和更新操作
class Dep {
  constructor() {
    this.subs = []
  }
  // 添加依赖
  addSub(sub) {
    this.subs.push(sub)
  }
  // 更新
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
// 全局属性，通过该属性配置 Watcher
Dep.target = null

class Watcher {
  constructor(obj, key, cb) {
    // 将 Dep.target 指向自己
    // 然后触发属性的 getter 添加监听
    // 最后将 Dep.target 置空
    Dep.target = this
    this.cb = cb
    this.obj = obj
    this.key = key
    this.value = obj[key]
    Dep.target = null
  }
  update() {
    // 获得新值
    this.value = this.obj[this.key]
    // vue在此调用 update 方法更新 Dom
    this.cb(this.value)
  }
}

function defineReactive(obj, key, val) {
  // 递归子属性
  observe(val)
  let dp = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log('get value')
      // 将 Watcher 添加到订阅
      if (Dep.target) {
        dp.addSub(Dep.target)
      }
      return val
    },
    set: function reactiveSetter(newVal) {
      console.log('change value')
      val = newVal
      // 执行 watcher 的 update 方法
      dp.notify()
    }
  })
}

var data = { name: 'xoeaza' }
observe(data)
function update(value) {
  console.log('update', value)
}
// 模拟解析到模板里 `{{name}}` 触发的操作
new Watcher(data, 'name', update)
// 模拟触发数据更改
data.name = 'xixixixii'

// Vue3.0中使用Proxy实现数据响应优点，无需一层层为每个属性添加代理，一次性即可完成以上操作, 并且proxy可以监听到任何的数据改变。
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value, receiver) {
      setBind(target, property)
      return Reflect.set(target, property, value, receiver)
    }
  }
  return new Proxy(obj, handler)
}

let obj = { a: 1 }
let p = onWatch(obj, (target, property) => {
  console.log(`监听到属性${property}改变为${target[property]}`)
}, (target, property) => {
  console.log(`${property}=${target[property]}`)
})
p.a = 2 //监听到属性a改变为1
