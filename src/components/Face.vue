<template>
            <v-layout row wrap>
                    <v-flex xs12 sm12 md6 lg6 xl6>
                         <v-card>
                        <video id="video" width="100%" height="50%" autoplay></video>
                        <canvas id="canvas" width="600" height="480" style="display: none;"></canvas>
                         </v-card>
                        <v-btn @click.native="process" block >
                            <v-icon left>camera_alt</v-icon> Analyze</v-btn>
                    </v-flex>
                    <v-flex xs12 sm12 md6 lg6 xl6>
                        <h2 class="blue--text text-xs-center">Result</h2>
                           <div class="text-xs-center" v-show="loader2">
                            <v-progress-circular indeterminate v-bind:size="100" v-bind:width="3" class="amber--text"></v-progress-circular>
                            </div>
                              <div v-show="result2" class="text-xs-center">
                                
                            <p>appears to be: <span class="green--text">  {{gender}} </span> <span class="green--text">  {{genderConfidence}} %</span> </p>
                            <p>age range: <span class="green--text">  {{ageLow}}  -</span> <span class="green--text">  {{ageHigh}} years old</span> </p>
                            <p>smiling: <span class="green--text">  {{smile}} %</span> </p>
                            <p>eyes are {{eyesOpenOff}}: <span class="green--text">  {{eyesOpen}} %</span> </p>
                            <p>mouth is {{mouthOpenOff}}: <span class="green--text">  {{mouthOpen}} %</span> </p>
                            <p>{{mustacheFalse}} mustache: <span class="green--text">  {{mustache}} %</span> </p>
                            <p>{{beardFalse}} beard: <span class="green--text">  {{beard}} %</span> </p>
                            <p>{{eyeglassesFalse}} wearing glasses: <span class="green--text">  {{eyeglasses}} %</span> </p>
                             <h4 class="pink--text">Confidence: {{ confidence2 }} %</h4>
                        </div>
                    </v-flex>
                </v-layout>
</template>

<script>
import $ from "jquery";
import axios from 'axios';
const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1',accessKeyId:'',secretAccessKey:''});
const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});
const s3bucket = new AWS.S3({params: {Bucket: 'feeling-img'}}); //name Bucket you
export default {
  data(){
      return{
                loader2: false,
                result2: false,
                gender: null,
                genderConfidence: null,
                ageHigh: null,
                ageLow:null,
                smile:null,
                eyesOpen:null,
                eyesOpenOff:null,
                mouthOpen:null,
                mouthOpenOff:null,
                mustache:null,
                mustacheFalse:null,
                beard:null,
                beardFalse:null,
                eyeglasses:null,
                eyeglassesFalse:null,
                confidence2:null,
      }
  },
              methods: {
                process() {
                    const canvas = document.getElementById('canvas');
                    const context = canvas.getContext('2d');
                    const vm = this;
                    this.result2 = false;
                    this.loader2 = true;
                    context.drawImage(video, 0, 0, 640, 480);
                    const img = canvas.toDataURL('image/jpeg');
                    const base64data = new Buffer(img.replace(/^data:image\/\w+;base64,/, ""),'base64');
             
            s3bucket.createBucket(function () {
            var params = {
                Key: 'img.jpg',  //name image save to bucket
                Body: base64data     //file Raw code img
            };
            s3bucket.upload(params, function (err, data) {
                if (err) {
                    console.log('ERROR MSG: ', err);
                
                } else {
                 console.log('Successfully uploaded data Bucket');
            rekognition.detectFaces( {
                Image: {
                    S3Object: {
                        Bucket: "feeling-img",   //select name Bucket 
                        Name:"img.jpg"  //select name image
                        }
                    },
                Attributes: [
                        "ALL"
                        ]
        }, function(error, response) {
            if (error){
                 console.log("error"+error, error.stack); 
            }else {
                const res = response.FaceDetails[0];
                vm.gender = res.Gender.Value;
                vm.genderConfidence = res.Gender.Confidence.toFixed(1);
                vm.ageHigh = res.AgeRange.High;
                vm.ageLow = res.AgeRange.Low;
                vm.smile = res.Smile.Confidence.toFixed(1);
                vm.eyesOpen = res.EyesOpen.Confidence.toFixed(1);
                vm.eyesOpenOff = res.EyesOpen.Value == true ? 'open' : 'off';
                vm.mouthOpen = res.MouthOpen.Confidence.toFixed(1);
                vm.mouthOpenOff = res.MouthOpen.Value == true ? 'open' : 'off';
                vm.mustache = res.Mustache.Confidence.toFixed(1);
                vm.mustacheFalse = res.Mustache.Value == true ? 'has' : 'does not have';
                vm.beard = res.Beard.Confidence.toFixed(1);
                vm.beardFalse = res.Beard.Value  == true ? 'has' : 'does not have';
                vm.eyeglasses = res.Eyeglasses.Confidence.toFixed(1);
                vm.eyeglassesFalse = res.Eyeglasses.Value == true ? '' : 'not';
                vm.confidence2 = res.Confidence.toFixed(1);
                vm.loader2 = false;
                vm.result2 = true;
                console.log("Successfully Rekognition") 
                  
            } 
    });
                    }
                });
            })
        }
    }
}
 $(function() {
        const video = document.getElementById('video');
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
           navigator.mediaDevices.getUserMedia({
               video: true
           }).then(stream => {
               video.src = window.URL.createObjectURL(stream);
                video.play();
            });
        }

     });
       
</script>


<style>
p {
    font-size: 18px
}
</style>
