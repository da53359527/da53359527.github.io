$(document).ready(function() {
  $.getJSON('/config.json', function(config) {
    var brushImg = '/imgs/brush.png'
    var topImg = '/imgs/mask.png'

    var canvas = $('#scratch')
    var ctx = canvas[0].getContext('2d')
    var canvasWidth = canvas.width()
    var canvasHeight = canvas.height()

    var prizePool = gerenatePrizePool(config.prize)
    $('.prize').prop('src', '/imgs/prize/' + getRandPrize(prizePool))

    image = new Image()
    brush = new Image()

    image.src = topImg
    image.onload = function() {
      ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvasWidth, canvasHeight)
      $('.prize').css({ visibility: 'visible' })
    }
    brush.src = brushImg

    canvas.on('mousedown', handleMouseDown)
    canvas.on('mousemove', handleMouseMove)
    canvas.on('mouseup', handleMouseUp)

    canvas.on('touchstart', handleMouseDown)
    canvas.on('touchmove', handleMouseMove)
    canvas.on('touchend', handleMouseUp)

    var isDrawing = false
    var lastPoint

    function gerenatePrizePool(prizeList) {
      var pool = []

      prizeList.forEach((prize) => {
        for (var i = 0; i < prize.chance; i++) {
          pool.push(prize.img)
        }
      })

      return pool
    }

    function getRandPrize(prizePool) {
      var random = Math.floor(Math.random() * prizePool.length - 1)

      return prizePool[random]
    }

    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
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
        ctx.drawImage(brush, x, y)
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
      if (filledInPixels > 70) {
        canvas
          .parent()
          .children('#scratch')
          .remove()
      }
    }

    // Only test every `stride` pixel. `stride`x faster,
    // but might lead to inaccuracy
    function getFilledInPixels(stride) {
      if (!stride || stride < 1) {
        stride = 1
      }

      var pixels = ctx.getImageData(0, 0, canvasWidth, canvasHeight),
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
  })
})
