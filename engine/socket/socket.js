// Config
var config = require('./../../config');
var port = process.env.PORT || 80;

// Dependencias
var io = require('socket.io')(port);
var shortId = require('shortid');

var clients = [];


var SocketKira = {

  init: function(){

      io.on('connection', function (socket) {

        var currentUser;

        // Usuario Conectado
        socket.on('usuario_conectado', function (){

            console.log('Usuario Conectado ');

            for (var i = 0; i < clients.length; i++) {

                socket.emit('usuario_conectado',{

                    name:clients[i].name,
                    id:clients[i].id,
                    posicion:clients[i].posicion,
                    rotacion: clients[i].rotacion,
                    camara: clients[i].camara

                });

                console.log('Usuario ' + clients[i].name + ' se a conectado');

            };

        });

        // Login
        socket.on('login', function (data){

            currentUser = {
                name: data.name,
                id: shortId.generate(),
                posicion: data.posicion,
                rotacion: data.rotacion,
                camara: data.camara,
                plataforma: data.plataforma
            }

            //console.log(currentUser.plataforma)
            clients.push(currentUser);
            socket.emit('login',currentUser );
            socket.broadcast.emit('usuario_conectado',currentUser);

        });

        // Usuario Desconectado
        socket.on('disconnect', function (){

            socket.broadcast.emit('usuario_desconectado',currentUser);

            for (var i = 0; i < clients.length; i++) {

                if (clients[i].name === currentUser.name && clients[i].id === currentUser.id) {

                    console.log("Usuario " + clients[i].name + " id: " + clients[i].id + " Se a Desconectado");
                    clients.splice(i,1);
                };
            };

        });

        // Cordenadas de Usuario
        socket.on('coors', function (data){

            // currentUser.name = data.name;
            // currentUser.id   = data.id;
            currentUser.posicion = data.posicion;
            currentUser.rotacion = data.rotacion;
            currentUser.camara = data.camara;

            socket.broadcast.emit('coors', currentUser);
            console.log(currentUser.name + " coors " + currentUser.posicion + " rota " + currentUser.rotacion);

        });

        socket.on('chat', function(data){
          socket.broadcast.emit('chat', data)
          //console.log(data.user);
          //console.log(data.msg);
        });

    });

  } // -- END Init

};

module.exports = SocketKira;
