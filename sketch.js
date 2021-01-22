//Create variables here
var dog, happyDog, database, foods , foodStock;
var dog1,dog2;
var foods=20;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState=0;
var bedroomImg, gardenImg,washroomImg;
function preload()
{
  //load images here
  dog=loadImage("images/dogImg.png")
  happyDog=loadImage("images/dogImg1.png");

  bedroomImg=loadImage("images/Bed Room.png")
  gardenImg=loadImage("images/Garden.png")
  washroomImg=loadImage("images/Wash Room.png")
}

function setup() {
  createCanvas(1000, 400);
  database=firebase.database();

  foodObj=new food();

  var gameStateRef  = database.ref('gameState');
      gameStateRef.on("value",function(data){
         gameState = data.val();
      })

  foodStock=database.ref('Food');
  foodStock.on("value",readStock)

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
  
 dog1=createSprite(800,200,30,30)
 dog1.addImage("dog",dog)
 dog1.scale=0.3;
  
 feed=createButton("Feed the Dog");
 feed.position(700,95);
 feed.mousePressed(feedDog)

 addFood=createButton("Add Food");
 addFood.position(800,95);
 addFood.mousePressed(addFoods)
}


function draw() { 
  
  currentTime=hour();

  


 // image(dog,400,500,80,80)
 foodObj.display();
  
   // textSize(15);
 // noStroke();
 // fill ("black");
 // text("food remaining: "+foods,300,250);
 // text("NOTE: Press UP_ARROW Key To Feed Dog Milk!",100,20)
  
  //add styles here

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog1.remove();
  }else{
    feed.show();
    addFood.show();
    dog1.addImage(dog)
  }
 
if(currentTime==(lastFed+1)){
 foodObj.garden ();
 // gameState=Playing
  update("Playing")
}else if(currentTime==(lastFed+2)){
  foodObj.bedroom ();
 // gameState=Sleeping
  update("Sleeping")
    
}else if(currentTime>(lastFed+2)&& currentTime <= (lastFed+4)){
  update("Bathing")
  foodObj.washroom ();
}else {
  update("Hungry")
  foodObj.display
}
drawSprites();

 


}
function readStock(data){
  foods=data.val();
  foodObj.updateFoodStock(foods)
}
function feedDog(){
  dog1.addImage(" Dog",dog)

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour (),
    gameState:"Hungry"
  })
}

function addFoods(){
 foods++;
 database.ref('/').update({
   Food:foods
 })
}
function update(state){
  database.ref('/').update({
    gameState:state
  });
}



