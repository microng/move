const directiveObj = {
  install (Vue) {
    Vue.directive('fouceEv', {
      inserted (el) {
        // el是当前所在的元素,当el不是元素的JS标签时就去获取
        // 都是原生JS可以直接使用js的方法
        // 原生DOM.nodeName可以拿到标签名字，不过要大写
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          const theInput = el.querySelector('input')
          const theTextarea = el.querySelector('textarea')
          if (theInput) theInput.focus()
          if (theTextarea) theTextarea.focus()
        }
      }
    })
  }
}

export default directiveObj
