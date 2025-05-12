class Fish extends Phaser.Scene {
    constructor() {
        super('FishScene');

        this.my = {sprite: {}, text: []};

        this.playerX = 300;
        this.playerY = 550;

        // this.speed = 5;
        // this.active = false;

        this.my.sprite.enemy = [];
        this.my.sprite.bullet = []; 
        this.maxBullets = 10;
        this.my.sprite.enemyBullets = [];
        
        this.myScore = 0;
        this.highScore = 0;

        this.playerHealth = 100;
        this.maxHealth = 100;

    }

    preload() {

        this.load.setPath("./assets/");
        this.load.atlasXML("fishParts", "fishSpritesheet.png", "fishSpritesheet.xml");
        // this.load.image("fish", "fishTile_014.png");
        // this.load.image("bubble", "fishTile_031.png");
        // this.load.image("enemy", "fishTile_050.png");

        this.load.audio("impact", "threeTone2.ogg");
    }

    create() {

        let my = this.my;

        this.path1 = new Phaser.Curves.Spline([
            100, 0,
            350, 100,
            100, 200,
            350, 300,
            100, 400,
            350, 500,
            100, 600 
        ]);

        this.path2 = new Phaser.Curves.Spline([
            675, 0,
            500, 100,
            675, 200,
            500, 300,
            675, 400,
            500, 500,
            675, 600
        ]);

        // this.graphics = this.add.graphics();
        // this.graphics.lineStyle(2, 0xffffff, 1);
        // this.path.draw(this.graphics, 64);


        my.sprite.fish = this.add.sprite(game.config.width / 2, game.config.height - 40, "fishParts", "fishTile_078.png");
        my.sprite.fish.setScale(1.4);
        // my.sprite.shoot = this.add.sprite(-100, -100, "fishParts", "fishTile_031.png");
        // my.sprite.shoot.visible = false;
        
        my.sprite.enemy = [];

        for (let i = 0; i < 10; i++) {
            const path = (i % 2 === 0) ? this.path1 : this.path2;  // alternate paths

            let follower = this.add.follower(path, path.points[0].x, path.points[0].y, "fishParts", "fishTile_090.png");
            follower.setScale(1.4);
            follower.scorePoints = 100;

            // Delay based on index so they appear staggered
            follower.startFollow({
                duration: 9000,
                delay: i * 1000,  // delay each enemy
                ease: 'Sine.easeInOut',
                repeat: -1,
                yoyo: false,
                rotateToPath: false
            });

            my.sprite.enemy.push(follower);
        }


        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        console.log("Created")

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 5;
        this.bulletSpeed = 5;

        this.healthBarBackground = this.add.rectangle(630, 575, 150, 20, 0x555555).setOrigin(0, 0.5);
        this.healthBarFill = this.add.rectangle(630, 575, 150, 20, 0x00ff00).setOrigin(0, 0.5);

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Bubble Shooter</h2>'

        this.highScore = parseInt(localStorage.getItem("highScore")) || 0;
        localStorage.setItem("highScore", this.highScore);
        
        // Put score on screen
        my.text.score = this.add.text(10, 570, "Score " + this.myScore, {
            font: "20px Arial",
            fill: "#ffffff"
        });

        my.text.highScore = this.add.text(630, 540, "High Score " + this.highScore, {
            font: "20px Arial",
            fill: "#ffffff"
        });

        // Put title on screen
        this.add.text(10, 5, "Incoming!!", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 60
            }
        });

        this.time.addEvent({
            delay: 2000, // every 1 second
            callback: () => {
                for (let enemy of this.my.sprite.enemy) {
                    if (enemy.visible && Phaser.Math.Between(0, 1)) {
                        const bullet = this.add.sprite(enemy.x, enemy.y + enemy.displayHeight / 2, "fishParts", "fishTile_031.png");
                        bullet.setScale(0.8);
                        this.my.sprite.enemyBullets.push(bullet);
                    }
                }
            },
            loop: true
        });

        this.impact = this.sound.add("impact");
        this.init_game();

    }

    update() {

        let my = this.my;
        if (!my.sprite.fish) return; // extra safety

        console.log("Updating");
        console.log(my.sprite.fish.x);
    

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.fish.x > (my.sprite.fish.displayWidth/2)) {
                my.sprite.fish.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.fish.x < (game.config.width - (my.sprite.fish.displayWidth/2))) {
                my.sprite.fish.x += this.playerSpeed;
            }
        }

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.fish.x, my.sprite.fish.y-(my.sprite.fish.displayHeight/2), "fishParts", "fishTile_064.png")
                );
            }
        }


        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        // Collision loop between bullet and enemy
        for (let bullet of my.sprite.bullet) {
            for (let enemy of my.sprite.enemy) {
                if (!enemy.visible) continue; // skip if already hit
        
                if (this.collides(enemy, bullet)) {
                    this.impact.play();
                    bullet.y = -100; // remove bullet
                    enemy.visible = false;
                    enemy.x = -100;
        
                    this.myScore += enemy.scorePoints;
                    this.updateScore();
                    break; // only one enemy hit per bullet
                }
            }
        }

        // Make all of the bullets move
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }

        const aliveEnemies = my.sprite.enemy.filter(enemy => enemy.visible);
        if (aliveEnemies.length === 0 && this.playerHealth > 0) {
        this.gameWin();
        }


        //detecting enemy collisions and updating health bar
        for (let enemy of my.sprite.enemy) {
            if (!enemy.visible) continue;

            if (this.collides(my.sprite.fish, enemy)) {
                //affects player
                this.playerHealth -= 20;
                this.updateHealthBar();

                enemy.visible = false;
                enemy.x = -100;

                if (this.playerHealth <= 0) {
                    this.gameOver();
                }
            }
        }

        // Move enemy bullets
        this.my.sprite.enemyBullets = this.my.sprite.enemyBullets.filter((bullet) => {
        bullet.y += 1.5; // downward speed
        // Check for collision with player
        if (this.collides(bullet, this.my.sprite.fish)) {
            bullet.destroy();
            this.playerHealth -= 5; // slight damage
            this.updateHealthBar();

            if (this.playerHealth <= 0) {
                this.gameOver();
            }
            return false; // remove bullet
        }

        // Keep only bullets on screen
        if (bullet.y < game.config.height + bullet.displayHeight / 2) {
            return true;
        } else {
            bullet.destroy();
            return false;
            }
        });

        }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }

    updateHealthBar() {
        const healthRatio = Phaser.Math.Clamp(this.playerHealth / this.maxHealth, 0, 1);
        this.healthBarFill.width = 200 * healthRatio;

        if (healthRatio > 0.5) {
            this.healthBarFill.setFillStyle(0x00ff00); //bar is green
        } else if (healthRatio > 0.25) {
            this.healthBarFill.setFillStyle(0xffff00); //bar is yellow
        } else {
            this.healthBarFill.setFillStyle(0xff0000); //bar is red
        }
    }

    updateHighScore() {
        let my = this.my;
        my.text.highScore.setText("High Score " + this.highScore);
    }

    gameOver() {
        this.add.rectangle(game.config.width / 2, game.config.height / 2, game.config.width, game.config.height, 0x000000).setDepth(10);
        
        this.add.text(350, 250, "Game Over", {
            font: "32px Arial",
            fill: "#ff0000"
        }).setDepth(11);

        const restartText = this.add.text(350, 300, "Click to Restart", {
            font: "20px Arial",
            fill: "#ffffff"
        }).setInteractive().setDepth(11);

        restartText.setInteractive().on('pointerdown', () => {
            this.restartGame();
        });
    
    }
    gameWin() {
        this.add.rectangle(game.config.width / 2, game.config.height / 2, game.config.width, game.config.height, 0x000000).setDepth(10);
        
        this.add.text(350, 250, "You Win!", {
            font: "32px Arial",
            fill: "#00ff00"
         }).setDepth(11);

        const restartText = this.add.text(350, 300, "Click to Restart", {
            font: "20px Arial",
            fill: "#ffffff"
        }).setInteractive().setDepth(11);

        restartText.setInteractive().on('pointerdown', () => {
            this.restartGame();
        });

        if (this.myScore > this.highScore) {
            this.highScore = this.myScore;
            localStorage.setItem("highScore", this.highScore); // ✅ SAVE it!
            this.updateHighScore();
        }
    }

    restartGame() {
        this.scene.restart();
    }

    init_game() {
        let my = this.my;

    // Reset core variables
    this.myScore = 0;
    this.playerHealth = 100;
    this.isGameOver = false;

    // Reset player position
    my.sprite.fish.x = game.config.width / 2;
    my.sprite.fish.y = game.config.height - 40;

    // Reset score display and health bar
    this.updateScore();
    this.updateHealthBar();

    // reset enemy bullets
    this.my.sprite.enemyBullets.forEach(b => b.destroy());
    this.my.sprite.enemyBullets = [];

    // Remove all old bullets
    my.sprite.bullet.forEach(b => b.destroy());
    my.sprite.bullet = [];

    // Destroy and recreate enemies
    my.sprite.enemy.forEach(e => e.destroy());
    my.sprite.enemy = [];

    for (let i = 0; i < 10; i++) {
        const path = (i % 2 === 0) ? this.path1 : this.path2;
        let follower = this.add.follower(path, path.points[0].x, path.points[0].y, "fishParts", "fishTile_090.png");
        follower.setScale(1.4);
        follower.scorePoints = 100;

        follower.startFollow({
            duration: 9000,
            delay: i * 1000,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: false,
            rotateToPath: false
        });

        my.sprite.enemy.push(follower);
    }

    this.updateHighScore();

    }
}