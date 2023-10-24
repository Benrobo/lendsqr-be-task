import AuthRoute from "routes/auth.route";
import App from "./app";
import UserRoute from "./routes/user.route";
import WalletRoute from "./routes/wallet.route";

const server = new App();
server.initializedRoutes([new UserRoute(), new AuthRoute(), new WalletRoute()]);
server.listen();
