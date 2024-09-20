export class Main extends Phaser.Scene
{
    // mouseY = 0;
    // mouseX = 0;
    // isDown = false;

    lastFired = 0;
    player_lastFired = 0;
    stats;
    speed;
    ship;
    bullets;
    enemy_bullets;
    //bullets
    player_bullets;
    gameWidth = 300;
    gameHeight = 400;

    player;
    playerState =1;
    starts;
    keyboard;
    keyW;
    keyA;
    keyS;
    keyD;
    keySpace;
    keyShift;
    keyR;
    
    playerDefaultSpeed;
    playerSlow;
    playerDefaultSlow;

    gameOver = false;
    timedEvent;
    superTime = false;

    constructor(){
        super("main");
    }
    preload ()
    {
        this.load.image('ship', 'assets/ship.png');
        this.load.image('bullet1', 'assets/bullets/bullet11.png');
        this.load.image('bullet2', 'assets/bullets/bullet7.png');
        this.load.image('bullet3', 'assets/bullets/bullet4.png');
        this.load.image('player', 'assets/shooting/player_ship.png');
        this.load.image('heart', 'assets/shooting/pixel_heart.png');
        this.load.image('background', 'assets/shooting/deep-space.jpg');
    }

    create ()
    {
        // 탄 피격 범위 실험실
        // const r3 = this.add.rectangle(150, 380, 12, 30,  0x0000ff).setDepth(12);
        // const testImage = this.add.image(150, 380, "bullet3").setDepth(13);
        // testImage.setRotation(3*Math.PI/2);
        // testImage.setScale(0.5);

        // 플레이어 속도 조절 변수
        this.playerDefaultSpeed = 80;
        this.playerSlow = 1;
        this.playerDefaultSlow = 1/2;

        // this.keyboard =  this.input.keyboard.createCursorKeys();
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        
        this.ship = this.add.sprite(this.gameWidth/2, 100, 'ship').setDepth(1);
        this.ship.setScale(1/2);
        class Bullet extends Phaser.Physics.Arcade.Image
        {
            constructor (scene)
            {
                super(scene, 0, 0, 'bullet3');

                this.incX = 0;
                this.incY = 0;
                this.lifespan = 0;

                this.speed = Phaser.Math.GetSpeed(100, 1);
                this.setScale(0.5);
                

            }

            fire (x, y, main_x, main_y, speed = 100)
            {
                this.setActive(true);
                this.setVisible(true);
                // bullet3 피격 범위 (12, 30)
                this.setBodySize(12, 30);

                //  Bullets fire from the middle of the screen to the given x/y
                this.setPosition(main_x, main_y);

                const angle = Phaser.Math.Angle.Between(x, y, main_x, main_y);

                this.setRotation(angle + Math.PI);

                this.incX = Math.cos(angle);
                this.incY = Math.sin(angle);

                // 1000 당 1초
                this.lifespan = 10*1000;

                this.speed = Phaser.Math.GetSpeed(speed, 1);
            }

            update (time, delta)
            {
                this.lifespan -= delta;

                this.x -= this.incX * (this.speed * delta);
                this.y -= this.incY * (this.speed * delta);

                // if(this.lifespan < 0){
                //     this.setActive(false);
                //     this.setVisible(false);
                // }
                if(this.x < -100 || this.x > this.gameWidth + 100 || this. y < -100 || this.y > this.gameHeight + 100)
                {
                    // console.log("i am die");
                    this.setActive(false);
                    this.setVisible(false);
                }
            }
        }

        class PlayerBullet extends Phaser.Physics.Arcade.Image
        {
            constructor (scene)
            {
                super(scene, 0, 0, 'bullet3');

                this.incX = 0;
                this.incY = 0;
                this.lifespan = 0;

                this.speed = Phaser.Math.GetSpeed(100, 1);
                this.setScale(0.5);
                this.setAlpha(0.5);

            }

            fire (x, y, main_x, main_y, speed = 100)
            {
                this.setActive(true);
                this.setVisible(true);

                //  Bullets fire from the middle of the screen to the given x/y
                this.setPosition(main_x, main_y);

                const angle = Phaser.Math.Angle.Between(x, y, main_x, main_y);

                this.setRotation(angle + Math.PI);

                this.incX = Math.cos(angle);
                this.incY = Math.sin(angle);

                // 1000 당 1초
                this.lifespan = 10*1000;

                this.speed = Phaser.Math.GetSpeed(speed, 1);
            }

            update (time, delta)
            {
                this.lifespan -= delta;

                this.x -= this.incX * (this.speed * delta);
                this.y -= this.incY * (this.speed * delta);

                // if(this.lifespan < 0){
                //     this.setActive(false);
                //     this.setVisible(false);
                // }
                if(this.x < -100 || this.x > this.gameWidth + 100 || this. y < -100 || this.y > this.gameHeight + 100)
                {
                    // console.log("i am die");
                    this.setActive(false);
                    this.setVisible(false);
                }
            }
        }
        

        this.enemy_bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 10000,
            runChildUpdate: true
        });

        this.player_bullets = this.physics.add.group({
            classType: PlayerBullet,
            maxSize:1000,
            runChildUpdate: true,
        })

        // 게임 중력 조절
        this.physics.world.gravity.y = 0;

        this.player = this.physics.add.sprite(this.gameWidth/2, this.gameHeight-50, 'player').setDepth(1);
        this.player.setScale(1);
        this.player.setOrigin(0.5, 0.5);
        this.player.setAlpha(0.5);

        this.heart = this.physics.add.sprite(this.player.x, this.player.y, 'heart').setDepth(2);
        this.heart.setOrigin(0.5, 0.5);
        this.heart.setScale(1/200);
        this.heart.setCollideWorldBounds(true);
        this.heart.setBodySize(5, 5);

        this.stars = this.add.blitter(0, 0, 'background');
        this.stars.create(0, 0);
        this.stars.create(0, -512);

        this.physics.world.setBounds(0, 0, this.gameWidth, this.gameHeight);

        // 적 총알과 플레이어가 겹쳤을 때 
        this.physics.add.overlap(this.heart, this.enemy_bullets, (heart, bullet) =>
        {
            const { x, y } = bullet.body.center;
            console.log(this.playerState);
            if(!this.superTime){
                this.playerState -= 1;
                this.superTime = true;
                this.player.setTint(0x0000FF);
                this.timedEvent = this.time.delayedCall(3000, this.onEvent, [], this);
            }
            
            bullet.setActive(false);
            bullet.setVisible(false);
            // this.plasma.setSpeedY(0.2 * bullet.body.velocity.y).emitParticleAt(x, y);
            // this.plasma.emitParticleAt(x, y);

            if (this.playerState <= 0)
            {
                this.gameOver = true;
                this.player.setTint(0xFF0000);
                if(this.keyR.isDown){
                    this.scene.restart();
                    this.superTime = false;
                    this.gameOver = false;
                    this.playerState = 1;

                }
            }
        });

    }

    onEvent(){
        this.superTime = false;
        this.player.setTint(0xFFFFFF);
    }
    update (time, delta)
    {
        // 적 탄환 발사 로직
        if ( time > this.lastFired)
        {
            let lineNum = 8;
            let bulletInterval = 100;
            for (let i = 0; i < lineNum; i++)
            {
                // 총알 하나 가져오기
                const bullet = this.enemy_bullets.get();
                /*
                    총알이 발사되는 방향 계산하는 식
                    1. 사방으로 퍼져나가는 방향 계산 : Math.cos(i*(2*Math.PI/lineNum))
                    2. 퍼져나가는 방향에 변화를 주는 요소 추가 : Math.cos(time/1000)
                */
                // let result_x = this.ship.x + Math.cos(i*(2*Math.PI/lineNum) + 2*Math.cos(time/700));
                // let result_y = this.ship.y + Math.sin(i*(2*Math.PI/lineNum) + 2*Math.cos(time/700));
                let result_x = this.ship.x + Math.cos(i*(2*Math.PI/lineNum) + time/700);
                let result_y = this.ship.y + Math.sin(i*(2*Math.PI/lineNum) + time/700);
                // 총알이 정상적으로 가져와졌다면 
                if (bullet)
                {
                    // 해당 총알을 마우스 방향으로 발사
                    bullet.fire(result_x, result_y, this.ship.x, this.ship.y,  50);

                    // 50 time 간격으로 발사되게 조정한다. 
                    this.lastFired = time + bulletInterval;
                }
            }

            for (let i = 0; i < lineNum; i++)
            {
                // 총알 하나 가져오기
                const bullet = this.enemy_bullets.get();
                /*
                    총알이 발사되는 방향 계산하는 식
                    1. 사방으로 퍼져나가는 방향 계산 : Math.cos(i*(2*Math.PI/lineNum))
                    2. 퍼져나가는 방향에 변화를 주는 요소 추가 : Math.cos(time/1000)
                */
                // let result_x = this.ship.x + Math.cos(i*(2*Math.PI/lineNum) + 2*Math.cos(time/700));
                // let result_y = this.ship.y + Math.sin(i*(2*Math.PI/lineNum) + 2*Math.cos(time/700));
                let result_x = this.ship.x + Math.cos(i*(2*Math.PI/lineNum) - time/700);
                let result_y = this.ship.y + Math.sin(i*(2*Math.PI/lineNum) - time/700);
                // 총알이 정상적으로 가져와졌다면 
                if (bullet)
                {
                    // 해당 총알을 마우스 방향으로 발사
                    bullet.fire(result_x, result_y, this.ship.x, this.ship.y,  100);

                    // 50 time 간격으로 발사되게 조정한다. 
                    this.lastFired = time + bulletInterval;
                }
            }
            
        }
        // 키보드 이벤트
        if(!this.gameOver){
            if (this.keyA.isDown)
            {
                console.log("i am left");
                this.heart.setVelocityX(-this.playerDefaultSpeed* this.playerSlow);
            }
            else if (this.keyD.isDown)
            {
                console.log("i am right");
                this.heart.setVelocityX(this.playerDefaultSpeed* this.playerSlow);
            }
            else
            {
                this.heart.setVelocityX(0);
            }
    
            if (this.keyW.isDown)
            {
                console.log("i am up");
                this.heart.setVelocityY(-this.playerDefaultSpeed* this.playerSlow);
            } 
            else if (this.keyS.isDown)
            {
                console.log("i am down");
                this.heart.setVelocityY(this.playerDefaultSpeed* this.playerSlow);
            }
            else
            {
                this.heart.setVelocityY(0);
            }

            if(this.keySpace.isDown && time > this.player_lastFired){
                let lineNum = 1;
                let bulletInterval = 100;
                for (let i = 0; i < lineNum; i++)
                {
                    // 총알 하나 가져오기
                    const bullet = this.player_bullets.get();

                    let result_x = this.player.x + Math.cos(3*Math.PI/2);
                    let result_y = this.player.y + Math.sin(3*Math.PI/2);
                    // 총알이 정상적으로 가져와졌다면 
                    if (bullet)
                    {
                        // 해당 총알을 마우스 방향으로 발사
                        bullet.fire(result_x, result_y, this.player.x, this.player.y,  100);
    
                        // 50 time 간격으로 발사되게 조정한다. 
                        this.player_lastFired = time + bulletInterval;
                    }
                }
            }
        }
        

        if(this.keyShift.isDown){
            this.playerSlow = this.playerDefaultSlow;
        }else{
            this.playerSlow = 1;
        }

        

        this.ship.setRotation(Math.PI);

        // 배경 움직이기
        this.stars.y += 1;
        // 512가 넘어가는 순간 다시 0으로 초기화
        // 즉 배경 2개가 번갈아가면서 보이게 되는 것이다. 
        this.stars.y %= 512;
        // sprite 두개를 묶는 방법을 못 찾겠다. ---------------------------------
        this.player.setPosition(this.heart.x, this.heart.y);
    }
}