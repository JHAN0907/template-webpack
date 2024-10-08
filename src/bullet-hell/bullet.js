

// 공격 패턴 1용 총알, 일반적인 총알
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

// 레이저 패턴용 
class Laser extends Phaser.Physics.Arcade.Image{
    constructor (scene)
    {
        super(scene, 0, 0, 'bullet1');

        this.incX = 0;
        this.incY = 0;
        this.lifespan = 0;
        this.gameWidth = 300;
        this.gameHeight = 400;

        this.speed = Phaser.Math.GetSpeed(1000, 1);
        
        this.setOrigin(0, 1);
        this.setScale(10, 0.5);
        this.setRotation(Math.PI/2)
        this.setDepth(2);
        // 1000 당 1초
        this.lifespan = 1*1000;

        this.object_x;
        this.object_y;
        this.main_x;
        this.main_y;
    }


    /*
        레이저 방향
        main_x, main_y : 총알 생성 위치
        x, y : 날라가는 방향
    */
    fire (x, y, main_x, main_y)
    {
        this.object_x = x;
        this.object_y = y;
        this.main_x = main_x;
        this.main_y = main_y;

        this.setActive(true);
        this.setVisible(true);
        // this.setBodySize(6, 1000);
        

        this.setPosition(main_x, main_y);
        // console.log("this is tetstets");
        // console.log(main_x + " : " + main_y);

        const angle = Phaser.Math.Angle.Between(x, y, main_x, main_y);

        this.setRotation(angle + Math.PI);
    }

    update (time, delta)
    {
        // this.lifespan -= delta;
        const angle = Phaser.Math.Angle.Between(this.object_x, this.object_y, this.main_x, this.main_y);
        // console.log(angle);
        this.setRotation(angle + 0.3*Math.cos(0.0007* time));

        // this.x -= this.incX * (this.speed * delta);
        // this.y -= this.incY * (this.speed * delta);

        // if(this.lifespan < 0){
        //     this.setActive(false);
        //     this.setVisible(false);
        // }
        // bullet1 피격 범위 (0.3, 1000) -> setOrigin 및 setScale 적용하고 난 후 피격범위 산정
        // this.setBodySize(0.3, 1000, true);


        // 게임 밖에 벗어나면 삭제 혹시 모르니 남겨두기
        if(this.x < -100 || this.x > this.gameWidth + 100 || this. y < -100 || this.y > this.gameHeight + 100)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

export {Bullet, Laser}