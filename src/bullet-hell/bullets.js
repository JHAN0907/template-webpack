

export class Main extends Phaser.Scene
{
    lastFired = 0;
    cursors;
    stats;
    speed;
    ship;
    bullets;

    preload ()
    {
        this.load.image('ship', 'assets/ship.png');
        this.load.image('bullet', 'assets/bullet.png');
    }

    create ()
    {
        class Bullet extends Phaser.GameObjects.Image
        {
            constructor (scene)
            {
                super(scene, 0, 0, 'bullet');

                this.speed = Phaser.Math.GetSpeed(400, 1);
            }

            fire (x, y)
            {
                this.setPosition(x, y - 50);

                this.setActive(true);
                this.setVisible(true);
            }

            update (time, delta)
            {
                this.y -= this.speed * delta;

                // y값이 게임 바깥으로 벗어나면 
                if (this.y < -50)
                {
                    // 비활성화 및 안보이게 하기
                    this.setActive(false);
                    this.setVisible(false);
                }
            }
        }

        // bullet 클래스만을 담는 그룹 생성, 최대 100개까지
        this.bullets = this.add.group({
            classType: Bullet,
            maxSize: 100,
            runChildUpdate: true
        });

        this.ship = this.add.sprite(400, 500, 'ship').setDepth(1);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.speed = Phaser.Math.GetSpeed(300, 1);
    }

    update (time, delta)
    {
        if (this.cursors.left.isDown)
        {
            this.ship.x -= this.speed * delta;
        }
        else if (this.cursors.right.isDown)
        {
            this.ship.x += this.speed * delta;
        }

        if (this.cursors.up.isDown && time > this.lastFired)
        {
            // 사용가능한 bullet이 있으면 그걸 주고 없으면 새로 생성하여 반환
            const bullet = this.bullets.get();

            if (bullet)
            {
                // 총알을 발사 전달값은 총알의 발사 위치
                bullet.fire(this.ship.x, this.ship.y);

                this.lastFired = time + 50;
            }
        }
    }
}