  //creating some variables
  var trex, trex_running, trex_collided;
  var ground, groundimage, invisibleground;
  var cloud, cloud_image;
  var obstacle, obs1, obs2, obs3;
  var score = 0;
  var jump, win;
  var obstaclesGroup, CloudsGroup;
  var PLAY = 1;
  var END = 2;
  var gameState = PLAY;
  var gameover_image, restart_image, gameover, restart;
  var checkPoint;  
  var playBtn, playBtn_image;
  var title, title_image;
  var Trex, Trex_running;
  var backgroundImage;

function preload() {
  
  //loading all the animations  
  trex_running=loadAnimation("trex1.png", "trex2.png", "trex3.png", "trex4.png", "trex5.png", "trex6.png", "trex7.png", "trex8.png", "trex9.png", "trex10.png"); 
  trex_collided=loadAnimation("trex7.png"); 
  groundimage=loadImage("ground.jpg");
  cloud_image=loadImage("cloud.png");
  obs1=loadAnimation("vilian4.png", "vilian3.png", "vilian2.png","vilian1.png");
  obs2=loadAnimation("soldier6.png", "soldier5.png", "soldier4.png", "soldier3.png", "soldier2.png", "soldier1.png");
  obs3=loadAnimation("trans7.png", "trans6.png", "trans5.png", "trans4.png", "trans3.png", "trans2.png", "trans1.png");
  jump=loadSound("jump.mp3");
  die=loadSound("die.mp3");
  gameover_image=loadImage("gameover2.png");
  restart_image=loadImage("restart.png");
  checkPoint = loadSound("checkPoint.mp3");
  backgroundImage=loadImage("background1.png");
  } 

function setup() {
  
//creating the canvas  
createCanvas(windowWidth, windowHeight);  

  //creating the trex  
  trex = createSprite(200,height-900,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.scale=0.5;

  //setting a collider radius for trex
  trex.setCollider("rectangle", 0, 0, 200, 300);
  trex.debug=false;
  trex.frameDelay=2;

  //creating the ground
  ground = createSprite(width/2,height-90,width,2);  
  ground.addImage("Ground", groundimage); 
  
 
  //creating an invisible ground
  invisibleground = createSprite(width/2,height-160,width,2);
  invisibleground.visible=false;
   
  
  
  //groups
  obstaclesGroup = new Group();
  CloudsGroup = new Group();
  } 


function draw() {
  
  //background of the screen  
  background(backgroundImage);
  
  //displaying the score
  fill("black");
  textSize(30);
  text("HI , YOUR SCORE IS = " + score, 0, 30);
  

  
  //making the trex move on the invisible ground  
  trex.collide(invisibleground);  

  if (gameState===PLAY) {
  
  //making the trex and ground visible when game starts  
  trex.visible=true;
  ground.visible=true;  
    
  //making the ground move  
  ground.velocityX=-(6+3*score/100);  
    
  //making the trex jump on pressing space key 
  if((touches.length > 0 || keyDown("SPACE")) && trex.y >= height-250) {
    jump.play( )
    trex.velocityY = -30;
     touches = [];
  }
    
  //adding a gravity to trex  
  trex.velocityY = trex.velocityY+1.5; 
  
  //making the ground reset if it crosses half its width  
  if (ground.x<0) {
  ground.x = ground.width / 2; 
  } 
  
  //checkPoint sound  
  if (score>0 && score%100===0) {
  checkPoint.play();
  }
    
  //spawn clouds and obstacles
  spawnClouds();
  spawnObstacles();
   
  //updating the score  
  score=score+Math.round(getFrameRate()/60);  
  
  //making the game over   
  if (obstaclesGroup.isTouching(trex)) {
  gameState = END; 
  trex.changeAnimation("collided", trex_collided);

  restart = createSprite(width/2,height/2-10); 
  restart.addImage("restart", restart_image); 
  restart.scale=1;
    
  gameover = createSprite(width/2,height/2-160);
  gameover.addImage("over", gameover_image);
  gameover.scale = 1.5; 
  die.play();  
  }  
  }
  
  else if (gameState===END) {

  

  //making the ground stop  
  ground.velocityX=0; 
  
  //making velocity of groups = 0  
  obstaclesGroup.setVelocityXEach(0);  
  CloudsGroup.setVelocityXEach(0); 
  
  //lifetime   
  obstaclesGroup.setLifetimeEach(-1); 
  CloudsGroup.setLifetimeEach(-1);  
  
  //bugs  
  trex.veloctiyY=0; 
  trex.veloctiyX=0; 
  
  if(touches.length>0 || keyDown("SPACE")) {      
    reset();
    touches = []
  }
}       
  
  //displaying all the things on the screen  
  drawSprites();  
  }

//function to spawn clouds
function spawnClouds() {
  
  //making the cloud spawn at random heights  
  if (frameCount%60===0) {
  cloud = createSprite(width+20,height-300,40,10);  
  cloud.addImage("cld", cloud_image);
  cloud.y=Math.round(random(60, 110));  
  cloud.scale=0.5;
  cloud.velocityX=-4;   
  cloud.lifetime=350;  
    
  //making the trex's depth more than the clouds  
  cloud.depth=trex.depth;
  trex.depth=trex.depth+1;  
    
  CloudsGroup.add(cloud);  
  }    
  } 

//function to spawn obstacles
function spawnObstacles() {
  
if (frameCount%100===0) { 

  var obstacle = createSprite(1335,height-230,20,30           );
  obstacle.velocityX=-(6+3*score/70);  
  obstacle.setCollider("circle", 0 ,0 , 50);
  obstacle.debug=false;
  var rand=Math.round(random(1, 3));  
  switch(rand) {
    case 1 :obstacle.addAnimation("obs", obs1);       
            break;
    case 2 :obstacle.addAnimation("obs", obs2);       
            break;
    case 3 :obstacle.addAnimation("obs", obs3);
            break;
    default:break;        
}  
obstacle.scale=1; 
obstacle.lifetime=300;  
obstaclesGroup.add(obstacle);  
console.log(rand);
}  
}  

function reset() {
score = 0;
gameState = PLAY;
obstaclesGroup.destroyEach();
CloudsGroup.destroyEach();  
gameover.destroy();
restart.destroy();  
trex.changeAnimation("running", trex_running);  
}

function windowResized() {
resizeCanvas(windowWidth, windowHeight); 
}

