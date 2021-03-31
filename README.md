# Atalanta Goal Alert

This is a solution to the [Pod request access landing page challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/pod-request-access-landing-page-eyTmdkLSG). Frontend Mentor challenges help me improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The app](#the-app)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The app

As part of a bet I needed to notify my friends every time football club [Atalanta Bergamo](https://www.atalanta.it/en/) scores a goal. Instead of watching everything and sending whats app messages, I decided to make an app for it.

Users need to:
- Get notifications when Atalanta Bergamo scores a goal
- See upcoming and finished matches

### Links

- Live url: [Atalanta Goal Alert](https://goal-alert.herokuapp.com)

## My process

### Built with

- VueJs
- SCSS
- ServiceWorker
- Heroku + StatusCake pinging
- MongoDB
- Express

### What I learned

#### Keeping a server up
The thing I struggled with the most was keeping my server up and running. I need this, because I want the server to have the most up to date info on a visit/refresh every time. It was perfectly possible to get a server up (even though this was my first time using Heroku for a project like this), but it would sleep after half an hour on a free plan.

Solution: ping it. Much easier than I thought it would be.

I first thought it would be a good idea to let the service worker (SW) do that (spoiler: bad idea), because it keeps running. It did not work. It would ping it from different locations. Also, it would need machines to be on, which might not be the case. The SW should not be responsible for keeping a server up.

I tried separating FE and BE into different projects, but that did NOT magically keep the server up. I hosted my separate server on [Glitch](https://glitch.com) as well for a while, but it turned out that it goes to sleep there as well on a free plan. Who would've thought.

I ended up finding a video on [Pingability](https://pingability.com/) when googling "how to keep a heroku server up for free" (in one of my brighter moments) and implemented that. When I was about to have to pay for that as well, I switched to [StatusCake](https://statuscake.com), which did the job in the end.

I refactored the server twice and ended up rewriting the notifications code as well.


#### Refactoring
I also redid the whole frontend after doing a course on CSS, making it nice and flexboxy. I like my trick to have different ways of showing the teams. I copied this style from [LiveScore](https://livescore.com)

I did not get rid of the whole 20-zeroes-feel of the design though. Maybe I should add some MS Word art to it for fun.

### Continued development

- [ ] Add testing for the notifications
- [ ] Ring a sound (not just a vibration) when Atalanta Scores

### Useful resources

- [PWA course](https://www.udemy.com/course/progressive-web-app-pwa-the-complete-guide/) - Learnt a lot about Progressive Web Apps, including the notifications used here
- [Advanced CSS and SASS](https://www.udemy.com/course/advanced-css-and-sass/) - Needed this to inspire me to ditch the <table> and make everything flexboxy.
- [Node server tutorial](https://www.youtube.com/watch?v=k_0ZzvHbNBQ) - Used this video on Node js server as a reference
- [Football data](https://www.football-data.org/) - A great API for free football data used in this app

## Author

- Website - [Joran Minjon](https://joranminjon.com)
