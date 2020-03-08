$(document).ready(function () {
  var container = $('.scratch-container')
  var scratchZone = $('.scratch-zone')

  container.width($(window).width())
  container.height((container.width() / 9) * 16)

  scratchZone.width(container.width() * (config.prizeZone.width / 100))
  scratchZone.height(container.height() * (config.prizeZone.height / 100))
  scratchZone.css({
      left: (100 - config.prizeZone.width) / 2 + "%",
      top: (100 - config.prizeZone.height) / 2 + "%",
  })

  var prizePool = []

  var canvas = $('.mask')
  var ctx = canvas[0].getContext('2d')
  canvas.width(scratchZone.width())
  canvas.height(scratchZone.height())
  ctx.canvas.width = scratchZone.width()
  ctx.canvas.height = scratchZone.height()

  var maskImg = new Image()
  maskImg.src = 'imgs/mask.png'

  maskImg.onload = function () {
      ctx.drawImage(maskImg, 0, 0, maskImg.width, maskImg.height, 0, 0, scratchZone.width(), scratchZone.height())
      scratchZone.find(".prize").show()
  }

  var brushImg = new Image()
  brushImg.src = 'imgs/brush.png'

  canvas.on('mousedown', handleMouseDown)
  canvas.on('mousemove', handleMouseMove)
  canvas.on('mouseup', handleMouseUp)

  canvas.on('touchstart', handleMouseDown)
  canvas.on('touchmove', handleMouseMove)
  canvas.on('touchend', handleMouseUp)

  var isDrawing = false
  var lastPoint

  function getRandPrize() {
      var min = 0
      var max = prizePool.length - 1
      var random = Math.floor(Math.random()*(max-min+1))+min

      return prizePool[random]
  }

  function makePrizePool() {
      $.each(config.prize, (index, item) => {
          for (var i = 0; i < item.chance; i++) {
              prizePool.push(item.img)
          }
      })
  }

  function handleMouseDown(e) {
      isDrawing = true
      lastPoint = getMouse(e, canvas)
  }

  function handleMouseMove(e) {
      if (!isDrawing) {
          return
      }

      e.preventDefault()

      var currentPoint = getMouse(e, canvas),
          dist = distanceBetween(lastPoint, currentPoint),
          angle = angleBetween(lastPoint, currentPoint),
          x,
          y

      for (var i = 0; i < dist; i++) {
          x = lastPoint.x + Math.sin(angle) * i - 25
          y = lastPoint.y + Math.cos(angle) * i - 25
          ctx.globalCompositeOperation = 'destination-out'
          ctx.drawImage(brushImg, x, y, scratchZone.width() * 0.1, scratchZone.width() * 0.1)
      }

      lastPoint = currentPoint
      handlePercentage(getFilledInPixels(32))
  }

  function handleMouseUp(e) {
      isDrawing = false
  }

  function getMouse(e, canvas) {
      var parentOffset = canvas.parent().offset()
      var relX = (e.pageX || e.touches[0].clientX) - parentOffset.left
      var relY = (e.pageY || e.touches[0].clientY) - parentOffset.top

      return { x: relX, y: relY }
  }

  function distanceBetween(point1, point2) {
      return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
  }

  function angleBetween(point1, point2) {
      return Math.atan2(point2.x - point1.x, point2.y - point1.y)
  }

  function handlePercentage(filledInPixels) {
      filledInPixels = filledInPixels || 0
      if (filledInPixels > config.openPercent) {
          canvas
              .parent()
              .children('.mask')
              .hide()
      }
  }

  // Only test every `stride` pixel. `stride`x faster,
  // but might lead to inaccuracy
  function getFilledInPixels(stride) {
      if (!stride || stride < 1) {
          stride = 1
      }

      var pixels = ctx.getImageData(0, 0, scratchZone.width(), scratchZone.height()),
          pdata = pixels.data,
          l = pdata.length,
          total = l / stride,
          count = 0

      // Iterate over all pixels
      for (var i = (count = 0); i < l; i += stride) {
          if (parseInt(pdata[i]) === 0) {
              count++
          }
      }

      return Math.round((count / total) * 100)
  }

  makePrizePool()
  $(".prize").attr("src", "imgs/prize/" + getRandPrize())
})