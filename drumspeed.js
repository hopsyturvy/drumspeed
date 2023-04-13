let { Engine, Render, World, Bodies, Body, Events } = Matter;
let engine = Engine.create();
let world = engine.world;
let drumspeed = 0;

const windowwidth = window.innerWidth;
const windowheight = window.innerHeight;
let appwidth;
let appheight;

window.onload = function () {

    const speedslider = document.getElementById("speedslider");
    speedslider.addEventListener('input', changeSpeed);
    window.addEventListener("resize", resizeApp)

    let wheel;
    let wheelradius;
    let flightlength;
    let unitlength;
    let unitwidth;
    let beanradius;
    let mobileuser;

    checkMobile();
    resizeApp();
    animate();
}


function checkMobile () {
    myfunction() {
         if (navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)) {
            mobileuser = true ;
         } else {
            mobileuser = false ;
         }
    
    
}

function resizeApp () {

    let appwrapper = document.getElementById("app-container");
    let appcontrols = document.getElementById("controls");
    appwidth = Math.min(appwrapper.clientWidth, windowwidth - 1)
    appheight = Math.min(appwidth, windowheight - appcontrols.clientHeight - 40)
    wheelradius = (Math.min(appwidth, appheight) - 20) * 0.4
    flightlength = wheelradius * 40 / 240
    unitlength = wheelradius * 10 / 240
    unitwidth = wheelradius * 12 / 240
    beanradius = wheelradius * 8 / 240
}



function changeSpeed() {
    let sliderposition = speedslider.value + "%"
    document.getElementById('slider-selection').style.width=sliderposition;
    document.getElementById('slider-handle').style.left=sliderposition;
    drumspeed = speedslider.value * 0.0005;
    styleText(speedslider.value);
}

function styleText(speed) {

    let explanationtext = document.getElementById('explanation-text')
    let slowtext = document.getElementById('slow-text')
    let mediumtext = document.getElementById('medium-text')
    let fasttext = document.getElementById('fast-text')

    if (speed < 34) {
        explanationtext.innerHTML="Bean pile sits at the bottom of the drum, beans poorly mixed"
        slowtext.style.opacity = 100 - (Math.abs(speed - 17) * 100 / 34) + '%'
        mediumtext.style.opacity = '50%'
        fasttext.style.opacity = '50%'

    } else if (speed < 67) {
        explanationtext.innerHTML="The happy medium: rotation lifts beans into the air"
        mediumtext.style.opacity = 100 - (Math.abs(speed - 50) * 100 / 34) + '%'
        slowtext.style.opacity = '50%'
        fasttext.style.opacity = '50%'

    } else {
        explanationtext.innerHTML="Centrifugal forces pin beans to drum wall"
        fasttext.style.opacity = 100 - (Math.abs(speed - 83) * 100 / 34) + '%'
        mediumtext.style.opacity = '50%'
        slowtext.style.opacity = '50%'
    }

    if (speed > 24 && speed < 44) {
        explanationtext.style.opacity = (Math.abs(speed - 34) * 100 / 10) + '%'

    } else if (speed > 57 && speed < 77) {
        explanationtext.style.opacity = (Math.abs(speed - 67) * 100 / 10) + '%'

    } else {
        explanationtext.style.opacity = '100%'
    }

}

function animate() {

    // create a renderer
    let render = Render.create({
        element: document.getElementById('appwindow'),
        engine: engine,
        options: {
            width: appwidth,
            height: appheight,
            wireframes: false,
            background: "#fff",
            showAngleIndicator: false,
        }
    });

    let parts = [];
    let bodies = [];
    for (let i = 0; i < 180; i++) {

        if (i == 0 | i == 30 | i == 60 | i == 90 | i == 120 | i == 150) {
            let a = Bodies.rectangle(
                appwidth / 2 + Math.cos(i * 2 * Math.PI / 180) * (wheelradius - (flightlength / 2)),
                appheight / 2 + Math.sin(i * 2 * Math.PI / 180) * (wheelradius - (flightlength / 2)),
                flightlength,
                unitwidth,
                {
                    isStatic: true,
                    friction: 0.1,

                    angle: Math.PI / 180 * i * 2,
                    render: {
                        fillStyle: "#333",
                        strokeStyle: "#fff",
                        lineWidth: 0
                    },
                    chamfer: {
                        radius: [wheelradius * 4 / 240, 0, 0, wheelradius * 4 / 240]
                    }
                }
            );
            parts.push(a);
            World.add(engine.world, a);
        } else {
            let a = Bodies.rectangle(
                appwidth / 2 + Math.cos(i * 2 * Math.PI / 180) * (wheelradius - (unitlength / 2)),
                appheight / 2 + Math.sin(i * 2 * Math.PI / 180) * (wheelradius - (unitlength / 2)),
                unitlength,
                unitwidth,
                {
                    isStatic: true,
                    friction: 0,

                    angle: Math.PI / 180 * i * 2,
                    render: {
                        fillStyle: "#333",
                        strokeStyle: "#fff",
                        lineWidth: 0
                    }
                }
            );
            parts.push(a);
            World.add(engine.world, a);
        }

    }

    wheel = Body.create({ parts, isStatic: true });




    draw();

    if (mobileuser == false) {
    for (let i = 0; i < 180; ++i) {
        let beancolour = "hsl(" + Math.random() * 360 + ", 40%, 65%)"
        addCircle({
            //x: appwidth / 2 - ( i - 90) * wheelradius * 0.008,
            //y: appheight / 2 + ( i - 90) * wheelradius * 0.008,

            x: appwidth / 2 + Math.cos(i * 2 * Math.PI / 180) * (wheelradius * i / 200),
            y: appheight / 2 + Math.sin(i * 2 * Math.PI / 180) * (wheelradius * i / 200),


            r: beanradius * 0.9 ,
            options: {
                mass: 0.001,
                friction: 0,
                frictionStatic: 0,

                //slop: 0.5,
                //friction: 1,
                //frictionStatic: Infinity,

                label: 'ball',

                render: {
                    opacity: 0.6,
                    fillStyle: beancolour,
                    strokeStyle: "#555",
                    lineWidth: 1
                },

                collisionFilter: {
                    category: 0x0002,
                    mask: 0x0002 | 0x0001
                }
            }
        });
    }
    }

    for (let i = 0; i < 120; ++i) {
        let beancolour = "hsl(" + Math.random() * 360 + ", 40%, 65%)"
        addCircle({
            x: appwidth / 2 + Math.cos(i * 2 * Math.PI / 180) * (wheelradius * i / 150),
            y: appheight / 2 + Math.sin(i * 2 * Math.PI / 180) * (wheelradius * i / 150),
            r: beanradius,
            options: {
                mass: 0.001,
                friction: 0,
                frictionStatic: 0,
                // frictionStatic: 5,

                label: 'ball',

                render: {
                    opacity: 1,
                    fillStyle: beancolour,
                    strokeStyle: "#555",
                    lineWidth: 1
                },

                collisionFilter: {
                    category: 0x0004,
                    mask: 0x0004 | 0x0001
                }
            }
        });
    }


    // add all of the bodies to the world
    World.add(engine.world, bodies);


    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);
}

function addBody(...bodies) {
    World.add(engine.world, bodies);
}

function addCircle({ x = 0, y = 0, r = 10, options = {} } = {}) {
    let body = Bodies.circle(x, y, r, options);
    addBody(body);
    return body;
}

function draw() {
    window.requestAnimationFrame(draw);

    //set rotation
    Matter.Body.rotate(wheel, drumspeed, updateVelocity = false)
    Matter.Body.setAngularVelocity(wheel, drumspeed)
}




