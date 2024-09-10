export class Main extends Phaser.Scene
{
    mouseY = 0;
    mouseX = 0;
    isDown = false;
    lastFired = 0;
    stats;
    speed;
    ship;
    bullets;
    

    preload ()
    {
        this.load.image('ship', 'assets/ship.png');
        this.load.image('bullet1', 'assets/bullets/bullet11.png');
        this.load.image('bullet2', 'assets/bullets/bullet7.png');
    }

    create ()
    {
        class Bullet extends Phaser.GameObjects.Image
        {
            constructor (scene)
            {
                super(scene, 0, 0, 'bullet1');

                this.incX = 0;
                this.incY = 0;
                this.lifespan = 0;

                this.speed = Phaser.Math.GetSpeed(2050, 1);
            }

            fire (x, y)
            {
                this.setActive(true);
                this.setVisible(true);

                //  Bullets fire from the middle of the screen to the given x/y
                this.setPosition(400, 300);

                const angle = Phaser.Math.Angle.Between(x, y, 400, 300);

                this.setRotation(angle);

                this.incX = Math.cos(angle);
                this.incY = Math.sin(angle);

                this.lifespan = 1000;
            }

            update (time, delta)
            {
                this.lifespan -= delta;

                this.x -= this.incX * (this.speed * delta);
                this.y -= this.incY * (this.speed * delta);

                if (this.lifespan <= 0)
                {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }
        }

        this.bullets = this.add.group({
            classType: Bullet,
            maxSize: 50,
            runChildUpdate: true
        });

        this.ship = this.add.sprite(400, 50, 'ship').setDepth(1);
        this.ship.setScale(1);

        // graphics 오브젝트 하나 생성
        // 이것으로 화면에 그림을 그릴 수 있도록 한다.
        const graphics = this.add.graphics();
        // path 오브젝트 생성
        const path = new Phaser.Curves.Path(this.ship.x,this.ship.y);
        for (let i = 0; i < 8; i++)
        {
            // xRadius, yRadius, startAngle, endAngle, clockwise, rotation
            if (i % 2 === 0)
            {
                path.ellipseTo(50, 80, 180, 360, true, 0);
            }
            else
            {
                path.ellipseTo(50, 80, 180, 360, false, 0);
            }
        }
    
        graphics.lineStyle(1, 0xffffff, 1);

        path.draw(graphics);

        for (let i = 0; i < 40; i++)
        {
            let follower;
            {
                follower = this.add.follower(path, 100, 100 + (30 * i), 'bullet2');
                follower.setBlendMode(Phaser.BlendModes.ADD);
                follower.setScale(2);
            }

            follower.startFollow({
                duration: 4000,
                positionOnPath: true,
                repeat: -1,
                ease: 'Linear',
                delay: i * 70
            });
        }
        
        this.input.on('pointerdown', pointer =>
        {

            this.isDown = true;
            this.mouseX = pointer.x;
            this.mouseY = pointer.y;

        });

        this.input.on('pointermove', pointer =>
        {

            this.mouseX = pointer.x;
            this.mouseY = pointer.y;

        });

        this.input.on('pointerup', pointer =>
        {

            this.isDown = false;

        });
    }

    update (time, delta)
    {

        if (this.isDown && time > this.lastFired)
        {
            const bullet = this.bullets.get();

            if (bullet)
            {
                bullet.fire(this.mouseX, this.mouseY);

                this.lastFired = time + 50;
            }
        }

        this.ship.setRotation(Math.PI);
        // this.path.setRotation(Pahser.Math.Angle.Between(this.mouseX, this.mouseY, this.ship.x, this.ship.y))
    }
}