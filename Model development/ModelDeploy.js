let video;
let poseNet;
let pose;
let skeleton;
let brain;
let state = 'waiting';
let targetLabel;

function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO)
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose',gotPoses);
  
  let options = {
    inputs: 34,
    outputs:6,
    task:'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  brain.loadData('basic.json',dataReady);
}

function dataReady(){
  brain.normalizeData();
  brain.train({epochs:100},finished );
}
function finished(){
    console.log('model trained');
      brain.save();
}
function gotPoses(poses){
  
  if(poses.length > 0){
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    
    if(state=='collecting'){
    
    let inputs = [];
    for(let i =0 ;i < pose.keypoints.length; i++){
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
       inputs.push(x);
      inputs.push(y); 
    }
    let target = [targetLabel];
    brain.addData(inputs,target );
  }  
} 
}
function modelLoaded(){
  console.log('poseNet Ready');
}

