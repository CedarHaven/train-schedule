// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDIb2sjP5DGZuKbw4_59r6QDrOyyWsAcco",
    authDomain: "train-schedule-8eb6e.firebaseapp.com",
    databaseURL: "https://train-schedule-8eb6e.firebaseio.com",
    projectId: "train-schedule-8eb6e",
    storageBucket: "",
    messagingSenderId: "1035458164931",
    appId: "1:1035458164931:web:b770ff2a672eee3f610a76"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// firebase database variable
var database = firebase.database();

var name; // train name
var place; // train destination
var startTime; // the time the train starts coming
var timeFrequency; // the frequency with which the train comes
var nextArrival; // the time of the next arrival of the train
var timeUntil; // the time until the next arrival of the train
var currentDiff; // variable for the difference between times
var currentTime = moment().format("HH:mm"); // variable for the current time as a moment.js object. I'm not sure if I need this, actually, but I don't want to delete it because it's 11:30pm and I don't want to break my code right now.
var convertedTime; // the converted time variable, for converting whatever you enter as the start time into a moment.js object.

// on click of add train button, get the name of the train, the place it's going, the time it starts arriving, and how often it shows up
// parse the frequency of train arrivals into an int. when I didn't do this, I was getting errors about timeFrequency not being an integer, so.
// push these variables to the databse.
$("#add-train").on("click", function() {
    name = $("#name").val().trim();
    place = $("#place").val().trim();
    startTime = $("#time").val().trim();
    timeFrequency = $("#frequency").val().trim();

    timeFrequency = parseInt(timeFrequency);

    // this validates that you've entered a positive number for the time frequency, because...negative numbers wouldn't make sense.
    // if you haven't entered a positive number, the train is not saved and you are alerted that you've entered an invalid input.
    // if you have entered a positive number, the train is saved to the database and will subsequently be added to the table.
    if(timeFrequency < 0) {
        alert("Invalid time frequency. Please enter a positive number.");
    }
    else{
        database.ref().push({
            name: name,
            place: place,
            startTime: startTime,
            timeFrequency: timeFrequency
        });
    }
});

// on page load, print out the information for the trains as rows in the table I made.
// convert the startTime found in the snapshot into a moment.js object, for calculations and such
// get the difference between the time the train arrives and the current time, save as a variable for calculations
database.ref().on("child_added", function(snapshot) {
    convertedTime = moment(snapshot.val().startTime, "HH:mm");
    timeUntil = convertedTime.diff(moment(), "minutes");

    // if the time until the next train in minutes is negative, we know the train came some time in the past, and that we need to figure out how many minutes ago the last train was. that time will be negative and I got it by doing the modulus thing with the time between now and when the train last came and the intervals that the train comes in.
    // I honestly don't know why this works, okay? math is not my strong suit. I fucked around until it made sense.
    // anyway, that tells you "the train came (x) many minutes ago".
    // after that, I added the interval frequency to the minsTil; we can't get a positive number from the negative number modulus, and if minsTil is 0 that means the train is coming in exactly the interval time, and if it's a negative number that means some of the time has already passed until the next train comes.
    // then I add that to the nextArrival thing, so we know the next time the train's coming, and then based on that, calculate the number of minutes until that train comes.
    // if the timeUntil variable is positive, the train hasn't come yet--so I just set minsTil to the same number of minutes as timeUntil, added that to the nextArrival thing, and changed the 'currentDiff', which tells you how far away the train is, to timeUntil.
    if(timeUntil < 0) {
        var minsTil = timeUntil%snapshot.val().timeFrequency;
        minsTil = minsTil+snapshot.val().timeFrequency;
        nextArrival = moment().add(minsTil, "minutes");
        currentDiff = nextArrival.diff(moment(), "minutes");
    }
    else {
        minsTil = timeUntil;
        nextArrival = moment().add(minsTil, "minutes");
        currentDiff = timeUntil;
    }

    // append the information on the train to the table. also, handle errors.
    $("#body").append(`<tr><td>${snapshot.val().name}</td><td>${snapshot.val().place}</td><td>${snapshot.val().timeFrequency}</td><td>${nextArrival.format("HH:mm")}</td><td class="no-border">${currentDiff}</td></tr>`);
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});