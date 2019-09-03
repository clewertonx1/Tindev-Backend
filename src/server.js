const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const routes = require('./routes')
const serverHTTP = express()
const serverWEBSOCKET = require('http').Server(serverHTTP)
const io = require('socket.io')(serverWEBSOCKET)

const connectedUsers = {}

io.on('connection', socket => {
	const { user } = socket.handshake.query

	connectedUsers[user] = socket.id
});

mongoose.connect('mongodb+srv://clewertonx1:clewertonx1@cluster0-2wws3.mongodb.net/test?retryWrites=true&w=majority', { 
	useNewUrlParser: true 
});

serverHTTP.use((request, response, next) => {
	request.io = io
	request.connectedUsers = connectedUsers

	return next()
});

serverHTTP.use(cors())
serverHTTP.use(express.json())
serverHTTP.use(routes)
serverWEBSOCKET.listen(3333)