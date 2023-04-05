<!-- Bugs -->
1- module.exports = app; is listed 2x on app.js
2- User cannot patch own route. Updated user route to allow patching self. Added tests.
3- User can currently set self to admin, only admins should do that. Updated          
    User routes and added tests to cover all scenarios
4- Changed auth middleware to jwt.verify instead of jwt.decode - decode doesn't verify
    if jwt is legit and generated by the server. 
5- Updated getAll in user model to return basic info only, as specified in route. Added
    additional tests to make sure only the basic user info keys are returned.
6- Await missing from User.authenticate in routes/auth.js
7- Added throw to new ExpressError in model user.js get method

<!-- Not Really Bugs but made these changes -->

Grouped together beforeEach, afterEach, afterAll tests to beginning of route tests. 
CreateToken helper function used as CreateTokenForUser sometimes, could be confusing
added test to make sure u1 user cannot patch u2 user route