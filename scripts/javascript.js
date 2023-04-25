/*functionality:
mouseover a pixel and it will turn a color.

the color will not change if moused over again.

saturation will increase if marker mode is used,
until fully saturated.
*/

//canvas variables
let canvasSize = 20;
let recMaxCanvasSize = 100;
let canvasColor = "green"
//let canvasColor = "rgb(184, 134, 11)";

//toggles
let rainbowColors = false;
const rainbowToggleButton = document.getElementById("rainbow-toggle");
rainbowToggleButton.addEventListener('click', () => {
    if(rainbowColors) {
        rainbowColors = false;
        rainbowToggleButton.style.backgroundColor = "hsl(43, 74%, 49%)";
    } else {
        rainbowColors = true;
        console.log(`rainbow button is ${rainbowToggleButton.style.background}`);
        rainbowToggleButton.style.backgroundColor = "hsl(43, 89%, 38%)";
    }

    console.log(`toggles. saturation is ${saturation}; rainbow is ${rainbowColors}`);
})

let saturation = false;
let pencilCheckbox = document.querySelector("input[id=pencil-checkbox]");
pencilCheckbox.addEventListener('change', () => {
    if(saturation) {
        saturation = false;
    } else {
        saturation = true;
    }

    console.log(`toggles. saturation is ${saturation}; rainbow is ${rainbowColors}`);
});

//color incrementer
let hueIncrement = 0;
let opacityIncrement = 0.0;
//elements
const gridWrapper = document.getElementById("grid-wrapper");
const setCanvasSizeButton = document.getElementById("set-canvas-size-button");

//for re-sizing the canvas
function removeItems(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
} //removeItems

//color fill functions
function getRainbowColor() {
    let hslString = `hsl(${hueIncrement}, 80%, 50%)`;
    hueIncrement += 2;
    return hslString;
}

//gradually increase opacity as grid spaces get crossed
//
function increaseOpacity(currentColor) {
    //split into array
    let rgbaArray = currentColor.split("(")[1].split(")")[0].split(",");

    //trim whitespaces
    let trimArray = rgbaArray;
    for (i = 0; i < rgbaArray.length; i++) {
        rgbaArray[i] = trimArray[i].trim();
    }

    //pad array in case original was only rgb
    if (rgbaArray.length == 3) {
        rgbaArray.push('0');
    }
    
    //assemble and return array, check for full saturation,
    // otherwise increase saturation
    if (rgbaArray[3] >= 0.9) {
        return `rgba(${rgbaArray[0]}, ${rgbaArray[1]}, ${rgbaArray[2]}, 0.99)`;
    } else {
        rgbaArray[3] = parseFloat(rgbaArray[3]) + 0.1;
        return `rgba(${rgbaArray[0]}, ${rgbaArray[1]}, ${rgbaArray[2]}, ${parseFloat(rgbaArray[3])})`;
    }
}

//create grid for canvas, create items and append to grid
function placeItems(canvasSize) {
    removeItems(gridWrapper);
    
    //create right size grid
    let x = Math.pow(canvasSize, 2)
    gridWrapper.style.gridTemplateColumns = `repeat(${canvasSize}, 1fr)`;
    gridWrapper.style.gridTemplateRows = `repeat(${canvasSize}, 1fr)`;

    //create items including mouseover event listener, place in grid
    for (i = 0; i < x; i++) {
        const newDiv = document.createElement("div");
        newDiv.setAttribute('class', 'item');

        divName = `item-${i}`;
        newDiv.setAttribute('id', divName);

        newDiv.addEventListener('mouseover', (event) => {
            //logic determines what type of color to add
            //rainobw color
            if (rainbowColors == true) {
                event.target.style.backgroundColor = getRainbowColor();
                console.log(`R1: color is ${event.target.style.backgroundColor}`);
                let testVar = event.target.style.backgroundColor;
                console.log(`R2: color is still ${testVar}`);
                let newTestVar = `R3: rgba(${testVar.slice(4, -1)}, 0.3)`;
                console.log(`R3: and as rgba: ${newTestVar}`);
                event.target.style.backgroundColor = newTestVar;
                console.log(`R4: color is ${event.target.style.backgroundColor}`);
            };

            //saturation, if true use pencil instead of marker
            //each pass over a square adds opacity.
            //add a check to see if rainbow has been painted
            if (saturation == true) {
                let firstColor = event.target.style.backgroundColor;
                console.log(`S1: grid base color is ${firstColor}`);

                if (firstColor.length === 0) {
                    event.target.style.backgroundColor = canvasColor;
                }

                let sendColor = event.target.style.backgroundColor;
                console.log(`S2: sending color: ${sendColor}`);

                event.target.style.backgroundColor = increaseOpacity(event.target.style.backgroundColor);
                console.log(`S3: color is ${event.target.style.backgroundColor}`);

            } else {
                event.target.style.backgroundColor = "darkgoldenrod";
                //event.target.style.backgroundColor = getRainbowColor();
            };

            //setTimeout (() => {
            //    event.target.style.backgroundColor = "";
            //}, 10000);
        },
        false);

        gridWrapper.appendChild(newDiv);
    };
} //placeItems

placeItems(canvasSize);

//set custom canvas size
setCanvasSizeButton.addEventListener('click', () => {
    canvasSize = window.prompt("Enter canvas size", canvasSize);
    console.log(`canvas size is ${canvasSize}, rec max size is ${recMaxCanvasSize}`);

    //canvas size override
    if (canvasSize > recMaxCanvasSize) {
        //create box & buttons for canvas size override
        let confirmBox = document.getElementById("confirm");

        //confirm buttons
        //helpers
        function showConfirm() {
            confirmBox.style.display = "block";
        }

        function closeConfirm() {
            confirmBox.style.display = "none";
        }

        //define buttons
        let recommendedSizeButton = document.getElementById("recommended-size-button");
        recommendedSizeButton.textContent = `Use ${recMaxCanvasSize}`;
        let customSizeButton = document.getElementById("custom-size-button");
        customSizeButton.textContent = `Use ${canvasSize}`;

        recommendedSizeButton.addEventListener('click', () =>   {
            canvasSize = recMaxCanvasSize;
            closeConfirm();
            placeItems(canvasSize);
        });

        customSizeButton.addEventListener('click', () => {
            closeConfirm();
            placeItems(canvasSize);
        });

        showConfirm();
    }//if
    else {
        placeItems(canvasSize);
    }
});