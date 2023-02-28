## DB Preparation
___

#### Create a database with the name `user_api_db` and `jest_db`

## Installing packages
___

#### Run `npm install` or `npm i`

## Migrating
___

#### Run `npm run migrate` to create users table
#### Run `npm run migrate down` to drop users table
## Testing
___

#### Run `npm run test`

## Seeding
___

#### To seed users run:
    npm run seed <user-count>


## Docker
___

#### Building docker image

    docker build -t <tag-name> .

#### Running docker image locally

    docker run --rm -d <tag-name>
