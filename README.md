# stock-miner-rebuild
This is an attempt at building Stock Miner on top of _pywebview_ using React on the frontend. 

_DON'T LOOK YET IT'S A COMPLETE MESS!!!_

## Requirements
- Python 3
- Node
- PyWebview
- virtualenv

## Installation

``` bash
npm run init
```

This will create a virtual environment, install pip and Node dependencies. Alternatively 
you can perform these steps manually.

``` bash
npm install
pip install -r requirements.txt
```

On Linux systems installation system makes educated guesses. If you run KDE, 
QT dependencies are installed, otherwise GTK is chosen. `apt` is used for installing 
GTK dependencies. In case you are running a non apt-based system, you will have 
to install GTK dependencies manually. 
See [installation](https://pywebview.flowrl.com/guide/installation.html) for details.

## Usage

_Better development instructions coming soon!_

To launch the application.

``` bash
npm run start
```