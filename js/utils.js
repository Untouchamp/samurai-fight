function rectangularCollision({rectangle1, rectangle2}) {
    const rect1AttackBox = rectangle1.getAttackBoxAccordingToDirection()
    // console.log(rect1AttackBox.position.x)
    // https://disk.yandex.com/i/H5EZsFbdPiMXQg
    return (
        rect1AttackBox.position.x + rect1AttackBox.width >=
        rectangle2.position.x + rectangle2.offset.x &&
        rect1AttackBox.position.x <=
        rectangle2.position.x + rectangle2.offset.x + rectangle2.width &&
        rect1AttackBox.position.y + rect1AttackBox.height >=
        rectangle2.position.y + rectangle2.offset.y &&
        rect1AttackBox.position.y <=
        rectangle2.position.y + rectangle2.offset.y+ rectangle2.height
    )
    // return (
    //     rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
    //     rectangle2.position.x + rectangle2.offset.x &&
    //     rectangle1.attackBox.position.x <=
    //     rectangle2.position.x + rectangle2.offset.x + rectangle2.width &&
    //     rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
    //     rectangle2.position.y + rectangle2.offset.y &&
    //     rectangle1.attackBox.position.y <=
    //     rectangle2.position.y + rectangle2.offset.y+ rectangle2.height
    // )
}

function horizontalMovementHandler (isLeftPressed, isLeftWasLastKey, isRightPressed, isRightWasLastKey, player) {
    if (isLeftPressed && isLeftWasLastKey) {
        player.velocity.x = -4;
        player.switchSprites('reversedRun')
    }
    else if (isRightPressed && isRightWasLastKey) {
        player.velocity.x = 4;
        player.switchSprites('run')
    } else {
        player.switchSprites('idle')
    }
    if (player.velocity.y < 0) {
        player.switchSprites('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprites('fall')
    }
}

function attackingHandler ({player1, player2, player2HealthLocator}) {
    if (rectangularCollision({
            rectangle1: player1,
            rectangle2: player2
        }) &&
        player1.isAttacking && player1.framesCurrent === player1.sprites.attack1.attackFrame
    ) {
        player1.isAttacking = false
        player2.takeHit()
        gsap.to(player2HealthLocator, {
            width: player2.health > 0 ? player2.health + "%" : "0%"
        })
    }

    if (player1.isAttacking && player1.framesCurrent === player1.sprites.attack1.attackFrame) {
        player1.isAttacking = false
    }
}

function determineWinner({player1, player2, timerId}) {
    clearTimeout(timerId)
    const displayTextElem = document.querySelector("#displayText");
    document.querySelector("#displayBlock").style.display = 'flex';
    if (player1.health === player2.health) {
        displayTextElem.innerHTML = "TIE";
    } else if (player1.health > player2.health) {
        displayTextElem.innerHTML = "PLAYER 1 WINS";
    } else if (player1.health < player2.health) {
        displayTextElem.innerHTML = "PLAYER 2 WINS";
    }
}

let timer = 60
let timerId
function decreaseTimer() {
    // End Game Based On Timer
    const timerElem = document.querySelector("#timer");
    if (timer === 0) {
        timerElem.innerHTML = "0";
        determineWinner({
            player1: player,
            player2: enemy,
            timerId
        })
    }
    if (timer>0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timerElem.innerHTML = `${timer--}`;
    }
}

function getAttackImgSrc(number) {
    return `./img/fantasy-warrior/Attack${number}.png`
}