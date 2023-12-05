---
layout: post
toc: false
title: Goomba Death Animation
description: Practicing the murder of the Goomba
type: ccc
courses: { csse: { week: 13 } }
---

<canvas id="canvas" style="filter: invert(0)"></canvas>
<button id="goomba-death" type="button" onclick="murder()">Kill Goomba</button>
<button id="goomba-reset" type="button" onclick="reset()">Reset Goomba</button>

<script>
    // Creates empty canvas
    let canvas = document.getElementById("canvas");
    let c = canvas.getContext('2d');
    // Set canvas dimensions
    canvas.width = 200;
    canvas.height = 200;
    // Creates Goomba
    class Goomba {
        constructor(image) {
            this.width = 100;
            this.height = 100;
            this.image = image;
            this.position = {
                x = 0;
                y = 0;
            }
            this.velocity = {
                x: -2;
            }
        }
        draw() {
            c.drawImage(this.image, 0, 0, this.width, this.height);
        }
        update() {
            this.draw();
        }
    }

    let imageGoomba = new Image()
    imageGoomba.src = 'https://samayass.github.io/samayaCSA/images/goomba.png';
    let goomba = new Goomba(imageGoomba)
    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);
        goomba.update();
    }
    animate();
    // Button code to kill Goomba
    function murder() {
        let i = 1;
        let intervalId = setInterval(() => {
            if (i >= 0) {
                canvas.style.transform = `scale(1, ${i.toFixed(1)})`;
                console.log("Death " + i.toFixed(1));
                i -= 0.1;
            } else {
                clearInterval(intervalId);
            }
        }, 100);
    }
    function reset() {
        canvas.style.transform = 'scale(1)';
    }
    // Testing alternate methods without using chatGPT
    /* function murder() {
        for (i = 1; i >= 0; i -= 0.1) {
            setTimeout(() => canvas.style.transform = `scale(1, ${i.toFixed(1)})`,100);
            console.log("Death " + i.toFixed(1) + "Xavier");
        }
    }
    */
</script>