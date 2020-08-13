# WebPoint-Boilerplate

Run the following to initialize the repository on your computer:
```
npm install
```

When you are developing, run this command which lets you view the site (with hot reload) on a localhost server; it will give you the address to go to in your browser. If you add new files that it must track, you may have to stop the command and restart it (usually this involves typing ctrl+c a couple of times in the console, confirming that you want to stop the program, and running the following command again):
```
npm start
```

Please make all your changes on a separate branch from the master branch. The title of your branch should be formatted as "[first letter of first name][last name]/[what you are working on]". For example, if I were writing the contact page for a website, I might title my branch "agoldstein/contact-page".

Please split up your work into multiple, smaller commits that include basic increments in functionality. For example, you might have a commit that fixes a bug you found, then a separate commit that adds a feature. Separating them out instead of including them both in one commit allows us to better track (and revert if issues arise) changes.

Before you push, and often throughout development, run the following command. It will run linters over your Pug and JS (it will tell you if you programmed something in an invalid or improper way) and do a test build of the site. If everything is good, they will not output anything. The linters are very picky. Please appease them before you push (you should have no linting errors before pushing unless explicitly told otherwise):
```
npm test
```

After you push your code, you should submit a pull request to merge your branch with the master branch. Include a brief description of the changes you made, but be sure to more thoroughly explain any breaking changes you made to already present functionality. Your code will be tested using the ```npm test``` command described above (so run that command on your own before pushing) and your changes will be reviewed by multiple lead programmers. Then, your branch may be merged with the master branch. If there are simple errors (like a small style error or a typo), one of the lead programmers may fix that themself and then merge the branches. If there are more complicated errors, the lead programmer may ask you to make changes, like fixing a bug, before the code is merged.


Once it is finally time to build and deploy, it may be prudent to create a production branch that has the most recent production build. To do so, use the following commands, but only if you're sure you're supposed to. Please replace [version number] with the actual version number you are at and the URL with the actual Git repo URL. You may need to authenticate if you have not recently authenticated. Please execute the following code in the repository top-level directory:
```
npm run-script build
cd dist
git init
git add -A
git commit -m "Deploy v[version number, like 1.0.0]"
git push -f [URL, like https://github.com/agoldstein03/WebPoint-BoilerPlate] master:deploy
```
  
*Written by Adam Goldstein (agoldstein03) for WebPoint*
