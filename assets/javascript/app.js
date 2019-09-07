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

var database = firebase.database();

var name;
var place;
var startTime = "15:30";
var timeFrequency = 30;
var nextArrival;
var timeUntil;
var currentDiff;
var currentTime = moment().format("HH:mm");
var convertedTime;

$("#add-train").on("click", function() {
    name = $("#name").val().trim();
    place = $("#place").val().trim();
    startTime = $("#time").val().trim();
    timeFrequency = $("#frequency").val().trim();

    timeFrequency = parseInt(timeFrequency);

    database.ref().push({
        name: name,
        place: place,
        startTime: startTime,
        timeFrequency: timeFrequency
    });
});

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

    // now that we know when the next train comes, we get the difference in minutes between now and the next train, so we can tell the person how far away the train is.
    // if the train hasn't come yet, this will be literally the same time in minutes as timeUntil, which is repetitive, I guess, but....what can you do. I need a single variable to put in the body of the table.
    // currentDiff = nextArrival.diff(moment(), "minutes");

    $("#body").append("<tr><td>"+snapshot.val().name+"</td><td>"+snapshot.val().place+"</td><td>"+snapshot.val().timeFrequency+"</td><td>"+nextArrival.format("HH:mm")+"</td><td class='no-border'>"+currentDiff+"</td></tr>");
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});