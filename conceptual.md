### Conceptual Exercise

Answer the following questions below:

- What is a JWT?
  > JWT ("jots") are encrypted keys used to communicate user info between the back end and the front end. These can be sent through the JSON body or through an authentication method attached to the header (like a "Bearer Token" authentication type). The information encrypted within the JWT can include anything, but most commonly contains the base user info, whether they're an admin, and their level of access for the website. 

- What is the signature portion of the JWT?  What does it do?
  > The signature portion of a JWT contains the encrypted information such as user data and the header which often contains authentication type (like JWT) and hashing algo used (like Base64). It is the header + the payload, signed with the secret key, and base64 encoded. It verifies the integrity of the JWT. 

- If a JWT is intercepted, can the attacker see what's inside the payload?
  > No, the attacker needs the secret key to decode the JWT. 

- How can you implement authentication with a JWT?  Describe how it works at a high level.
  > Once the user creates an account or logs in, the server uses the JWT package and the secret key (hidden in an env variable) to encrypt the header and the payload and turns it into a 3 part string (header, payload, and signature). The header contains the token type (JWT) and hashing algo used (Base64). The payload contains data about the user, primarily the authentication level (user or admin). The signature is the payload and header combined, signed and encrypted into a string that only the server can verify and approve using the secrety key. This 3 part string (JWT) is then sent back and forth between the front and back end and is included in the Authorization header to allow the user to access the correct routes.  

- Compare and contrast unit, integration and end-to-end tests.
  > Unit tests check if a function is working as intended in isolation. Integration test checks if a function works in conjunction with other code, like an endpoint or database. End to end tests check if the application works from the UI down to the response received from the back-end. End to end tests simulate real world scenarios. 

- What is a mock? What are some things you would mock?
  > A mock simulates dependencies of all types. You could mock an API response, a function that has random results, or database interactions. A mock enables users to isoluate the code being tested from extrenuous variables. 

- What is continuous integration?
  > Continuous integration is writing smaller pieces of code and merging them together constantly. After each merge, the code should be tested focusing on core functionality still working well after each integration. 

- What is an environment variable and what are they used for?
  > Environment variables are usually secret keys or API keys stored as key value pairs. They are usually tested by checking that data stored as a kv pair in a .env file can be pulled from. 

- What is TDD? What are some benefits and drawbacks?
  > TDD is an uncommon developmental practice where tests are written first and code is written afterwards. This helps catch bugs right away and ensures code meets core functionality. The drawback is it's time consuming and can hinder speed of development. Additionally, tests can be incomplete or incorrect. 

- What is the value of using JSONSchema for validation?
  > JSONSchema quickly validates data before it is passed through to a database. JSONSchema checks if each piece of data in a JSON body is what it should be, and not something else (ie. emails are emails, names are names, etc). 

- What are some ways to decide which code to test?
  > Always test the core functionality of an app. Other elements (such as UI elements or code that often changes) don't need to be 100% tested. Always test high-risk components and anything impacting system stability. 

- What does `RETURNING` do in SQL? When would you use it?
  > RETURNING is used when you need to send data back to the front-end or the user interacting with an API based off of changes made to the database. When you "SELECT" data, whatever you selected is returned. When you update pieces of existing data, nothing is returned. This is when you would use RETURNING. 

- What are some differences between Web Sockets and HTTP?
  > Web Sockets enable real time connections between clients and servers, whereas HTTP is based on requests and responses. Web Sockets are a persistent connection (bidirectional) and HTTP requests are unidirectional (closed after each exchange)

- Did you prefer using Flask over Express? Why or why not (there is no right
  answer here --- we want to see how you think about technology)?
  > In terms of core functionality, I still prefer Flask as I have more experience with it and it seems to be more flexible for protyping and adding and removing routes. Express seems to be easier to write tests for. I'm sure overtime as I work with Express it will grow on me. 
