demo-auth
========================

A test app of Auth security with CAS and OAuth2 + JWT

- download js dependencies via bower. Open a terminal and cd to src/main/resources/static, and issue `bower install`.
- compile the app with `mvn clean compile` 
- open a terminal and start the mock CAS server in src/test/cas. README.md there includes operating instructions.
- in a separate terminal start the Auth test app with `mvn spring-boot:run`. This starts the app on localhost port 8080.
- open a browser at http://localhost:8080. At CAS login, you may use any user name.
