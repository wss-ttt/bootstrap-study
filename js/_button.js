;+(function ($) {
  'use strict'

  // 构造函数
  var Button = function (element, options) {
    this.$el = $(element) // 这里包装成了jQuery实例对象
    // 合并参数
    this.options = $.extend({}, options, Button.DEFAULTS)
    this.isLoading = false
  }
  // 默认配置
  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
    var $el = this.$el
    /* var oldText   // 不能像这样做
    if(!oldText) {
      console.log('222') // 否则这个地方还是会执行2次
      oldText = $el.html() // 保存之前的文本信息
    } */
    var data = $el.data() // data是一个对象，为引用类型
    if (!data.resetText) {
      // 通过判断对象上某一个属性是否存在
      data.resetText = $el.html()
    }
    if (state.toLowerCase() === 'loading') {
      this.isLoading = true
      $el.html(this.options['loadingText'])
      $el.addClass(d).attr(d, d)
    } else if (this.isLoading) {
      this.isLoading = false
      $el.html(data.resetText)
      $el.removeClass(d).removeAttr(d)
    }
  }
  // 入口方法
  function Plugin(options) {
    // 创建button实例对象
    var data = $(this).data('bs.button') // 注意: 这个地方不能这样写 data = null
    // 实现单例模式
    if (!data) {
      data = new Button(this, options)
      $(this).data('bs.button', data)
    }
    data.setState(options)
  }

  // 暴露接口(button方法为实例方法)
  $.fn.button = Plugin
})(jQuery)
