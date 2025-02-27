# ProgrammableTrains

- **Play the game now at  [https://solbiatialessandro.github.io/trainfinity/](https://solbiatialessandro.github.io/trainfinity/)**
- Watch a demo at [https://www.youtube.com/watch?v=AeTpLTWt4NQ](https://www.youtube.com/watch?v=AeTpLTWt4NQ)

![](https://i.ytimg.com/an_webp/AeTpLTWt4NQ/mqdefault_6s.webp?du=3000&sqp=CNj_xo8G&rs=AOn4CLAOVWRX6pJAHciCFDBbEXsORcV4Qw)

![](https://github.com/SolbiatiAlessandro/trainfinity/blob/master/render.png?raw=true)
![](https://github.com/SolbiatiAlessandro/trainfinity/blob/master/demo.png?raw=true)
![](https://github.com/SolbiatiAlessandro/trainfinity/blob/master/Screenshot%202022-01-19%20at%2003.52.02.png?raw=true)

You are a train engineer. You have been charged of building a railway to bring 100 units of coals to the factory. Watch out your trains don't run out of coal!

Fun fact: trains are programmable javascript snippets

To run the game: clone repo, python3 -m http.server, open index.html

GAME STORY:
- if all train run out of fuel game over
- build railway bring 100 coal to factory
- now factory trust you and pays you 10$/coal, build railway that generate 100$/minute
- you are generating 100$/minute so the bank give you a loan of 10000$. You can now build a...

GAME FEATURES:
- [ ] highest score (leaderboard)
- [ ] autosave: game save every 1 minute
Saving looks like a feature that would really improve game duration. What do we need to serialise?
- player (level)
- grid, what is on every block. For every building (coal, level)
- locomotives + wagons
- code on the computer

- [- ] build better creation toolbox (1 image for each buildable train, capacity: vagons)
- [ ] make train stop if it go one direction
- [x] **delete railway**
- [ ] **fix unreadble text when two text boxes collide**
- [x] introduce money
- [x] paid money to sell coal to factories
- [x] achievement: money per minute
- pause game
- factories produce steel with 100 coal
- factorioes buy steel for more money
- use money to buy vagons so that train last longer
- mines get upgraded as game progresses
- buy bridges with money
- intermediary stations
- show current game goal

PROGRAMMABLE FEATURES:
- **make code not hackable (all getter and setters, don't access directly)**
- UX feedback whe update code
- [x] PROGRAMMABLE (write access to player) TRAINS
- PROGRAMMABLE (read access to player) mines and factories
- [x] give access to memory (e.g. global dictionary)
- make interaction happen after stop train
- [x] access to station and name trains?
- code size -> train speed

BUGS:
- [half fixed] mines work only if approached from left and bottom
- if coal goes down from one mine goes down also from other mines?


UX:
G
- he didn't read the tutorial
- doesn't understand how to put down railway
- put train and get stack cause railway is in ugly place
- doesn't understand how to get railway to take coal from mine, try to get railway on top of mine
- confused with intersections

-----

Forked from (https://github.com/Godsmith/trainfinity)

# Trainfinity

Strategy game about trains, written in JavaScript.

Online at https://trainfinity.netlify.com .

Requires Chrome.



