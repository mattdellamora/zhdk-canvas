const source = document.getElementById("src");
source.width = 64;
source.height = 48;
const sCtx = source.getContext("2d");

const canvas = document.getElementById("cnv");
canvas.width = 640;
canvas.height = 480;
const ctx = canvas.getContext("2d");
optimizeCanvas(cnv);


const ww = window.innerWidth;
const wh = window.innerHeight;

const factorW = (canvas.width / source.width) / 2;
const factorH = (canvas.height / source.height) / 2;

let t = 0;
const animTime = 240;
let off = 0;

function draw() {
    // drawing the video to the source canvas
    sCtx.drawImage(video, 0, 0, source.width, source.height);

    // getting the data of the video
    const vidData = sCtx.getImageData(0, 0, source.width, source.height)

    // // 2. Create a new ImageDate object with the mirror image, called mirImDat 
    // const mirImDat = ctx.createImageData(vidData);   // a. initialze mirImDat; all components of mirImDat.data are 0 here
    // for (let y = 0; y < source.height; y++) {                    // b. update the mirImDat.data components
    //     for (let x = 0; x < source.width; x++) {
    //         let d = 4 * (y * source.width + x);
    //         let s = 4 * (y * source.width + (source.width - (x + 1)));
    //         mirImDat.data[d + 0] = vidData.data[s + 0];
    //         mirImDat.data[d + 1] = vidData.data[s + 1];
    //         mirImDat.data[d + 2] = vidData.data[s + 2];
    //         mirImDat.data[d + 3] = vidData.data[s + 3];
    //     };                                              // done updating the mirImDat.data components
    // };
    // ctx.putImageData (mirImDat, 0, 0);   

    // 2. Create a new ImageDate object with the mirror image, called mirImDat 
    const mirImDat = ctx.createImageData(vidData);   // a. initialze mirImDat; all components of mirImDat.data are 0 here
    const values = [];
    for (let y = 0; y < source.height; y++) {                    // b. update the mirImDat.data components
        for (let x = 0; x < source.width; x++) {
            let d = 4 * (y * source.width + x);
            let s = 4 * (y * source.width + (source.width - (x + 1)));
            values. push(lerp(0, 1, vidData.data[s + 0]/255))
        };                                              // done updating the mirImDat.data components
    };

    for(let y = 0; y < source.width; y++){
        for(let x = 0; x < source.width; x++){
            const idx = x + y * source.width;
            const currentValue = values[idx] * 255;
            //ctx.fillStyle = `rgb(${values[idx] * 255}, ${values[idx] * 255}, ${values[idx] * 255})`;
            //ctx.fillRect(x * factorW, y * factorW, factorW, factorH)

            if(currentValue < 18){
                ctx.save();
                ctx.translate(x * factorW, y * factorH);
                draw2(ctx, factorW);
                ctx.restore();
            } else if(currentValue < 63 * 2){
                ctx.save();
                ctx.translate(x * factorW, y * factorH);
                draw1(ctx, factorW);
                ctx.restore();
            } else if(currentValue < 63 * 3){
                ctx.save();
                ctx.translate(x * factorW, y * factorH);
                draw2(ctx, factorW);
                ctx.restore();
            } else {
                ctx.save();
                ctx.translate(x * factorW, y * factorH);
                draw0(ctx, factorW);
                ctx.restore();
            }

        }
    }

    t += 1;
    off += 0.000001;
    window.requestAnimationFrame(draw);
}

draw();

// whiteRect
function draw0(ctx, cellW){
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, cellW, cellW);
    ctx.restore(); 
}

// cross
function draw1(ctx, cellW){
    ctx.save();
    ctx.strokeStyle = "black";
    
    ctx.beginPath(); // Start a new path
    ctx.moveTo(0, 0);
    ctx.lineTo(cellW, cellW);
    ctx.stroke(); // Render the path
    
    ctx.beginPath(); // Start a new path
    ctx.moveTo(cellW, 0);
    ctx.lineTo(0, cellW); 
    ctx.stroke(); // Render the path
    
    ctx.restore(); 
}
// cross
function draw2(ctx, cellW){
    ctx.save();
    ctx.strokeStyle = "white";

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cellW, cellW);
    
    ctx.beginPath(); // Start a new path
    ctx.moveTo(0, 0);
    ctx.lineTo(cellW, cellW);
    ctx.stroke(); // Render the path
    
    ctx.beginPath(); // Start a new path
    ctx.moveTo(cellW, 0);
    ctx.lineTo(0, cellW); 
    ctx.stroke(); // Render the path
    
    ctx.restore(); 
}

// black rect
function draw3(ctx, cellW){
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cellW, cellW);
    ctx.restore(); 
}

function optimizeCanvas(cnv) {

    const dpr = window.devicePixelRatio;
    const rect = cnv.getBoundingClientRect();

    cnv.width = rect.width * dpr;
    cnv.height = rect.height * dpr;

    cnv.getContext("2d").scale(dpr, dpr);

    cnv.style.width = `${rect.width}px`
    cnv.style.height = `${rect.height}px`

}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}