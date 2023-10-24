import AuthRoute from "routes/auth.route";
import App from "./app";
import UserRoute from "./routes/user";

const server = new App();
server.initializedRoutes([new UserRoute(), new AuthRoute()]);
server.listen();
