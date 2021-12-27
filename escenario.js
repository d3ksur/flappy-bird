    const ancho_escenario = 1280
    const alto_escenario = 720
    const velocidad_suelo = 5

    let canvas

    let piso
    let pajaro
    let tubos = []

    let caer = false

    let puntos = 0

    let font
    let audio_hit = new Audio("audio hit.ogg")
    let audio_point = new Audio("audio point.ogg")
    let audio_wing = {
        0: new Audio("audio wing.ogg"),
        1: new Audio("audio wing.ogg"),
        2: new Audio("audio wing.ogg"),
    }
    let img_piso
    let img_fondo
    let img_tubo
    let img_pajaro

    function preload(){
     font = loadFont("font.ttf")
     img_piso = loadImage("img_base.png")
      img_tubo = loadImage("img_pipe-green.png")
      img_fondo = loadImage("img_background-day.png")
      img_pajaro = [
        loadImage("img_yellowbird-downflap.png"),
        loadImage("img_yellowbird-midflap.png"),
        loadImage("img_yellowbird-upflap.png")
      ]
    }

        function setup() {
            canvas = createCanvas(ancho_escenario, alto_escenario)
            textFont(font)
            textSize(40)
            textAlign(CENTER, CENTER)
            strokeWeight(10)
            windowResired()
            piso = new Piso()
            pajaro = new Pajaro()
        }

        let contadorFotogramas = 0

        function draw() {
            background("dodgerblue")
            for(const tubo of tubos){
                tubo.dibujar()
            }
            piso.dibujar()
            pajaro.dibujar()
            if(contadorFotogramas * velocidad_suelo % 400 == 0){
            tubos.push(new Tubo())
            }
            if(caer){
                contadorFotogramas++
            }
            if(tubos[puntos] && tubos[puntos].x-pajaro.pos.x < 0){
                puntos++
                audio_point.play()
            }
            stroke("black")
            fill("white")
            text(puntos, width / 2,40)
        }
            function windowResired() {
                if(windowWidth<ancho_escenario){
                    canvas.style("transform", 'scale(${windowWidth / Width}')
                }
            }

            function keyPressed(){
            clic()
            }

            function mousePressed() {
            clic()
            }

            function clic() {
                   if(caer){
                    pajaro.aceleracion.set(createVector(0, -5))
                    audio_wing.play()
                   }else{
                    pajaro.resetearVariables()//QUE ES LO QUE ESTA ESTOCURRIENDO
                    caer = true
                    contadorFotogramas = 0
                    puntos = 0
                    tubos = []
                }
            }

            function perder(){
                if(caer){
                    audio_hit.play()
                }
                caer = false
            }

            function Tubo() {
                const distancia_entre_tubos = 150
                this.w = 100
                this.h = 600
                this.x = width
                let aleatoriedad = 300*Math.random()-150
                this.y = (height / 2) + aleatoriedad
                this.y2 = this.y -this.h - distancia_entre_tubos
                img_tubo.resize(this.w, img_tubo.height * this.w / img_tubo.width)
                this.dibujar = function(){
                    fill("green")
                    {
                        image(img_tubo, this.x, this.y)
                    }
                    rect(this.x, this.y, this.w, this.h)
                    rect(this.x, this.y2, this.w, this.h)
                    if(caer){
                        this.x -= velocidad_suelo
                    }
                }
                this.areaColision = function(){
                    return[
                        new Rectangle(this.x, this.y, this.w, this.h),
                        new Rectangle(this.x, this.y2, this.w, this.h),
                    ]
                }
            }

            function Pajaro(){
                this.r = 60
                this.resetearVariables = function () {
                    this.pos = createVector(width / 2, height / 2)
                    this.aceleracion = createVector(0, 0)
                }
                this.resetearVariables()
                this.dibujar = function(){
                    fill("orange")
                    circle(this.pos.x, this.pos.y, this.r)
                    if(caer){
                        this.aceleracion.add(createVector(0, 0.2))
                        this.pos.add(this.aceleracion)
                    }
                    if(this.areaColision().collideRect(piso.areaColision())){
                        perder()
                    }
                    for(let tubo of tubos){
                        let colisiones = tubo.areaColision()
                        for (const c of colisiones) {
                            if(this.areaColision().collideRect(c)){
                                perder()

                            }
                        }
                    }                     
                }
                this.areaColision = function(){
                    return new Circle(this.pos.x, this.pos.y, this.r)
                }
            }

            function Piso(){
                this.w = ancho_escenario
                this.h = 140
                this.x = 0
                this.y = alto_escenario - this.h
                this.dibujar = function(){
                    fill("wheat")
                    rect(this.x, this.y, this.w, this.h)
                }
                this.areaColision = function(){
                    return new Rectangle(this.x, this.y, this.w, this.h)
                }
            }