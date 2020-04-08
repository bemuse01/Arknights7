const ratio = screen.height / screen.width
let words = []

const createWords = () => {
    let length = 21, textLen = 38, text = ''
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
            },
            show: {
                opening: true
            },
            time: {
                startTime: window.performance.now(),
                afterOpening: words[words.length - 1].delay + 1000
            }
        },
        computed: {
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
                for(let i = 0; i < 4; i++) {
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
            hideOpening(){
                this.show.opening = false
            },

            //main canvas
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
                        if(this.bg.points[i] * this.bg.fontSize > this.$refs.c.height && Math.random() > 0.9990) this.bg.points[i] = 0;
                        this.bg.points[i]++;
                    }else{
                        this.bg.ctx.fillText(text, (i - heightColumns) * this.bg.fontSize + this.bg.points[i] * this.bg.fontSize, this.bg.points[i] * this.bg.fontSize);
                        if(this.bg.points[i] * this.bg.fontSize < 0 && Math.random() > 0.9990) this.bg.points[i] = heightColumns + 1;
                        this.bg.points[i]--;
                    }
                }
            },

            // render
            onWindowResize(){
                this.$refs.c.width = window.innerWidth + (window.innerWidth / 2)
                this.$refs.c.height = window.innerHeight + (window.innerHeight / (2 * ratio))
            },
            timeout(callback, startTime, delay){
                let currentTime = window.performance.now()
                if(currentTime - startTime >= delay) callback()
            },
            render(){
                for(let item of this.logo.words) this.timeout(() => {this.changeWords(item)}, this.time.startTime, item.delay)
                this.timeout(this.drawCanvas, this.time.startTime, this.time.afterOpening)
            },
            animate(){
                this.render()
                requestAnimationFrame(this.animate)
            },

            // init
            init(){
                this.initCanvas()
                this.animate()
                //setTimeout(this.hideOpening, this.time.afterOpening)
                window.addEventListener('resize', this.onWindowResize, false)
            }
        }
    })
}
createWords()
init()