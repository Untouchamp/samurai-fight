class Sprite {
    constructor({
                    position,
                    imageSrc,
                    scale = 1,
                    framesMax = 1,
                    imageOffset = {x: 0, y:0}
                }) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 15
        this.imageOffset = imageOffset
    }

    draw() {
        let frameWidth = this.image.width / this.framesMax;
        let frameHeight = this.image.height;
        c.drawImage(
            this.image,
            this.framesCurrent * (frameWidth),
            0,
            frameWidth,
            frameHeight,
            this.position.x - this.imageOffset.x,
            this.position.y - this.imageOffset.y,
            frameWidth * this.scale,
            frameHeight * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({
                    position,
                    imageSrc,
                    isReversed = false,
                    velocity,
                    offset,
                    scale = 1,
                    framesMax = 1,
                    imageOffset = {x: 0, y:0},
                    attackBox = {
                        offset:{},
                        width: undefined,
                        height: undefined
                    },
                    sprites
                }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            imageOffset
        })
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox ={
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        };
        this.isAttacking;
        this.offset = offset;
        this.health = 100;
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites
        this.isReversed = isReversed
        this.dead = false

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc

            sprites[sprite].reversedImage = new Image()
            sprites[sprite].reversedImage.src = sprites[sprite].reversedImageSrc
        }
    }

    update() {
        this.draw()
        if (!this.dead) this.animateFrames();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height - platformHeight) {
            this.velocity.y = 0;
            this.position.y = yPositionLimit;
        }
        else this.velocity.y += gravity;
    }

    getAttackBoxAccordingToDirection() {
        if (this.lastKey === 'ArrowRight'|| this.lastKey === 'a') {
            let correctionForPlayer1 = this.isReversed ? 0 : 65
            return {
                position: {
                    x: this.position.x + (this.width + this.attackBox.offset.x) * -1 + this.offset.x + 30 + correctionForPlayer1,
                    y: this.position.y - (this.attackBox.offset.y) * -1,
                },
                offset: this.attackBox.offset,
                width: this.attackBox.width,
                height: this.attackBox.height,
            }
        // } else if (this.isReversed && keys.ArrowRight.pressed) {
        //     return this.attackBox
        } else {
            return this.attackBox
        }
    }

    attack() {
        let attackKind = 'attack1';
        // if (!this.isReversed) {  // if attack2 & attack3 enabled
        //     if (attackCountPlayer1 === 1) attackKind = 'attack1'
        //     else if (attackCountPlayer1 === 2) attackKind = 'attack2'
        //     else if (attackCountPlayer1 === 3) attackKind = 'attack3'
        // } else {
        //     if (attackCountPlayer2 === 1) attackKind = 'attack1'
        //     else if (attackCountPlayer2 === 2) attackKind = 'attack2'
        //     else if (attackCountPlayer2 === 3) attackKind = 'attack3'
        // }
        this.switchSprites(attackKind)
        this.isAttacking = true;
    }
    takeHit() {
        this.health -= this.isReversed ? 10 : Math.floor(Math.random() * 10 + 1)
        if (this.health <= 0) {
            this.switchSprites('death')
        } else {
            this.switchSprites('takeHit')
        }
    }

    switchSprites(sprite) {
        // override when fighter gets down
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1) this.dead = true
            return
        }
        // overriding all other animations with the attack animation
        if ((
                (this.image === this.sprites.attack1.image ||
                    this.image === this.sprites.attack1.reversedImage) &&
                this.framesCurrent < this.sprites.attack1.framesMax - 1)
            //  if attack 2 & attack 3 enabled
            // || (
            //     this.image === this.sprites.attack2.image &&
            //     this.framesCurrent < this.sprites.attack2.framesMax - 1
            // )
            // || (
            //     this.image === this.sprites.attack3.image &&
            //     this.framesCurrent < this.sprites.attack3.framesMax - 1
            // )
        ) {
            return
        }
        // override when fighter gets hit
        if (
            this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
        ) {
            return
        }

        switch (sprite) {
            case 'idle':
                if ((this.image !== this.sprites.idle.image) ||
                    (this.image !== this.sprites.idle.reversedImage)) {
                    if (this.lastKey === 'ArrowRight' || this.lastKey === 'a') {
                        this.image = this.sprites.idle.reversedImage
                    }
                    else {
                        this.image = this.sprites.idle.image;
                    }
                    this.framesMax =this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'run':
                const spriteImg = this.isReversed ? this.sprites.run.reversedImage : this.sprites.run.image;
                if (this.image !== spriteImg) {
                    this.image = spriteImg
                    this.framesMax =this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'reversedRun':
                const spriteReversedImg = this.isReversed ? this.sprites.run.image : this.sprites.run.reversedImage;
                if (this.image !== spriteReversedImg) {
                    this.image = spriteReversedImg
                    this.framesMax =this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'jump':
                const spriteJumpImg = this.sprites.jump.image;
                const spriteReversedJumpImg = this.sprites.jump.reversedImage;
                if (this.image !== spriteJumpImg) {
                    this.image = spriteJumpImg;
                    if ((keys.ArrowRight.pressed && this.isReversed)
                        ||
                        (keys.a.pressed && !this.isReversed)) {
                        this.image = spriteReversedJumpImg;
                    }
                    this.framesMax =this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'fall':
                const spriteFallImg = this.sprites.fall.image;
                const spriteReversedFallImg = this.sprites.fall.reversedImage;
                if (this.image !== spriteFallImg) {
                    this.image = spriteFallImg;
                    if ((keys.ArrowRight.pressed && this.isReversed)
                        ||
                        (keys.a.pressed && !this.isReversed)) {
                        this.image = spriteReversedFallImg;
                    }
                    this.framesMax =this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break
            // case 'attack1':
            //     if (this.image !== this.sprites.attack1.image) {
            //         this.image = this.sprites.attack1.image;
            //         this.framesMax =this.sprites.attack1.framesMax;
            //         this.framesCurrent = 0;
            //     }
            //     break
            case 'attack1':
                if ((this.image !== this.sprites.attack1.image) ||
                    (this.image !== this.sprites.attack1.reversedImage)) {
                    this.framesMax =this.sprites.attack1.framesMax;
                    if (this.lastKey === 'ArrowRight' || this.lastKey === 'a') {
                        this.image = this.sprites.attack1.reversedImage
                    }
                    else {
                        this.image = this.sprites.attack1.image;
                    }
                    this.framesCurrent = 0;
                }
                break
            // case 'attack2':
            //     if (this.image !== this.sprites.attack2.image) {
            //         this.image = this.sprites.attack2.image;
            //         this.framesMax =this.sprites.attack2.framesMax;
            //         this.framesCurrent = 0;
            //     }
            //     break
            // case 'attack3':
            //     if (this.image !== this.sprites.attack3.image) {
            //         this.image = this.sprites.attack3.image;
            //         this.framesMax =this.sprites.attack3.framesMax;
            //         this.framesCurrent = 0;
            //     }
            //     break
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax =this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.framesMax =this.sprites.death.framesMax;
                    this.framesCurrent = 0;
                }
                break
        }
    }
}
