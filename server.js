var cv = require('opencv')
  , http = require('http')
  , io = require('socket.io')
  , express = require('express')


var app = express()
  , server = http.createServer(app)
  , sock = io.listen(server);

server.listen(8080)

for (var x =1; x<4; x++){
 (function(y){
 app.get('/images/' + y + '.png', function (req, res) {res.sendfile(__dirname + '/images/' + y + '.png');});
 })(x)
}
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

sock.sockets.on('connection', function(socket){

  socket.emit('helo')

  var webcam = new cv.VideoCapture(0)
  
  var grabImage = function(){
    webcam.read(function(mat){
      mat.resize(300,200)
      mat.detectObject('./face.xml', {}, function(err, faces){
        
        if (faces.length){
          var f = faces[0]; 

          socket.emit('face', {
              left: 1 - ((f.x + f.width/2) / 300)
            , tp: (f.y + f.height/2) / 200
            , width : f.width / 300
            , height: f.height / 300
          })
        }

        setTimeout(grabImage, 10);
      });
    });
  }  

  grabImage();

});

