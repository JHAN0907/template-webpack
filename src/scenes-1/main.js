import {Scene} from 'phaser';

export class Main extends Scene{

    constructor(){
        super('main');

        this.WIDTH = 800;
        this.HEIGHT = 600;

        this.platforms;
        this.player;
        this.cursors;
        this.stars;
        this.score = 0;
        this.scoreText;
        this.bombs;
        this.gameOver;
        this.keyR;

        this.window;
        this.windowText;
        this.windowGroup;
        this.tween;

        this.timedEvent;
        
    }

    preload(){
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('window', 'assets/button_rectangle_depth_line.png');
        this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48});
    }

    collectStar (player, star)
    {
        // star 객체 안보이게 하기
        star.disableBody(true, true);

        this.score +=10;
        this.scoreText.setText('Score: ' + this.score);

        // 활성화 되고 있는 star 객체 수 세기
        if(this.stars.countActive(true) === 0){
            this.stars.children.iterate(function(child){
                child.enableBody(true, child.x, 0, true, true);
            })
        }

        var x = (this.player.x < 400)? Phaser.Math.Between(400, 800): Phaser.Math.Between(0, 400);
        var bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        // 게임 경계면이랑 출돌하는 여부 설정
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }

    hitBomb(player, bomb){
        // 물리 시스템 정지
        this.physics.pause();
        // 플레이어 이미지 붉게 칠하기
        this.player.setTint(0xff0000);
        // 플레이어 이미지 애니메이션 'turn' 설정
        this.player.anims.play('turn');
        
        this.timedEvent = this.time.delayedCall(500, this.showGameOverText, [], this);
        
    }

    showGameOverText(){
        // 게임오버 조건 true로 설정
        this.gameOver = true;
        // 게임 오버 윈도우
        this.window = this.add.image(this.WIDTH/2,-100, 'window').setOrigin(0.5, 0.5);
        this.window.setScale(1.5);
        // 게임 오버 텍스트
        this.windowText = this.add.text(this.WIDTH/2, -100,'Game Over\n Press R for Restarting!', { fontSize: '20px', fill: '#000', fontFamily: 'Minecrafter' });
        this.windowText.setOrigin(0.5, 0.5);
        this.windowText.setAlign('center');
        this.windowGroup = this.add.group([this.window, this.windowText]);
        this.tween = this.tweens.addCounter({
            from: 0,
            to: 1,
            ease : Phaser.Math.Easing.Sine.InOut,
            duration: 1000,
            repeat: 0,
            yoyo: false,
            onUpdate: tween =>{
                const value = tween.getValue();
                const tempValue = Phaser.Math.Interpolation.Linear([this.window.displayHeight/2, this.HEIGHT/2], value);
                this.windowGroup.setY(tempValue);
            },    
        });


        // this.tween = this.tweens.chain({
        //     targets: this.windowGroup,
        //     tweens:[{
        //         // onUpdate: (tween) =>{
        //         //     tween.targets[0].setY(tween.getValue());
        //         // },
        //         y: {from: 0, to: this.HEIGHT/2,},
        //         ease: 'power3',
        //         duration: 750
        //     },
        //     {
        //         onUpdate: (tween) =>{
        //             tween.targets[0].angle(Phaser.Math.DegToRad(tween.getValue()));
        //         },
        //         value: {from: 0, to: 20},
        //         ease: Phaser.Math.Easing.Bounce.InOut,
        //         duration: 500
        //     },
        //     ],
        // }); 
    }

    create(){

        this.add.image(400, 300, 'sky');
        // 플렛폼을 관리할 객체 생성 (physics를 통한 생성)
        this.platforms = this.physics.add.staticGroup();
    
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        // 플레이어 객체 생성
        this.player = this.physics.add.sprite(100, 450, 'dude');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player, this.platforms);
    
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000', fontFamily: 'Minecrafter'});

        this.stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });
        this.physics.add.collider(this.stars, this.platforms);

        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        // 폭탄 그룹을 생성(단, 직접 폭탄 생성 X)
        this.bombs = this.physics.add.group();

        // 폭탄과 플랫폼 충돌 가능하게 설정
        this.physics.add.collider(this.bombs, this.platforms);
        // 폭탄과 플레이어와 충돌 시 발생하는 함수 설정
        this.physics.add.overlap(this.player, this.bombs, this.hitBomb, null, this);

        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    

    update(){
        if(this.gameOver){
            if(this.keyR.isDown){
                this.scene.restart();
                // this.physics.resume();
                // 플레이어 이미지 붉게 칠하기
                this.player.setTint(0x000000);
                this.gameOver = false;
            }
        }

        if (this.cursors.left.isDown)
            {
                this.player.setVelocityX(-160);
    
                this.player.anims.play('left', true);
            }
            else if (this.cursors.right.isDown)
            {
                this.player.setVelocityX(160);
    
                this.player.anims.play('right', true);
            }
            else
            {
                this.player.setVelocityX(0);
    
                this.player.anims.play('turn');
            }
    
            if (this.cursors.up.isDown && this.player.body.touching.down)
            {
                this.player.setVelocityY(-330);
            }
    }
}

// https://phaser.io/tutorials/making-your-first-phaser-3-game/part9