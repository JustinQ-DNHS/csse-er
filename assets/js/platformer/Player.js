import GameEnv from './GameEnv.js';
import Character from './Character.js';
import deathController from './Death.js';
import Enemy from './Enemy.js';

export class Player extends Character{
    // constructors sets up Character object 
    constructor(canvas, image, speedRatio, playerData) {
        super(canvas, 
            image, 
            speedRatio,
            playerData.width, 
            playerData.height, 
        );
        // Player Data is required for Animations
        this.playerData = playerData;
        this.dashTimer = 0;
        this.cooldownTimer = 0;

        this.spriteScale = 1;

        // Player control data
        this.pressedKeys = {};
        this.movement = {left: true, right: true, down: true};
        this.isIdle = true;
        this.stashKey = "d"; // initial key

        // Store a reference to the event listener function
        this.keydownListener = this.handleKeyDown.bind(this);
        this.keyupListener = this.handleKeyUp.bind(this);

        // Add event listeners
        document.addEventListener('keydown', this.keydownListener);
        document.addEventListener('keyup', this.keyupListener);
        
        /*// Begin additions from animation lessons
        // Speed Limit, remove if necessary
        this.speedLimit = speedLimit;
        this.currentspeed = 0;
        this.acceleration = 0.11; 
        this.deceleration = 0.1;
        //End additons from animation lessons*/

        GameEnv.player = this;
    }

    setAnimation(key) {
        // animation comes from playerData
        var animation = this.playerData[key]
        // direction setup
        if (key === "a") {
            this.stashKey = key;
            this.playerData.w = this.playerData.wa;
        } else if (key === "d") {
            this.stashKey = key;
            this.playerData.w = this.playerData.wd;
        }
        // set frame and idle frame
        this.setFrameY(animation.row);
        this.setMaxFrame(animation.frames);
        if (this.isIdle && animation.idleFrame) {
            this.setFrameX(animation.idleFrame.column)
            this.setMinFrame(animation.idleFrame.frames);
        }
    }i
    
    // check for matching animation
    isAnimation(key) {
        var result = false;
        if (key in this.pressedKeys) {
            result = !this.isIdle;
        }
        
        return result;
    }

    // check for gravity based animation
    isGravityAnimation(key) {
        var result = false;
    
        // verify key is in active animations
        if (key in this.pressedKeys) {
            result = (!this.isIdle && (this.topOfPlatform || this.bottom <= this.y));
        }

        // scene for on top of tube animation
        if (!this.movement.down) {
            this.gravityEnabled = false;
            // Pause for two seconds
            setTimeout(() => {   // animation in tube
                // This code will be executed after the two-second delay
                this.movement.down = true;
                this.gravityEnabled = true;
                setTimeout(() => { // move to end of game detection
                    this.x = GameEnv.innerWidth + 1;
                }, 1000);
            }, 2000);
        }
    
        // make sure jump has ssome velocity
        if (result) {
            // Adjust horizontal position during the jump
            const horizontalJumpFactor = 0.1; // Adjust this factor as needed
            this.x += this.speed * horizontalJumpFactor;  
        }
    
        // return to directional animation (direction?)
        if (this.bottom <= this.y) {
            this.setAnimation(this.stashKey);
        }
    
        return result;
    }
    

    // Player updates
    update() {
        if (this.isAnimation("a")) {
                if (this.movement.left) this.x -= this.speed;  // Move to left
                this.facingLeft = true; // Add this!
            }
        if (this.isAnimation("d")) {
            if (this.movement.right) this.x += this.speed;  // Move to right
            this.facingLeft = false; // Add this!
        }
        if (this.isAnimation("s")) {
            if (this.movement) {  // Check if movement is allowed
                if(this.dashTimer){
                    const moveSpeed = this.speed * 2;
                    this.x += this.facingLeft ? -moveSpeed : moveSpeed;
                }
            }
        };
        if (this.isGravityAnimation("w")) {
            if (this.movement.down) this.y -= (this.bottom * .33);  // jump 33% higher than bottom
        }
        if (this.x <= 0) {
            this.x += 5
        }
        // Perform super update actions
        super.update();
    }

