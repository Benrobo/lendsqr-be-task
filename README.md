# Lendsqr Backend Assessment

[View the assessment requirements](/task.md)
.
[API Explanation](https://benrobo.notion.site/Lendsqr-API-doc-e51845e922914365b613b166374b8e3b?pvs=4)
.
[API Postman Documentation](https://documenter.getpostman.com/view/12455396/2s9YRGxUAM)

#### E-R Diagram

![erd diagram](https://raw.githubusercontent.com/Benrobo/lendsqr-be-task/main/md_assets/db_ERD.png)

#### API Testing

![test script](https://raw.githubusercontent.com/Benrobo/lendsqr-be-task/main/md_assets/lendsqr-test.gif)

## Assessment Setup 🔼

Before setting up this assessment, make sure you have the following package installed locally:

- [Mysql](https://dev.mysql.com/downloads/installer/)
- [Xampp (optional)](https://www.apachefriends.org/fr/download.html)
- [Node (LTS Version)](https://nodejs.org)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)

Setting up this assessment locally can be done by following the steps below:

- #### Clone the repo :one:
  Clone the github repo using the command below

```bash
git clone https://github.com/Benrobo/lendsqr-be-task.git
```

- #### Install local dependencies :two:
  Install the dependencies using yarn.

```bash
 ➡️ lendsqr-be-task git:(main) ✗ yarn install
```

- #### Create a local database :three:
  Create a local database using either a database client like `xampp, Mysqlworkbench` or running the below sql command.

```sql
 CREATE DATABASE lendsqr;
```

- #### Create a .env file in root directory :four:
  Create a `.env` file in the root directory and add the following content.

```bash
    DB_HOST="localhost"
    DB_USER="root"
    DB_PASSWORD=
    DB_NAME="lendsqr"

    NODE_ENV="development"

    JWT_SECRET="sdcsdcdc32ry38y9dpnp23i3892te832tp9e23on"
```

- #### Run DB migrations :four:

  Before starting up your local server, run the migration file present in `./src/config/db/migrations/20231003210951_init.ts` using the package.json script command `runMigrate:dev`. This would apply all the needed migrations in your local database.

  > :warning: Make sure mysql service is installed and running.

```bash
 ➡️ lendsqr-be-task git:(main) ✗ yarn runMigrate:dev
```

- ### Start local server :five:
  Start the local development server using the command below.

```bash
 ➡️ lendsqr-be-task git:(main) ✗ yarn dev
```

The following command should be printed to the console if successful.

```
2023-10-27 21:05:05 PM [info] : Server started at http://localhost:8080
```

- ### Testing :six:
  To test all api endpoints, visit the following endpoint on the browser `http://localhost:8080/api/docs`, this would display the api documentation in swagger format.

Congratulations 🎊 for making this far.
