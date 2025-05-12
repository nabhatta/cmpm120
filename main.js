
// Phaser: 3.70.0
//
//

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    backgroundColor: '#21437a',
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 800,
    height: 600,
    scene: [Fish],
    fps: { forceSetTimeOut: true, target: 30 }
}

var my = {sprite: {}}

const game = new Phaser.Game(config);