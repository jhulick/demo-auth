max-auth
========================

A test app of MAX Auth security with CAS and OAuth2 + JWT

- compile the app with `mvn clean compile` 
- open a terminal and start the mock CAS server in src/test/cas. README.md there includes operating instructions.
- in a separate terminal start the MAX Auth test app with `mvn spring-boot:run`. This starts the app on localhost port 8080.
- open a browser at http://localhost:8080. At CAS login, you may use any user name.
