import GameEnv from './GameEnv.js';
import Background from './Background.js';
import Platform from './Platform.js';
import Player from './Player.js';
import Tube from './Tube.js';
import Enemy from './Enemy.js';
import JumpPlatform from './JumpPlatform.js';

// Store the assets and attributes of the Game at the specific GameLevel.
class GameLevel {
    constructor(gameObject) {
        // conditional assignments from GameObject to instance variables
        this.tag = gameObject?.tag;
        this.backgroundImg = gameObject.background?.file;
        this.platformImg = gameObject.platform?.file;
        this.jumpPlatformImg = gameObject.jumpPlatform?.file;
        this.playerImg = gameObject.player?.file;
        this.playerData = gameObject?.player;
        this.enemyImg = gameObject.enemy?.file;
        this.enemyData = gameObject?.enemy;
        this.tubeImg = gameObject.tube?.file;
        this.isComplete = gameObject?.callback; // function that determines if level is complete
        GameEnv.levels.push(this);
    }

    // Load level data
    async load() {
        
        // test for presence of Images
        const imagesToLoad = [];
        if (this.backgroundImg) {
            imagesToLoad.push(this.loadImage(this.backgroundImg));
        }
        if (this.platformImg) {
            imagesToLoad.push(this.loadImage(this.platformImg));
        }
        if (this.jumpPlatformImg) {
            imagesToLoad.push(this.loadImage(this.jumpPlatformImg));
        }
        if (this.playerImg) {
            imagesToLoad.push(this.loadImage(this.playerImg));
        }
        if (this.enemyImg) {
            imagesToLoad.push(this.loadImage(this.enemyImg));
        }
        if (this.tubeImg) {
            imagesToLoad.push(this.loadImage(this.tubeImg));
        }

        try {
            // Do not proceed until images are loaded
            const loadedImages = await Promise.all(imagesToLoad);
            var i = 0;

            // Prepare HTML with Background Canvas (if backgroundImg is defined)
            if (this.backgroundImg) {
                const backgroundCanvas = document.createElement("canvas");
                backgroundCanvas.id = "background";
                document.querySelector("#canvasContainer").appendChild(backgroundCanvas);
                const backgroundSpeedRatio = 0;
                new Background(backgroundCanvas, loadedImages[i], backgroundSpeedRatio);
                i++;
            }

            // Prepare HTML with Platform Canvas (if platformImg is defined)
            if (this.platformImg) {
                const platformCanvas = document.createElement("canvas");
                platformCanvas.id = "platform";
                document.querySelector("#canvasContainer").appendChild(platformCanvas);
                const platformSpeedRatio = 0;
                new Platform(platformCanvas, loadedImages[i], platformSpeedRatio);
                i++;
            }

            // JumpPlatform loader
            if (this.jumpPlatformImg) {
                const jumpPlatformCanvas = document.createElement("canvas")
                jumpPlatformCanvas.id = "jumpPlatform"
                const jumpPlatformSpeedRatio = 0;
                document.querySelector("#canvasContainer").appendChild(jumpPlatformCanvas);
                new JumpPlatform(jumpPlatformCanvas, loadedImages[i], jumpPlatformSpeedRatio);
                i++
            }

            // Prepare HTML with Player Canvas (if playerImg is defined)
            if (this.playerImg) {
                const playerCanvas = document.createElement("canvas");
                playerCanvas.id = "character";
                document.querySelector("#canvasContainer").appendChild(playerCanvas);
                const playerSpeedRatio = 0.7;
                new Player(playerCanvas, loadedImages[i], playerSpeedRatio, this.playerData);
                i++;
            }
            if (this.enemyImg) {
                const enemyCanvas = document.createElement("canvas");
                enemyCanvas.id = "enemy"
                document.querySelector("#canvasContainer").appendChild(enemyCanvas);
                const enemySpeedRatio = 0.7;
                new Enemy(enemyCanvas, loadedImages[i], enemySpeedRatio, this.enemyData);
                i++;
            }

            // Prepare HTML with Player Canvas (if playerImg is defined)
            if (this.tubeImg) {
                const tubeCanvas = document.createElement("canvas");
                tubeCanvas.id = "tube";
                document.querySelector("#canvasContainer").appendChild(tubeCanvas);
                new Tube(tubeCanvas, loadedImages[i]);
                i++;
            }

        } catch (error) {
            console.error('Failed to load one or more images:', error);
        }

    }

    // Create a function to load an image and return a Promise
    async loadImage(src) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = src;
            image.onload = () => resolve(image);
            image.onerror = reject;
        });
    }
}

export default GameLevel;