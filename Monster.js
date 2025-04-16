class Monster extends Phaser.Scene {
    constructor() {
        super("monsterScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        //Create constants for the monster location
        this.bodyX = 300;
        this.bodyY = 350;

        this.mouthX = this.bodyX;
        this.mouthY = this.bodyY + 50;

        this.leftEyeX = this.bodyX - 40;
        this.leftEyeY = this.bodyY - 5;

        this.rightEyeX = this.bodyX + 40;
        this.rightEyeY = this.bodyY - 5;

        this.leftArmX = this.bodyX - 115;
        this.leftArmY = this.bodyY - 60;

        this.rightArmX = this.bodyX + 115;
        this.rightArmY = this.bodyY - 60;

        this.leftLegX = this.bodyX - 110;
        this.leftLegY = this.bodyY + 90;

        this.rightLegX = this.bodyX + 110;
        this.rightLegY = this.bodyY + 90;

        this.noseX = this.bodyX;
        this.noseY = this.bodyY + 30;

        this.leftHornX = this.bodyX - 77;
        this.leftHornY = this.bodyY - 70;

        this.rightHornX = this.bodyX + 77;
        this.rightHornY = this.bodyY - 70;

        
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets pack "Monster Builder Pack"
        // https://kenney.nl/assets/monster-builder-pack
        this.load.setPath("./assets/");

        // Load sprite atlas
        this.load.atlasXML("monsterParts", "spritesheet_default.png", "spritesheet_default.xml");
        
        // update instruction text
        document.getElementById('description').innerHTML = '<h2>Monster.js<br>S - smile // F - show fangs<br>A - move left // D - move right</h2>'
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability

        // Create the main body sprite
        //
        // this.add.sprite(x,y, "{atlas key name}", "{name of sprite within atlas}")
        //
        // look in spritesheet_default.xml for the individual sprite names
        // You can also download the asset pack and look in the PNG/default folder.
        my.sprite.body = this.add.sprite(this.bodyX, this.bodyY, "monsterParts", "body_redB.png");
        
        my.sprite.mouthA = this.add.sprite(this.mouthX, this.mouthY, "monsterParts", "mouth_closed_happy.png");
        my.sprite.mouthB = this.add.sprite(this.mouthX, this.mouthY, "monsterParts", "mouthE.png");
       
        my.sprite.leftEye = this.add.sprite(this.leftEyeX, this.leftEyeY, "monsterParts", "eye_cute_dark.png");
        my.sprite.rightEye = this.add.sprite(this.rightEyeX, this.rightEyeY, "monsterParts", "eye_closed_feminine.png");
        
        my.sprite.leftArm = this.add.sprite(this.leftArmX, this.leftArmY, "monsterParts", "arm_redE.png");
        my.sprite.leftArm.flipX = true;
        my.sprite.leftArm.flipY = true;
        my.sprite.rightArm = this.add.sprite(this.rightArmX, this.rightArmY, "monsterParts", "arm_redE.png");
        my.sprite.rightArm.flipY = true;

        my.sprite.leftLeg = this.add.sprite(this.leftLegX, this.leftLegY, "monsterParts", "leg_redC.png");
        my.sprite.leftLeg.flipX = true;
        my.sprite.rightLeg = this.add.sprite(this.rightLegX, this.rightLegY, "monsterParts", "leg_redC.png");

        my.sprite.nose = this.add.sprite(this.noseX, this.noseY, "monsterParts", "nose_yellow.png");

        my.sprite.leftHorn = this.add.sprite(this.leftHornX, this.leftHornY, "monsterParts", "detail_white_ear.png");
        my.sprite.leftHorn.flipX = true;
        my.sprite.rightHorn = this.add.sprite(this.rightHornX, this.rightHornY, "monsterParts", "detail_white_ear.png");

        my.sprite.mouthB.visible = false;

       this.keys = this.input.keyboard.addKeys('S,F,A,D');

        
    }

    update() {
        let my = this.my;    // create an alias to this.my for readability

        if (this.keys.S.isDown) {
            my.sprite.mouthA.visible = true;
            my.sprite.mouthB.visible = false;
        }

        if (this.keys.F.isDown) {
            my.sprite.mouthA.visible = false;
            my.sprite.mouthB.visible = true;
        }

        if (this.keys.A.isDown) {
            for (const i in my.sprite) {
                my.sprite[i].x -= 2;
                console.log(i);
            }
        }

        if (this.keys.D.isDown) {
            for (const i in my.sprite) {
                my.sprite[i].x += 2;
                console.log(i);
            }
        }

    }

}