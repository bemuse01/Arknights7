const ratio = screen.height / screen.width
let words = []
let hex = {
    cols: [],
    style: null,
    ratio: 130 / 150
}

const createWords = () => {
    let length = 25, textLen = 44, text = '' // 21 38
    for(let i = 0; i < textLen; i++) text += ' '
    for(let i = 0; i < length; i++){
        words[i] = {
            key: i,
            text: text,
            len: text.length,
            index: 0,
            delay: i * 120 + 2000
        }
    }
}
const createHexagons = () => {
    let size = Math.floor(window.innerWidth / 12)
    let hexagonWidth = size, hexagonHeight = Math.round(hexagonWidth * hex.ratio),
        w = hexagonWidth / 2, h = hexagonHeight / 2, g = Math.floor(window.innerWidth / 120),
        dw = w ** 2, dh = h ** 2, a = Math.sqrt(dw - dh),
        b = w - a, db = b ** 2, c = Math.sqrt(dh + db),
        nw = Math.floor((window.innerWidth + c) / (c + hexagonWidth)) + 1,
        nh = Math.floor((window.innerHeight + g) / (g + hexagonHeight)) + 1,
        tWidth = c * (nw - 1) + hexagonWidth * nw,
        tHeight = g * (nh - 1) + hexagonHeight * nh,
        pGap = Math.sqrt((g ** 2) - (g / 2) ** 2),
        tGap = c + pGap + b

    hex.style = {width: `${tWidth}px`, height: `${tHeight + (h + g / 2)}px`}
    for(let i = 0; i < nw * 2 - 1; i++){
        let shapes = []
        for(let j = 0; j < nh; j++){
            shapes[j] = {
                key: j,
                style: {
                    width: `${hexagonWidth}px`,
                    height: `${hexagonHeight}px`,
                    marginBottom: j == nh - 1 ? "0" : `${g}px`,
                    background: `url('./image/source/hex.png') no-repeat center center / cover`,
                    opacity: 0.25
                }
            }
        }
        if(i % 2 == 0){
            hex.cols[i] = {
                key: i,
                style: {
                    width: `${hexagonWidth}px`, 
                    height: `${tHeight}px`,
                    left: i == 0 ? "0" : `${(c + (pGap * 2) + hexagonWidth) * (i / 2)}px`, 
                },
                hexs: shapes
            }
        }else{
            hex.cols[i] = {
                key: i,
                style: {
                    width: `${hexagonWidth}px`, 
                    height: `${tHeight}px`,
                    top: `${h + g / 2}px`,
                    left: i == 1 ? `${tGap}px` : `${(c + (pGap * 2) + hexagonWidth) * Math.floor(i / 2) + tGap}px`, 
                },
                hexs: shapes
            }
        }
    }
    console.log(tWidth, tHeight, nw, nh, c, hex.cols)
}
const init = () => {
    new Vue({
        el: '#wrap',
        data: {
            logo: {
                words: words,
                randoms: "qwertyuiopasdfghjklzxcvbnm1234567890".split("")
            },
            bg: {
                ctx: null,
                columns: 0,
                points: [],
                fontSize: 11,
                randoms: `qwerttyuiop[]{}asdfghjkl;':"zxcvbnm,./<>1234567890-=\\~!@#$%^&*()_+|QWERTYUIOPASDFGHJKLZXCVBNM`.split(""),
                chance: 0.9990
            },
            hexagon: {
                cols: hex.cols
            },
            show: {
                bg: false,
                time: false
            },
            time: {
                startTime: window.performance.now(),
                afterOpening: words[words.length - 1].delay + 1000,
                ms: 0,
                sec: 0,
                min: 0,
                hour: 0
            },
            style: {
                hexagon: hex.style
            }
        },
        computed: {
            currentTime(){
                this.time.ms = this.time.ms < 10 ? "00" + this.time.ms : this.time.ms < 100 ? "0" + this.time.ms : this.time.ms
                this.time.sec = this.time.sec < 10 ? "0" + this.time.sec : this.time.sec
                this.time.min = this.time.min < 10 ? "0" + this.time.min : this.time.min
                this.time.hour = this.time.hour < 10 ? "0" + this.time.hour : this.time.hour
                return `${this.time.hour}:${this.time.min}:${this.time.sec}:${this.time.ms}`
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            // opening
            changeWords(item){
                /*let char = this.generateRandomChar()
                if(item.index < item.len) {
                    item.text = this.replaceStr(item.index, char, item.text)
                    item.index++
                }
                this.resetCurrentLen(item)*/
                for(let i = 0; i < 5; i++) {
                    let char = this.generateRandomChar()
                    let random = Math.floor(Math.random() * item.len)
                    item.text = this.replaceStr(random, char, item.text)
                }
            },
            generateRandomChar(){
               return this.logo.randoms[Math.floor(Math.random() * this.logo.randoms.length)]
            },
            replaceStr(i, rep, sen){
                return `${sen.substr(0, i)}${rep}${sen.substr(i + rep.length)}`
            },
            /*resetCurrentLen(item){
                if(item.index == item.len) {
                    if(Math.random() > 0.75) item.index = 0
                }
            },*/

            // main canvas
            initCanvas(){
                this.$refs.c.width = window.innerWidth + (window.innerWidth / 2)
                this.$refs.c.height = window.innerHeight + (window.innerHeight / (2 * ratio))
                let ctx = this.$refs.c.getContext("2d")
                this.bg.ctx = ctx
                this.bg.columns = Math.floor(c.width / this.bg.fontSize) + Math.floor(c.height / this.bg.fontSize)
                for(let i = 0; i < this.bg.columns; i++) this.bg.points[i] = i % 2 == 0 ? 0 : Math.floor(this.$refs.c.height / this.bg.fontSize) + 1
                console.log(this.bg, this.$refs.c)
            },
            drawCanvas(){
                this.bg.ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
                this.bg.ctx.fillRect(0, 0, this.$refs.c.width, this.$refs.c.height)
                this.bg.ctx.globalAlpha = 1.0
                this.bg.ctx.fillStyle =  "rgba(255, 0, 0, 1.0)"
                this.bg.ctx.font = this.bg.fontSize + "px arial"
                for(let i = 0; i < this.bg.points.length; i++) {
                    let text = this.bg.randoms[Math.floor(Math.random() * this.bg.randoms.length)]
                    let heightColumns = Math.floor(this.$refs.c.height / this.bg.fontSize)
                    if(i % 2 == 0){
                        this.bg.ctx.fillText(text, (i - heightColumns) * this.bg.fontSize + this.bg.points[i] * this.bg.fontSize, this.bg.points[i] * this.bg.fontSize);
                        if(this.bg.points[i] * this.bg.fontSize > this.$refs.c.height && Math.random() > this.bg.chance) this.bg.points[i] = 0;
                        this.bg.points[i]++;
                    }else{
                        this.bg.ctx.fillText(text, (i - heightColumns) * this.bg.fontSize + this.bg.points[i] * this.bg.fontSize, this.bg.points[i] * this.bg.fontSize);
                        if(this.bg.points[i] * this.bg.fontSize < 0 && Math.random() > this.bg.chance) this.bg.points[i] = heightColumns + 1;
                        this.bg.points[i]--;
                    }
                }
            },

            // hexagon
            resizeHexagon(){
                this.hexagon.cols.length = 0

                let size = Math.floor(window.innerWidth / 12)
                let hexagonWidth = size, hexagonHeight = Math.round(hexagonWidth * hex.ratio),
                    w = hexagonWidth / 2, h = hexagonHeight / 2, g = Math.floor(window.innerWidth / 120),
                    dw = w ** 2, dh = h ** 2, a = Math.sqrt(dw - dh),
                    b = w - a, db = b ** 2, c = Math.sqrt(dh + db),
                    nw = Math.floor((window.innerWidth + c) / (c + hexagonWidth)) + 1,
                    nh = Math.floor((window.innerHeight + g) / (g + hexagonHeight)) + 1,
                    tWidth = c * (nw - 1) + hexagonWidth * nw,
                    tHeight = g * (nh - 1) + hexagonHeight * nh,
                    pGap = Math.sqrt((g ** 2) - (g / 2) ** 2),
                    tGap = c + pGap + b
                
                this.style.hexagon = {width: `${tWidth}px`, height: `${tHeight + (h + g / 2)}px`}
                for(let i = 0; i < nw * 2 - 1; i++){
                    let shapes = []
                    for(let j = 0; j < nh; j++){
                        shapes[j] = {
                            key: j,
                            style: {
                                width: `${hexagonWidth}px`,
                                height: `${hexagonHeight}px`,
                                marginBottom: j == nh - 1 ? "0" : `${g}px`,
                                background: `url('./image/source/hex.png') no-repeat center center / cover`,
                                opacity: 0.25
                            }
                        }
                    }
                    if(i % 2 == 0){
                        this.hexagon.cols[i] = {
                            key: i,
                            style: {
                                width: `${hexagonWidth}px`, 
                                height: `${tHeight}px`,
                                left: i == 0 ? "0" : `${(c + (pGap * 2) + hexagonWidth) * (i / 2)}px`, 
                            },
                            hexs: shapes
                        }
                    }else{
                        this.hexagon.cols[i] = {
                            key: i,
                            style: {
                                width: `${hexagonWidth}px`, 
                                height: `${tHeight}px`,
                                top: `${h + g / 2}px`,
                                left: i == 1 ? `${tGap}px` : `${(c + (pGap * 2) + hexagonWidth) * Math.floor(i / 2) + tGap}px`, 
                            },
                            hexs: shapes
                        }
                    }
                }
                console.log(tWidth, tHeight, nw, nh)
            },

            // show
            appearTime(){
                this.show.time = true
            },
            appearBackground(){
                this.show.bg = true
            },
            appearApps(){
                //this.appearBackground()
                this.appearTime()
            },

            // time
            updateCurrentTime(){
                let date = new Date()
                this.time.ms = date.getMilliseconds()
                this.time.sec = date.getSeconds()
                this.time.min = date.getMinutes()
                this.time.hour = date.getHours()
            },

            // render
            onWindowResize(){
                this.$refs.c.width = window.innerWidth + (window.innerWidth / 2)
                this.$refs.c.height = window.innerHeight + (window.innerHeight / (2 * ratio))
                this.resizeHexagon()
            },
            timeout(callback, startTime, delay){
                let currentTime = window.performance.now()
                if(currentTime - startTime >= delay) callback()
            },
            render(){
                for(let item of this.logo.words) this.timeout(() => {this.changeWords(item)}, this.time.startTime, item.delay)
                this.timeout(this.drawCanvas, this.time.startTime, this.time.afterOpening)
                this.updateCurrentTime()
            },
            animate(){
                this.render()
                requestAnimationFrame(this.animate)
            },

            // init
            init(){
                this.initCanvas()
                this.appearApps()
                this.animate()
                window.addEventListener('resize', this.onWindowResize, false)
            }
        }
    })
}
createWords()
createHexagons()
init()