    // Player action on tube collisions
    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "tube") {
            // Collision with the left side of the Tube
            if (this.collisionData.touchPoints.other.left) {
                this.movement.right = false;
                console.log("tube touch left");
            }
            // Collision with the right side of the Tube
            if (this.collisionData.touchPoints.other.right) {
                this.movement.left = false;
                console.log("tube touch right");
            }
            // Collision with the top of the player
            if (this.collisionData.touchPoints.other.ontop) {
                this.movement.down = false;
                this.x = this.collisionData.touchPoints.other.x;
                console.log("tube touch top");
            }
        } else {
            // Reset movement flags if not colliding with a tube
            this.movement.left = true;
            this.movement.right = true;
            this.movement.down = true;
        };
        // *******************************
        // Platform collision
        if (this.collisionData.touchPoints.other.id === "jumpPlatform") {
            // Collision with the left side of the Platform
            if (this.collisionData.touchPoints.other.left && (this.topOfPlatform === true)) {
                this.movement.right = false;
                console.log("platform left")
            }
            // Collision with the right side of the platform
            if (this.collisionData.touchPoints.other.right && (this.topOfPlatform === true)) {
                this.movement.left = false;
                console.log("platform right")
            }
            // Collision with the top of the player
            if (this.collisionData.touchPoints.this.ontop) {
                this.gravityEnabled = false;
                console.log("c")
            }
            if (this.collisionData.touchPoints.this.bottom) {
                this.gravityEnabled = false;
                console.log("d")
            }
            if (this.collisionData.touchPoints.this.top) {
                this.gravityEnabled = false;
                this.topOfPlatform = true; 
                console.log(this.topOfPlatform + "top")
                console.log(this.gravityEnabled + "grav")
                //console.log("e");
            }
        } else {
            this.topOfPlatform = false;
            this.gravityEnabled = true;
            /* this.movement.left = true;
            this.movement.right = true;
            this.movement.down = true; */
        };
        // The else statement above may be causing issues
        // *******************************
        // Enemy collision
        if (this.collisionData.touchPoints.other.id === "enemy") {
            // Collision with the left side of the Enemy
            if (this.collisionData.touchPoints.other.left) {
                deathController.setDeath(1);
            }
            // Collision with the right side of the Enemy
            if (this.collisionData.touchPoints.other.right) {
                deathController.setDeath(1);
            }
            // Collision with the top of the Enemy
            if (this.collisionData.touchPoints.other.ontop) {
                console.log("Bye Goomba");
                this.y -= (this.bottom * .33);
                deathController.setDeath(1);
            }
        };
        /* Code below was provded for adding a hitbox to the coin.
        else {
            if (this.collisionData.touchPoints.other.id === "thing2") {
            // Collision with the left side of the Tub
            if (this.collisionData.touchPoints.coin.left) {
                this.touchCoin = true;
                console.log("o")
                window.location.reload();
            }
            // Collision with the right side of the Tube
            if (this.collisionData.touchPoints.coin.right) {
                console.log("p")
                this.touchCoin = true;
                window.location.reload();
            }
        }  
        */
    }
        
    // Event listener key down
    handleKeyDown(event) {
        if (this.playerData.hasOwnProperty(event.key)) {
            const key = event.key;
            if (!(event.key in this.pressedKeys)) {
                this.pressedKeys[event.key] = this.playerData[key];
                this.setAnimation(key);
                // player active
                this.isIdle = false;
            }
            if (key === "a") {
                GameEnv.backgroundSpeed = -0.5;
                GameEnv.foregroundSpeed = -0.4; // Caused issues so was removed
            }
            if (key === "d") {
                GameEnv.backgroundSpeed = 0.5;
                GameEnv.foregroundSpeed = 0.4; // Caused issues so was removed
            }
            if (key === "s") {
                this.canvas.style.filter = 'invert(1)';
                this.dashTimer = setTimeout(() => {
                    // Stop the player's running functions
                    clearTimeout(this.dashTimer);
                    this.dashTimer = null;
    
                    // Start cooldown timer
                    this.cooldownTimer = setTimeout(() => {
                        clearTimeout(this.cooldownTimer);
                        this.cooldownTimer = null;
                    }, 4000);
                }, 1000);
            }
        }
    }

    // Event listener key up
    handleKeyUp(event) {
        if (this.playerData.hasOwnProperty(event.key)) {
            const key = event.key;
            if (event.key in this.pressedKeys) {
                delete this.pressedKeys[event.key];
            }
            if (key === "a") {
                GameEnv.backgroundSpeed = 0;
                GameEnv.foregroundSpeed = 0; // Caused issues so was removed
            }
            if (key === "d") {
                GameEnv.backgroundSpeed = 0;
                GameEnv.foregroundSpeed = 0; // Caused issues so was removed
            }
            if (key === "s") {
                this.canvas.style.filter = 'invert(0)'; //revert to default coloring
            }
            this.setAnimation(key);  
            // player idle
            this.isIdle = true;     
        }
    }

    // Override destroy() method from GameObject to remove event listeners
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.keydownListener);
        document.removeEventListener('keyup', this.keyupListener);

        // Call the parent class's destroy method
        super.destroy();
    }
}


export default Player;