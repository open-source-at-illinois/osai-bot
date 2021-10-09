# Contributing

## .env

You will need a discord bot account for testing your code. We will provide one for the duration of this workshop.

Create a .env file in the root of your project, and initialize it with the following information:
```
DISCORD_TOKEN=<BOT_TOKEN>
OSAI_GUILD=<ID of your discord server>
APP_ID=<Client ID of your bot>
```
#### Warning: Make sure you don't commit the .env file

## Adding a new command

1. Create a file the src/commands/ directory
2. Label it <command_title>.ts
3. If you're new to discord.js, copy over the code from one of the existing command files into your new file. ping.ts is a good place to start.
4. Change the code to your specifications.
5. Run `npm run start-full` to test and run your command! 
6. Add comments, name variables properly and write a descriptive commit message.

## Linting

To check for typing and other syntax issues, run `npm run lint`
