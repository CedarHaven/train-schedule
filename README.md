# train-schedule
This is a train scheduling thing. You enter a train name, destination, how frequently the train comes, and when the train starts coming, and then the table of trains is updated with the train's name, destination, the next time it's coming based on the current time, and how many minutes away it is. It uses Firebase to store train information. The train table assumes no delays, ever, and updates pretty much only if you reload the page. It runs on proper military time, meaning that there are no AM or PM markers on the schedule display, and also meaning that if you want to have a train start at any time past noon, you need to enter the time according to military time.

## Installation

You can use Git Bash to clone the repository onto your computer by entering the following in Git Bash:
```git clone https://github.com/juniperhaven/train-schedule.git```
After doing so, open the folder you've downloaded, right click 'index.html' and open in your browser of choice.

Alternately, the project is hosted on Git Pages at https://juniperhaven.github.io/train-schedule/