const canvas = document.getElementById("myCanvas");
const CTX = canvas.getContext("2d");
const FPS = 25
const N_Elements = 35

let run = true

let scissors = []
let papers = []
let rocks = []


let rock_image = new Image();
let paper_image = new Image();
let scissor_image = new Image();

function loadImages()
{
rock_image.src = "./rock.png";
paper_image.src = "./paper.png";
scissor_image.src = "./scissors.png";
}


function randomNumber() 
{
    let num = Math.random() * 2 - 1;
    if (num === 0) 
    return randomNumber();
    return num;
}

function drawBorder()
{
    CTX.beginPath();
    CTX.rect(0,0,canvas.width,canvas.height);
    CTX.stroke();
}


function createElements(quantity)
{
    
    for (let i = 0; i < quantity ; i++)
    {
        let scissor = new Scissor()
        let rock = new Rock()
        let paper = new Paper()
        scissors.push(scissor)
        papers.push(paper)
        rocks.push(rock)
    }
}

function drawElements()
{
    scissors.forEach(element => {
        element.Move();
    });
    rocks.forEach(element => {
        element.Move();
    });
    papers.forEach(element => {
        element.Move();
});
}




function checkCollision(element1, element2)
{
    
    if (
        element1.x_pos < element2.x_pos + element2.size &&
        element1.x_pos + element1.size > element2.x_pos &&
        element1.y_pos < element2.y_pos + element2.size &&
    element1.y_pos + element1.size  > element2.y_pos
    )
return true

}

function checkElementsCollisions()
{
// Tesoura ganha de papel
    scissors.forEach(element1 => {
    papers.forEach(element2 => {
        if (checkCollision(element1,element2))
        {            
            console.log("Tesoura ganha de papel ")
            element2.toScissor();
        }
    })
    });
// Papel ganha de pedra
papers.forEach(element1 => {
    rocks.forEach(element2 => {
        if (checkCollision(element1,element2))
        {            
            console.log("Papel ganha de pedra")
            element2.toPaper();
        }
    })
    });
// Pedra ganha de tesoura
rocks.forEach(element1 => {
    scissors.forEach(element2 => {
        if (checkCollision(element1,element2))
        {            
            console.log("Pedra ganha de tesoura");
            element2.toRock();
        }
    })
    });
}

class Element {
    color     = "White"
    size      = 30
    speed     = 2
    min_speed = 1.5
    img = undefined

constructor(x_pos,y_pos,x_dir,y_dir)
{
    this.x_pos  = x_pos || Math.random() * (canvas.width - this.size);
    this.y_pos  = y_pos || Math.random() * (canvas.height - this.size);
    this.x_dir  = x_dir || randomNumber() * this.speed + this.min_speed;
    this.y_dir  = y_dir || randomNumber()  * this.speed + this.min_speed;
        
    this.Draw(CTX);
}

Draw(){
    if (typeof this.img === "undefined")
    return;
    CTX.drawImage(this.img,this.x_pos, this.y_pos )
}

Move()
{
    this.Bounce()
    this.x_pos += this.x_dir
    this.y_pos += this.y_dir
    
    this.Draw()
}

Bounce()
{
    if (this.x_pos + this.x_dir + this.size > canvas.width ||this.x_pos + this.x_dir < 0)
    this.x_dir = - this.x_dir;
    if (this.y_pos + this.y_dir + this.size> canvas.height ||this.y_pos + this.y_dir < 0)
    this.y_dir = - this.y_dir;
}


}
class Scissor extends Element{
constructor(x_pos,y_pos,x_dir,y_dir){
    super(x_pos,y_pos,x_dir,y_dir)
    this.color = "Red"
    this.img = scissor_image
}
toRock()
{
    rocks.push(new Rock(this.x_pos, this.y_pos,this.x_dir,this.y_dir))
    scissors.splice(scissors.indexOf(this), 1);
}
}
class Rock extends Element{
constructor(x_pos,y_pos,x_dir,y_dir){
    super(x_pos,y_pos,x_dir,y_dir)
    this.color = "Black"
    this.img = rock_image
}
toPaper()
{
    papers.push(new Paper(this.x_pos, this.y_pos,this.x_dir,this.y_dir))
    rocks.splice(rocks.indexOf(this), 1);
}
}
class Paper extends Element{
constructor(x_pos,y_pos,x_dir,y_dir){
    super(x_pos,y_pos,x_dir,y_dir)
    this.color = "Blue"
    this.img = paper_image
}
toScissor()
{
    scissors.push(new Scissor(this.x_pos, this.y_pos,this.x_dir,this.y_dir))
    papers.splice(papers.indexOf(this), 1);
}
}



function drawWinner(element)
{
    if (element == undefined)
        return;

    CTX.fillStyle = "black";
    CTX.fillRect((canvas.width /2) -80,canvas.height /2 - 20, 180,45);

    CTX.fillStyle = "White";
    CTX.font = "48px Arial";
    CTX.textAlign = "center";
    CTX.fillText("Wins!!",canvas.width /2 + 25, canvas.height /2 + 20);
    CTX.drawImage(element.img,(canvas.width /2 + 25) - 105,canvas.height /2 - 13)
}

function checkWin()
{

if (scissors.length == 0 && papers.length == 0)
    return rocks[0]
else if (rocks.length == 0 && scissors.length == 0)
    return papers[0]
else if (rocks.length == 0 && papers.length == 0)
    return scissors[0]
else
    return undefined
}

function start()
{
    scissors = []
    papers = []
    rocks = []
    createElements(N_Elements)
}




window.addEventListener('keydown', function (e) { run = !run; }, false);

loadImages();
function animate() {

if (run)
{
    // Clear the background
    CTX.clearRect(0, 0, canvas.width, canvas.height);


    drawElements();
    drawBorder();

    checkElementsCollisions()
    drawWinner(checkWin())
    

    // drawWinner(new Scissor())

}


}

setInterval(animate, FPS);