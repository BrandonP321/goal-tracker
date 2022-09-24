# **Leaps 'n' Bounds - Goal Tracking App**
Leap 'n' Bounds is a full stack web application that allows users to create goals and assign them to one of four categories: today, week, month, or unassigned goals.  Users then have full CRUD functional control over all of their goals, allowing them to delete & update goals, as well as move them between lists and mark them as complete.

<br>

## **Motivation**
---
The primary motivation for this app was to have a new project to add to my portfolio.  Having spent the past year and a half working for a company who's code base is private, I had little to show in terms of the quality of code I can write.  Because of this, I chose to pursue a project that would demonstrate how I would approach a medium to large scale app.  Even though this project itself is quite small, I built the architecture in a way that would allow it to scale into a much larger project, allowing me to demonstrate my full stack architecture abilities even more.

<br>

## **Architecture**
---

### **Monorepo**
Due to the fact that I knew I would have a Typescript backend & frontend, I decided to use yarn workspaces to allow for a monorepo structure.  This allowed for very easy sharing of Typescript type definitions, utilitly classes, and more.  These 2 packages (server & web client) shared components via a third shared package, which contains all of the shared components.  Using a monorepo all makes it easy to start up both the web client and the node server at the same time, made possible by using concurrently to run them in parallel within the same terminal window.

<br>

### **Front-End**

#### **Routing & Code Splitting**
The site routing is easily handled by a route definitions utility class, which simply maps over an array of route objects and returning a React \<Route> with the appropriate props passed in.  Each of these route objects takes in a dynamic import for a tsx file with a default import, which is then used along with Reacts lazy and suspense API to introduce code splitting, improving the sites performance, especially if it were to scale even more.

#### **State Management**
For managing a global state, I decided to go with Redux given it's popularity, quality of documentation, and overall capabilities & integration with React.  A global state management solution was required for 3 thrings: holding on to user data that needed to be displayed across the site, controlling the 'display status' of a page wrapping loading spinner, and providing the status of all CSS breakpoints for responsive Typescript code.

<br>

### **Back-End**

#### **Authentication**
To allow for a statless user authentication flow, I went with JSON Web Tokens for storing essential user auth data and managing a user's authentication state.  When users log in, they are assigned an access and refresh token, with respective expiration times of 8 hours and 7 days.  Upon creation of these tokens, they are both assigned the exact same 'jwt id'.  This ID is also stored in the user's document in the database.  The purpose of this ID is to verify that when an access token needs to be refreshed, the refresh token must have the same id assigned to it as the access token, and the user's document in the db must also have the same id.  Then when the token is refreshed, that ID is removed from the DB, ensuring that a refresh token can only be used once, and it can only be used on the access token it was assigned the same ID as.  In the [challenges](#challenges) section below, I'll discuss why I was [unable to store these auth tokens in secure http cookies](#authentication-with-cookies), which would have been significantly more secure than the storage method I ended up settling with for this project given its scope.

#### **Database**
This project uses MongoDB with the Mongoose ORM for storing data.  Given the limited number of Models that needed to be created and the overall structure of the data that needed to be represented in the database, using a NoSQL schema made the most sense in terms of simplifying the process of going from querying the database to sending a JSON response to the web client.

#### **Middleware**
Because almost all of my professional work has been front-end related, one of my largest goals for this project was to clean up my back end code quite a bit.  One of the most important changes I made to achieve this goal was through the use of multiple middleware functions.  The first was essential: the JWT authentication middleware.  This needed to exist on every protected endpoint to ensure only an authenticated user was accessing it.  The other middleware function that made a huge impact was a function that would use the user's id (which was retrieved in the jwt auth middleware) to fetch the user's document from the database and store it as a local variable on the response object of the request.  I could then handle any logic for sending error codes to the client if the user's doc could not be retreived.  This made it so that by the time the request made it to the final controller that would send a JSON response back to the client, we knew that there were no issues authenticating the user or retreiving the user's doc from the database.  This removed a lot of non-DRY code where I was repeatedly writing the logic for grabbing the user's doc from the database and handling any errors.

<br>

## **Challenges**
---

### **Authentication with Cookies**
By far, the biggest challenge I ran in to was storing the JWTs in cookies.  During the entire development process, I was only testing the app in chrome on both my Windows desktop and Android phone.  It wasn't until I was entirely done with everything that I decided to start testing on my IOS test device.  I expected there to be a design flaw or two, but as soon as I tried logging in I was getting errors.  What I was not aware of is that Apple made a decision a few years back to not allow cross-domain tracking of cookies on Safari.  Because I was unaware of this when I began working on this app, I didn't see the problem with hosting my server on Heroku and my React app on AWS Amplify.  At this point, it was too out of scope to refactor all the code that would need refactoring to have these 2 aspects of this project exist on the same domain.  I made the decision to just store the tokens in local storage, even though that presents a huge security concern, and leave all the old code commented out.  Because this project is only designed to go on my portfolio, rather than spend time I don't have fixing this one problem, I figured I'd be better off explaining why I couldn't use cookies, and then work to avoid this problem on my next project.

<br>

## **Installation & Usage**
---

1. To start, simply clone this repository to your local machine with the following comman
	```
	git clone https://github.com/BrandonP321/goal-tracker.git
	```
2. While in the root level of the monorepo, install all dependencies
	```
	yarn install
	```
3. Create a .env file in the packages/server directory with the following keys
	- CORS_ORIGIN
	- SECRET
	- ACCESS_TOKEN_SECRET
	- REFRESH_TOKEN_SECRET
	- REFRESH_TOKEN_EXPIRES_IN
	- ACCESS_TOKEN_EXPIRES_IN
	- ENV
4. Create a .env file in the packages/web directory with the following keys
	- REACT_APP_API_DOMAIN
5. Run the following to start & run the server and the web client at the same time
	```
	yarn web:start
	```