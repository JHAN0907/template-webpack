// import { Boot } from './scenes-1/Boot';
// import { Game } from './scenes-1/Game';
// import { GameOver } from './scenes-1/GameOver';
// import { MainMenu } from './scenes-1/MainMenu';
// import { Preloader } from './scenes-1/Preloader';
// import {Example} from './scenes-1/Test'

import {Main} from './scenes-1/main';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
// const config = {
//     type: Phaser.AUTO,
//     width: 1024,
//     height: 768,
//     parent: 'game-container',
//     backgroundColor: '#028af8',
//     scale: {
//         mode: Phaser.Scale.FIT,
//         autoCenter: Phaser.Scale.CENTER_BOTH
//     },
//     scene: [
//         // Boot,
//         // Preloader,
//         // MainMenu,
//         // Game,
//         // GameOver
//         Example, 
//     ]
// };

// export default new Phaser.Game(config);

// const config = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     scene: Example,
//     /* 
//         시작 html 요소를 선정하는 설정
//         아래의 경우 html 요소 중 id가 game-container인 요소를 찾는 것이다. 
//     */
//     parent: 'game-container',
//     /* 
//         게임 화면 크기를 조정하는 설정
//         창의 크기에 따라 자동적으로 사이즈가 조절된다. 
//         mode: Phaser.Scale.FIT -> 화면 사이즈가 설정한 width와 height에 맞게 설정된다. 
//         autoCenter: Phaser.Scale.CENTER_BOTH -> 자동적으로 화면 가운데에 위치하게 된다.
//     */
//     scale: {
//         mode: Phaser.Scale.FIT,
//         autoCenter: Phaser.Scale.CENTER_BOTH
//     },
//     /*
//         물리와 관련된 설정

//     */
//     physics: {
//         default: 'arcade',
//         arcade: {
//             gravity: { y: 0 }
//         }
//     }
// };

// export default new Phaser.Game(config);

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: 
        [
            Main,
        ]
    
};

export default new Phaser.Game(config);

// 여기서부터 튜토리얼 이어서 하기
//https://phaser.io/tutorials/making-your-first-phaser-3-game/part2