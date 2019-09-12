# Train-Schedule

This is a train scheduling thing. There's a form where you can enter a train name, destination, how frequently the train comes, and when the train starts coming (in military time), and then the table of trains is updated with the train's name, destination, the next time it's coming based on the current time, and how many minutes away it is based on what you entered. There is no stop time for the trains. It runs on military time, meaning that there are no AM or PM markers on the schedule display.

This project uses Firebase to store data, and moment.js for time calculations.

## Installation

You can use Git Bash to clone the repository onto your computer by entering the following in Git Bash:
```git clone https://github.com/juniperhaven/train-schedule.git```
After doing so, open the folder you've downloaded, right click 'index.html' and open in your browser of choice.

The project is also hosted on Git Pages at https://juniperhaven.github.io/train-schedule/

## Usage

Enter a train name. Anything should work, including an empty string. Enter a destination. Again, anything will work, including an empty string. Then enter a time. This runs on military time, so things like "5:50" or "05:50" will be assumed to be AM times. "00" as the hour will be midnight. You can include letters in this but it won't make a difference to how things are calculated or print out. Enter the frequency in minutes. You can enter very long minute times like "6000". Letters will break the calculations.

Refresh the page to see updates in time.
