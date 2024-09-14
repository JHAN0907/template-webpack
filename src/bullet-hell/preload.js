export class Preload extends Phaser.Scene{

    logo;
    startText;
    optionText;
    gameWidth = 300;
    gameHeight = 400;
    starts;

    constructor(){
        super("preload");
    }

    preload(){
        this.load.image('logo', 'assets/logo.png');
        this.load.image('arrow', 'assets/right_arrow.png');
        this.load.image('background', 'assets/shooting/deep-space.jpg');
    }

    create(){

        this.stars = this.add.blitter(0, 0, 'background');
        this.stars.create(0, 0);
        this.stars.create(0, -512);

        this.logo = this.add.image(150, 150, 'logo');
        this.logo.setOrigin(0.5, 0.5);
        this.logo.setScale(1/3);

        this.startText = this.add.text(150,200, "Game Start", { fontFamily: 'Minecrafter', fontStyle: 'bold', align: 'center' });
        this.startText.setOrigin(0.5, 0.5);

        this.optionText = this.add.text(150,230, "Option",{ fontFamily: 'Minecrafter', fontStyle: 'bold', align: 'center' });
        this.optionText.setOrigin(0.5, 0.5);

        this.arrow = this.add.image(this.gameWidth/2 - this.startText.width/2 - 20, 200, 'arrow');
        this.logo.setOrigin(0.5, 0.5);

        const fx1 = this.startText.postFX.addGlow(0xffffff, 0, 0, false, 0.1, 24);

        this.tweens.add({
            targets: fx1,
            outerStrength: 2,
            yoyo: true,
            loop: -1,
            ease: 'sine.inout'
        });
        // 효과 삭제
        // this.tweens.destroy();
        

        this.input.keyboard.on('keydown', ()=>{
            this.scene.start("main");
        })
    }

    update(){
        this.stars.y += 1;
        this.stars.y %= 512;
    }

}