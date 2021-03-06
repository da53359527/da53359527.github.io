$(document).ready(function () {
    var container = $('.scratch-container')
    var loading = $('.loading')
    var scratchZone = $('.scratch-zone')
    var btnGroup = $('.btn-group')
    var sound = new Audio();
    sound.src = "sound/background.mp3"
    sound.loop = true

    container.width($(window).width())
    container.height((container.width() / 9) * 16)

    scratchZone.width(container.width())
    scratchZone.height(container.height())

    loading.width(container.width())
    loading.height(container.height())

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
        imageLoaded()
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
        var random = Math.floor(Math.random() * (max - min + 1)) + min

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

        var currentPoint = getMouse(e, canvas)
        var dist = distanceBetween(lastPoint, currentPoint)
        var angle = angleBetween(lastPoint, currentPoint)
        var x
        var y
        var penSize = scratchZone.width() * (config.pensize / 100)



        for (var i = 0; i < dist; i++) {
            x = lastPoint.x + Math.sin(angle) * i - 25
            y = lastPoint.y + Math.cos(angle) * i - 25
            ctx.globalCompositeOperation = 'destination-out'
            ctx.drawImage(brushImg, x, y, penSize, penSize)
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

    $(".btn-group").on("click", ".refresh", function () {
        location.reload()
    })

    $(".btn-group").on("click", ".mute", function () {
        $(this).removeClass("mute").addClass("unmute").attr("src", "imgs/unmute.png")
        sound.play()
    })

    $(".btn-group").on("click", ".unmute", function () {
        $(this).removeClass("unmute").addClass("mute").attr("src", "imgs/mute.png")
        sound.pause()
    })

    // Images loaded is zero because we're going to process a new set of images.
    var imagesLoaded = 0;
    // Total images is still the total number of <img> elements on the page.
    var totalImages = $('img').length + 1;

    // Step through each image in the DOM, clone it, attach an onload event
    // listener, then set its source to the source of the original image. When
    // that new image has loaded, fire the imageLoaded() callback.
    $('img').each(function (idx, img) {
        $('<img>').on('load', imageLoaded).attr('src', $(img).attr('src'));
    });

    // Do exactly as we had before -- increment the loaded count and if all are
    // loaded, call the allImagesLoaded() function.
    function imageLoaded() {
        imagesLoaded++;
        if (imagesLoaded == totalImages) {
            allImagesLoaded();
        }
    }

    function allImagesLoaded() {
        $('.btn-group img').css({
            "margin-left": config.buttonGap / 2 + "px",
            "margin-right": config.buttonGap / 2 + "px"
        })

        btnGroup.css({
            "left": "50%",
            "margin-left": ((btnGroup.width() / 2) * -1) + "px",
        })

        loading.fadeOut()
    }
})