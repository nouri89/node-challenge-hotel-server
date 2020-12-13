const express = require("express");
const cors = require("cors");
const moment = require("moment");
const app = express();
const bodyParser = require("body-parser");

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");
//console.log(bookings);

app.get("/bookings", function (request, response) {
	response.json(bookings);
});
app.post("/bookings", function (request, response) {
	let newBooking = request.body;
	console.log(typeof newBooking.roomId);
	if (
		newBooking.title.length == 0 ||
		newBooking.firstName.length == 0 ||
		newBooking.surname.length == 0 ||
		newBooking.email.length == 0 ||
		newBooking.roomId == "" ||
		newBooking.title.length == "" ||
		newBooking.title.length == ""
	) {
		response.sendStatus(400);
	} else {
		newBooking.id = bookings.length + 1;
		bookings.push(newBooking);
		response.json("booking added");
	}
});

app.get("/bookings/search", function (request, response) {
	let searchedDate = request.query.date;
	let convertedDate = moment([searchedDate]);
	console.log(searchedDate);
	response.json(convertedDate);
});
app.get("/bookings/:id", function (request, response) {
	let bookingId = request.params.id;
	console.log(typeof bookingId);
	console.log(bookingId);

	let foundBooking = bookings.find((booking) => booking.id == bookingId);
	if (foundBooking) {
		response.json(foundBooking);
	} else {
		response.sendStatus(404);
	}
});

app.delete("/bookings/:id", function (request, response) {
	let bookingId = request.params.id;
	let foundBooking = bookings.find((booking) => booking.id == bookingId);
	if (!foundBooking) {
		response.sendStatus(404);
	} else {
		bookings = bookings.filter((b) => b.id != bookingId);
		response.json("booking deleted");
	}
});

let port = process.env.PORT || 4000;
const listener = app.listen(port, function () {
	console.log("Your app is  listening on port " + port);
});
