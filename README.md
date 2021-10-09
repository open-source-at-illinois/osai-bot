# OSAI Bot
Open-Source at Illinois' Official Discord bot repo

Made with typescript, discord.js and <3

## Required Software

1. Git
2. nodejs >= 16.10.0
3. NPM

## Installation and setup
1. Install the latest version of [git](https://git-scm.org)
2. Install the latest release (not LTS) version of Nodejs (v 16.10.0 or up) [https://nodejs.org/en/download/current/](https://nodejs.org/en/download/current/)

## Contributing
1. Create a fork of this repo [https://github.com/open-source-at-illinois/osai-bot](https://github.com/open-source-at-illinois/osai-bot).
    #### Clone the forked repo
    ```
    git clone "https://github.com/your_username_/Project_Name.git" osai-bot
    cd osai-bot
    ```
 2. Go look at the Issues tab [here](https://github.com/open-source-at-illinois/osai-bot/issues) to find interesting contributions to make
    * NOTE: If you have an idea for implementing your own command, let us know and feel free to work on it instead!
 4. Comment "Working on this" on the issue you're going to patch.
 5. Create a file labelled `<command_title>.ts` in the `src/commands/` directory.
 6. Code! Follow clean syntax and styling guidelines consistent with the rest of the codebase.
    * TIP: Refer to the sample code in the /cat and /dice commands under [src/commands](https://github.com/open-source-at-illinois/osai-bot/tree/main/src/commands)
    * NOTE: If you're new to discord.js, copy over the code from one of the existing command files into your new file.
 7. Commit and push your patches, then make a pull request from your fork to this repository.
    * TIP: Refer to the Git Command Bank below
 8. We will review your code and suggest some fixes for you to work on.
    
 Congratulations! Once your code is fixed, it will be merged into the existing codebase and permanently featured on our Discord server <3 

## Testing
You will need a discord token for testing your code. We will provide one for the duration of this workshop.

1. Create a `.env` file in the `osai-bot` folder and paste the discord token
2. Run `npm install` to install the required dependencies
3. Run `npm run start-full` to get the `Canary` bot up and running!
4. Go to the `#testing` channel in the OSAI discord server, and test out your command using the `Canary` bot.
   
## Git Commands Bank
* `git clone <url> <alias>`
* `git status`
* `git add <optional: filenames>`
* `git commit -m "<commit message>"` : ensure commit message adheres to the respective guidlines. Ex: feat-132-CRM-revamp
* `git push origin main`
* `git pull`
* `git checkout -b "<branch_name>"`

Workshop slides: [https://docs.google.com/presentation/d/10Y23KrYWuA4epP0soXQKhlwYsC9Ecp2Ta15KOmDXyBg/edit?usp=sharing](https://docs.google.com/presentation/d/10Y23KrYWuA4epP0soXQKhlwYsC9Ecp2Ta15KOmDXyBg/edit?usp=sharing)
