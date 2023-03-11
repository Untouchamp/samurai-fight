const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');
const gravity = 0.7;
const platformHeight = 90;
const jumpLimit = 500;
let attackCountPlayer1 = 1;
let attackCountPlayer2 = 1;

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: "./img/background.png"
})
//
// const shop = new Sprite({
//     position: {
//         x: 590,
//         y: 390,
//     },
//     imageSrc: "./img/shop.png",
//     scale: 0.5,
//     framesMax: 6
// })

const player = new Fighter({
    position: {
        x:0,
        y: 0
    },
    velocity: {
        x:0,
        y:10
    },
    offset: {
        x: 130,
        y: 15
    },
    isReversed: false,
    imageSrc: "./img/wizard/Idle.png",
    // scale: 1.5, //wizard
    scale: 2.75,
    // scale: 1,
    framesMax: 6,
    // imageOffset: {x: 70, y: 60}, //wizard
    imageOffset: {x: 70, y: 127},
    sprites: {
        idle: {
            // imageSrc: "./img/wizard/Idle.png",
            // reversedImageSrc: "./img/wizard/IdleReversed.png",
            // framesMax: 6
            imageSrc: "./img/fantasy-warrior/Idle.png",
            reversedImageSrc: "./img/fantasy-warrior/IdleReversed.png",
            framesMax: 10
        },
        run: {
            // imageSrc: "./img/wizard/Run.png",
            // reversedImageSrc: "./img/wizard/RunReversed.png",
            // framesMax: 8
            imageSrc: "./img/fantasy-warrior/Run.png",
            reversedImageSrc: "./img/fantasy-warrior/RunReversed.png",
            framesMax: 8
        },
        jump: {
            // imageSrc: "./img/wizard/Jump.png",
            // reversedImageSrc: "./img/wizard/JumpReversed.png",
            // framesMax: 2
            imageSrc: "./img/fantasy-warrior/Jump.png",
            reversedImageSrc: "./img/fantasy-warrior/JumpReversed.png",
            framesMax: 3
        },
        fall: {
            // imageSrc: "./img/wizard/Fall.png",
            // reversedImageSrc: "./img/wizard/FallReversed.png",
            // framesMax: 2
            imageSrc: "./img/fantasy-warrior/Fall.png",
            reversedImageSrc: "./img/fantasy-warrior/FallReversed.png",
            framesMax: 3
        },
        attack1: {
            // imageSrc: "./img/wizard/Attack1.png",
            // reversedImageSrc: "./img/wizard/Attack1.png",
            // framesMax: 8
            imageSrc: `./img/fantasy-warrior/Attack1.png`,
            reversedImageSrc: "./img/fantasy-warrior/Attack1Reversed.png",
            framesMax: 7,
            attackFrame: 5
        },
        // attack2: {
        //     // imageSrc: "./img/wizard/Attack2.png",
        //     // reversedImageSrc: "./img/wizard/Attack2.png",
        //     // framesMax: 8
        //     imageSrc: `./img/fantasy-warrior/Attack2.png`,
        //     reversedImageSrc: "./img/fantasy-warrior/Attack2.png",
        //     framesMax: 7
        // },
        // attack3: {
        //     // imageSrc: "./img/wizard/Attack2.png",
        //     // reversedImageSrc: "./img/wizard/Attack2.png",
        //     // framesMax: 8
        //     imageSrc: `./img/fantasy-warrior/Attack3.png`,
        //     reversedImageSrc: "./img/fantasy-warrior/Attack3.png",
        //     framesMax: 8
        // },
        takeHit: {
            imageSrc: './img/fantasy-warrior/TakeHitWhite.png',
            reversedImageSrc: './img/fantasy-warrior/TakeHitReversed.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/fantasy-warrior/Death.png',
            reversedImageSrc: './img/fantasy-warrior/DeathReversed.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset:{
            x: 170,
            y: 50
        },
        width: 130,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x:0,
        y:10
    },
    offset: {
        x: 70,
        y: 15
    },
    isReversed: true,
    imageSrc: "./img/enemy-idle.png",
    // scale: 1,
    scale: 2.3,
    framesMax: 4,
    imageOffset: {x: 130, y: 143},
    sprites: {
        idle: {
            imageSrc: "./img/red-mask-samurai/IdleReversed.png",
            reversedImageSrc: "./img/red-mask-samurai/Idle.png",
            framesMax: 4
        },
        run: {
            imageSrc: "./img/red-mask-samurai/RunReversed.png",
            reversedImageSrc: "./img/red-mask-samurai/Run.png",
            framesMax: 8
        },
        jump: {
            imageSrc: "./img/red-mask-samurai/JumpReversed.png",
            reversedImageSrc: "./img/red-mask-samurai/Jump.png",
            framesMax: 2
        },
        fall: {
            imageSrc: "./img/red-mask-samurai/FallReversed.png",
            reversedImageSrc: "./img/red-mask-samurai/Fall.png",
            framesMax: 2
        },
        attack1: {
            imageSrc: "./img/red-mask-samurai/Attack1Reversed.png",
            reversedImageSrc: "./img/red-mask-samurai/Attack1.png",
            framesMax: 4,
            attackFrame: 2
        },
        // attack2: {
        //     // imageSrc: "./img/wizard/Attack2.png",
        //     // reversedImageSrc: "./img/wizard/Attack2.png",
        //     // framesMax: 8
        //     imageSrc: `./img/red-mask-samurai/Attack2Reversed.png`,
        //     reversedImageSrc: "./img/red-mask-samurai/Attack2.png",
        //     framesMax: 4
        // },
        // attack3: {
        //     // imageSrc: "./img/wizard/Attack2.png",
        //     // reversedImageSrc: "./img/wizard/Attack2.png",
        //     // framesMax: 8
        //     imageSrc: `./img/red-mask-samurai/Attack2Reversed.png`,
        //     reversedImageSrc: "./img/red-mask-samurai/Attack2.png",
        //     framesMax: 4
        // },
        takeHit: {
            imageSrc: './img/red-mask-samurai/TakeHitReversedWhite.png',
            reversedImageSrc: './img/red-mask-samurai/TakeHitWhite.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/red-mask-samurai/DeathReversed.png',
            reversedImageSrc: './img/red-mask-samurai/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset:{
            x: -90,
            y: 50
        },
        width: 150,
        height: 50
    }
})

