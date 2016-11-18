//server.js
var config = require('./config.json');
var express = require('express');
var app = express();
//MongoDB
//var mongoose = require('mongoose');
//Postgres
var massive = require('massive');


//Conexion con la base de datos MongoDB
//mongoose.connect('mongodb://localhost:27017/angular-todo');

//Conexion con la base de datos Postgresql
var connectionString = "postgres://"+config.postgres.user+":"+config.postgres.password+"@"+config.postgres.host+"/"+config.postgres.db;
var massiveInstance  = massive.connectSync({connectionString : connectionString});
var db;

// Configuración
app.configure(function() {  
    // Localización de los ficheros estÃ¡ticos
    app.use(express.static(__dirname + '/public'));
    // Muestra un log de todos los request en la consola        
    app.use(express.logger('dev')); 
    // Permite cambiar el HTML con el método POST                   
    app.use(express.bodyParser());
    // Simula DELETE y PUT                      
    app.use(express.methodOverride());                  
});


/* Mongoose

// Configuración
app.configure(function() {  
    // Localización de los ficheros estÃ¡ticos
    app.use(express.static(__dirname + '/public'));
    // Muestra un log de todos los request en la consola        
    app.use(express.logger('dev')); 
    // Permite cambiar el HTML con el método POST                   
    app.use(express.bodyParser());
    // Simula DELETE y PUT                      
    app.use(express.methodOverride());                  
});
// Definición de modelos
var Todo = mongoose.model('Todo', {  
    text: String
});
 
*/


// Rutas de nuestro API
// GET de todos los TODOs
app.get('/api/todos', function(req, res) {  
    Todo.find(function(err, todos) {
        if(err) {
            res.send(err);
        }
        res.json(todos);
    });
});

// POST que crea un TODO y devuelve todos tras la creación
app.post('/api/todos', function(req, res) {  
    Todo.create({
        text: req.body.text,
        done: false
    }, function(err, todo){
        if(err) {
            res.send(err);
        }

        Todo.find(function(err, todos) {
            if(err){
                res.send(err);
            }
            res.json(todos);
        });
    });
});

// DELETE un TODO específico y devuelve todos tras borrarlo.
app.delete('/api/todos/:todo', function(req, res) {  
    Todo.remove({
        _id: req.params.todo
    }, function(err, todo) {
        if(err){
            res.send(err);
        }

        Todo.find(function(err, todos) {
            if(err){
                res.send(err);
            }
            res.json(todos);
        });

    })
});





var startExpress = function() {
	// Escucha en el puerto 8090 y corre el server

	app.listen(config.express.port, function() {  
    	console.log('App listening on port 8090');
	});
	db = app.get('db');
}

var initialize = function() {
	startExpress();
}

//Send back a 500 error
var handleError = function(res) {
	return function(err) {
		console.log(err)
		res.send(500, {error: err.message});
	}
}

app.set('db', massiveInstance);

// Carga una vista HTML simple donde irá nuestra Single App Page
// Angular Manejará el Frontend
app.get('*', function(req, res) {  
    res.sendfile('./public/index.html');                
});

initialize();