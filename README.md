<h1 align="center">ft_transcendence</h1>

<p align="center">
	<b><i>This is a 42school's project that is about creating a pong website with many additional features.</i></b><br>
</p>
<p align="center">
	<img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/iSurfiNex/ft_transcendence?color=lightblue" />
	<img alt="Number of lines of code" src="https://img.shields.io/tokei/lines/github/iSurfiNex/ft_transcendence?color=critical" />
	<img alt="Code language count" src="https://img.shields.io/github/languages/count/iSurfiNex/ft_transcendence?color=yellow" />
	<img alt="GitHub top language" src="https://img.shields.io/github/languages/top/iSurfiNex/ft_transcendence?color=blue" />
	<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/iSurfiNex/ft_transcendence?color=green" />
</p>
<div align="center">
	<img width="180px" src=".readme/final-note.png" alt="Final score">
</div>

# Table of Contents

- [Preview](#preview)
- [Information](#information)
- [Installation](#installation)
- [Usage](#usage)

# Preview

<h3 align="center"><b>Login page</b></h3>
<div align="center">
	<img alt="Login page" src=".readme/preview/login-page.png"/>
</div>

<h3 align="center"><b>Home page</b></h3>
<div align="center">
	<img alt="Home page" src=".readme/preview/home-page.png"/>
</div>

<h3 align="center"><b>Game list + Player list</b></h3>
<div align="center">
	<img alt="Join-list page" src=".readme/preview/join-list-page.png"/>
</div>

<h3 align="center"><b>Game's Waiting room</b></h3>
<div align="center">
	<img alt="Waiting room page" src=".readme/preview/waiting-room-page.png"/>
</div>

<h3 align="center"><b>Tournament's Waiting room + Chat</b></h3>
<div align="center">
	<img alt="Tournament Waiting room page" src=".readme/preview/tournament-waiting-room-page.png"/>
</div>

<h3 align="center"><b>The Game (power-ups version)</b></h3>
<div align="center">
	<img alt="Game page" src=".readme/preview/game-page.png"/>
</div>

<h3 align="center"><b>Profile page</b></h3>
<div align="center">
	<img alt="Profile page" src=".readme/preview/profile-page.png"/>
</div>

<h3 align="center"><b>Mobile support</b></h3>
<div align="center">
	<img alt="Mobile support vertical" src=".readme/preview/mobile-support-vertical.png"/>
	<img alt="Mobile support horizontal" src=".readme/preview/mobile-support-horizontal.png"/>
</div>

<h3 align="center"><b>Grafana page (monitoring)</b></h3>
<div align="center">
	<img alt="Grafana page" src=".readme/preview/grafana-page.png"/>
</div>
</br>

# Information

In this project, we had a mandatory part and some modules to do. The mandatory part gives 25pts, and the objective for us was to go to 125pts.

100pts means the project is done, over 100pts means with bonus, max is 125pts.

To do so we had a list of modules that we can do to earn points, down below are the one we chose.

## Modules :
### Web
<img alt="Django" src=".readme/icons/django.png" width="13px"/> Django ➝ 10pts \
<img alt="Bootstrap" src=".readme/icons/bootstrap.png" width="13px"/> Bootstrap ➝ 5pts \
<img alt="PostgreSQL" src=".readme/icons/postgresql.png" width="13px"/> PostgreSQL ➝ 5pts

### User management
<img alt="Standard user management" src=".readme/icons/user-management.png" width="13px"/> Standard user management ➝ 10pts \
<img alt="42 Login" src=".readme/icons/42-login.png" width="13px"/>  OAuth 2.0 with 42 ➝ 10pts

### Gameplay and user experience
<img alt="Remote player" src=".readme/icons/remote-player.png" width="13px"/>  Remote player ➝ 10pts \
<img alt="PowerUps" src=".readme/icons/powerups.png" width="13px"/> Game cusomization options (powerups and random maps) ➝ 10pts \
<img alt="Chat" src=".readme/icons/chat.png" width="13px"/> Live Chat ➝ 10pts

### AI-Algo
<img alt="AI" src=".readme/icons/ai.png" width="13px"/> AI Opponent ➝ 10pts \
<img alt="Dashboards" src=".readme/icons/dashboards.png" width="13px"/> User and Game stats dashboards ➝ 5pts

### DevOps
<img alt="Monitoring" src=".readme/icons/monitoring.png" width="13px"/> Monitoring system (grafana) ➝ 5pts

### Graphics
<img alt="3D" src=".readme/icons/3d.png" width="13px"/> Implementing 3D ➝ 10pts

### Accessibility
<img alt="All devices" src=".readme/icons/mobile.png" width="13px"/> Support on all devices ➝ 5pts \
<img alt="Browser" src=".readme/icons/browser.png" width="13px"/> Expand browser compatibility ➝ 5pts \
<img alt="Multiple language" src=".readme/icons/language.png" width="13px"/> Multiple language supports ➝ 5pts

### That bring us to a total of 115pts + 25pts of the mandatory part which made 140pts.

# Installation

Firstly, create your own .env using the example one.

You need to change all ``SERVER_IP`` by the server ip (wow). \
Create, if you want, a webhook for alertmanager (not necessary, the server will still work if not set, you will just not receive any notifications in case of critical situations). \
Change, if you want, the ``API_SECRETKEY`` and ``API_CLIENTID`` by your 42's app. And to make the login through 42 work you also need to change the ``client_id`` in the request by your own at this location :

``backend/transcendence_backend/static/pages/Login.js, 294.`` \
``backend/transcendence_backend/static/pages/UpdateProfile.js, 185.``

After that, all you need to do is either:

```bash
make
```
**OR**
```bash
docker compose up --build
```

# Usage

The main website is accessible at ``https://SERVER_IP:8000`` (set in .env).

Grafana is accessbile at ``https://SERVER_IP:3000``.
