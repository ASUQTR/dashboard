//Define AUV canvas object
class AUVCanvas {
    constructor(){
        //auv properties
        this.width = 500;
        this.t1 = document.getElementById("t1");
        this.t2 = document.getElementById("t2");
        this.t3 = document.getElementById("t3");
        this.t4 = document.getElementById("t4");
        this.t5 = document.getElementById("t5");
        this.t6 = document.getElementById("t6");
        this.t7 = document.getElementById("t7");
        this.t8 = document.getElementById("t8"); 
        this.ctx1 = t1.getContext("2d");
        this.ctx1.translate(this.width/2, this.width/2);
        this.ctx1.rotate(45 * Math.PI / 180);
        this.ctx1.translate(-this.width/2, -this.width/2);
        console.log("ctx1 outside method is "+ this.ctx1);
        this.ctx2 = t2.getContext("2d");
        this.ctx2.translate(this.width/2, this.width/2);
        this.ctx2.rotate(135 * Math.PI / 180);
        this.ctx2.translate(-this.width/2, -this.width/2);
        this.ctx3 = t3.getContext("2d");
        this.ctx4 = t4.getContext("2d");
        this.ctx5 = t5.getContext("2d");
        this.ctx6 = t6.getContext("2d");
        this.ctx7 = t7.getContext("2d");
        this.ctx7.translate(this.width/2, this.width/2);
        this.ctx7.rotate(-45 * Math.PI / 180);
        this.ctx7.translate(-this.width/2, -this.width/2);
        this.ctx8 = t8.getContext("2d");
        this.ctx8.translate(this.width/2, this.width/2);
        this.ctx8.rotate(-135 * Math.PI / 180);
        this.ctx8.translate(-this.width/2, -this.width/2);
        this.load_imgs()
        
    }
    //auv methods
    draw_auv() {
        console.log("ctx1 in method is "+ this.ctx1)
        this.ctx1.drawImage(this.t200_up, 0, 0);
        this.ctx2.drawImage(this.t200_up, 0, 0);
        this.ctx3.drawImage(this.t200, 0, 0);
        this.ctx4.drawImage(this.t200, 0, 0);
        this.ctx5.drawImage(this.t200, 0, 0);
        this.ctx6.drawImage(this.t200, 0, 0);
        this.ctx7.drawImage(this.t200_up, 0, 0);
        this.ctx8.drawImage(this.t200_up, 0, 0);
    };

    set_base_color() {
        this.base_color = this.ctx1.getImageData(0, 0, this.width, this.width).data
    }

    load_imgs() {
        this.t200 = new Image();
        this.t200_up = new Image();
        var that = this;
        this.t200.addEventListener("load", function(){that.draw_auv();});
        this.t200_up.addEventListener("load", function(){that.draw_auv();});
        this.t200.addEventListener("load", function(){that.set_base_color();});
        this.t200_up.addEventListener("load", function(){that.set_base_color();});
        this.t200.src = 't200.png';
        this.t200_up.src = 't200-up.png';
    }

    change_colors(throttles) {
        var new_color = this.ctx1.getImageData(0, 0, this.width, this.width),
            pixels = new_color.data,
            color_mod = [throttles[0]*255, -throttles[0]*255, 0];
        for (var i = 0, n = pixels.length; i <n; i += 4) {
            pixels[i] = this.base_color[i] + color_mod[0];   // Red component
            pixels[i+1] = this.base_color[i] + color_mod[1]; // Blue component
            pixels[i+2] = this.base_color[i] + color_mod[2]; // Green component
            //pix[i+3] is the transparency.
        }
        this.ctx1.putImageData(new_color, 0, 0);
    }
}

//var auv = new AUVCanvas()

//Instanciate auv, wait for imgs to load 
//var auv = new AUVCanvas();
//auv.t200.onload = auv.draw_auv

//USE this code later when code for img load is working
/*
//remember base color of canvas
var base_pixs = auv.ctx1.getImageData(0, 0, canvasWidth, canvasWidth).data

var new_img = auv.ctx1.getImageData(0, 0, canvasWidth, canvasWidth),
    pixels = new_img.data,
    pix_modifier = [message.throttles[0]*255, -message.throttles[0]*255, 0];
    
// Loops through all of the pixels and modifies the components.
for (var i = 0, n = pixels.length; i <n; i += 4) {
    pixels[i] = base_pixs[i] + pix_modifier[0];   // Red component
    pixels[i+1] = base_pixs[i] + pix_modifier[1]; // Blue component
    pixels[i+2] = base_pixs[i] + pix_modifier[2]; // Green component
    //pix[i+3] is the transparency.
}
auv.ctx1.putImageData(new_img, 0, 0);
*/