function clearCanvas() {
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);
}

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}



decreaseTimer()

function animate() {
    clearCanvas();
    background.update();
    // shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    horizontalMovementHandler(
        keys.a.pressed,
        player.lastKey === 'a',
        keys.d.pressed,
        player.lastKey === 'd',
        player);
    horizontalMovementHandler(
        keys.ArrowLeft.pressed,
        enemy.lastKey === 'ArrowLeft',
        keys.ArrowRight.pressed,
        enemy.lastKey === 'ArrowRight',
        enemy);

    attackingHandler({
        player1: player,
        player2: enemy,
        player2HealthLocator: "#enemyHealth"
    });
    attackingHandler({
        player1: enemy,
        player2: player,
        player2HealthLocator: "#playerHealth"
    });

    // End Game Based Of Health
    if (player.health <= 0 || enemy.health <= 0) {
        determineWinner({
            player1: player,
            player2: enemy,
            timerId
        })
    }

    window.requestAnimationFrame(animate);
}

animate()

window.addEventListener('keydown', (e) => {
    if (!player.dead) {
        switch (e.key) {
            //PLAYER KEYS
            case 'w':
                player.velocity.y = -20;
                break
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a'
                break
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd'
                break
            case ' ':
                player.attack();
                if (attackCountPlayer1 < 3) {
                    attackCountPlayer1++
                } else {
                    attackCountPlayer1 = 1
                }
                break
        }
    }
    if (!enemy.dead) {
        switch (e.key) {
            // ENEMY KEYS
            case 'ArrowUp':
                enemy.velocity.y = -20;
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight'
                break
            case '.':
            case '0':
            case 'ArrowDown':
                enemy.attack();
                if (attackCountPlayer2 < 3) {
                    attackCountPlayer2++
                } else {
                    attackCountPlayer2 = 1
                }
                break
        }
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        //PLAYER KEYS
        case 'w':
            keys.w.pressed = false;
            break
        case 'a':
            keys.a.pressed = false;
            if (keys.d.pressed) player.lastKey = 'd'
            break
        case 'd':
            keys.d.pressed = false;
            if (keys.a.pressed) player.lastKey = 'a'
            break

        // ENEMY KEYS
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            if (keys.ArrowRight.pressed) enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            if (keys.ArrowLeft.pressed) enemy.lastKey = 'ArrowLeft'
            break
    }
})

document.querySelector("#restart").addEventListener('click', () =>{
    location.reload();
})

// https://www.youtube.com/watch?v=vyqbNFMDRGQ&ab_channel=ChrisCourses 2:36:38