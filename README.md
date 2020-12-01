# Mythic Phone | WIP
This is a custom phone written for Mythic RP. It is replacing an existing port of GCPhone after having loads of issues with trying to successfully port. This is very much a Work In Progress and you should not even look into using this unless you're prepared to do a shitload of work.

## Dependencies
* Mythic Base | Not Released
* Mythic Inventory | Not Released
* [GHMattiMySQL](https://github.com/GHMatti/ghmattimysql)
* [Salty Tokenizer](https://forum.fivem.net/t/release-dev-server-event-security-tokens-anticheat/139189)
* ???

> This is a WIP resource so this dependency list is very likely to expand as features are added.

### Comments
Due to the scope of this project expanding I've ended up adding in some various resources to aid in making the files that need to be included for the phone to funciton in-game end up minified and compressed into as few files as possible but while retaining readability and breaking up the code into logical sections. So due to this you'll need a few things in order to get this working from the source alone.

* SASS/SCSS - This will just require you to have any sort of ability to compile SASS into a CSS stylesheet. I personally use the [Live SASS Compiler](https://marketplace.visualstudio.com/items?itemName=ritwickdey.live-sass) extension for Visual Studio Code. But again, any SASS compiler will work to compile the Materialize source as well as my custom styling for the phone. And below are the settings I use to get it to build correctly in the right location:

```json
"liveSassCompile.settings.formats":[{
        "format": "compressed",
        "extensionName": ".min.css",
        "savePath": "~/../"
    },
],
```

> Note: Would love to get this added into the webpack for below, but little experience with webpack so haven't been able to actually get it to work. If you're aware of how to do that feel free to make the change and submit a PR. I'll love you forever lol.

* JS - Due to how I have the JavaScript structured I have opted to setup webpack to minify the files into a single file. This makes it far easier to add content in the future and not have to mess around with importing as well as ensures the file that's being included in the manifest file will always be the one that has all the data for it. Not sure if there's any sort of major performance issues, but meh. Should be able to just run npm install (or yarn install) and assuming you have npm/yarn it'll install the packages needed to build. CD into the html directory and use npm run build and it will build the minified JS file.

> Note: You can in theory just change the manifest to include the regular JS files as well as add them being included in the HTML file and it'll work. But I will not give any guarantee that it'll work doing so. It's also using ES6 modules so you may end up with errors because of that.

#### Libraries Used
* [jQuery](https://jquery.com/)
* [jQuery Inputmask](http://igorescobar.github.io/jQuery-Mask-Plugin/)
* [jQuery UI](https://jqueryui.com/)
* [Materialize](https://materializecss.com/)
* [Moment.js](https://momentjs.com/)
* [FontAwesome](https://fontawesome.com/)

------

# Issues
FOR THE FINAL TIME, THIS IS A WIP RESOURCE THAT IS NOT INTENDED FOR ANYONE TO ACTUALLY USE. If you decide to ignore the numerous warnings and make issues asking why shit doesn't work it'll just end up deleted. You'll also be blocked which applies [these](https://help.github.com/en/articles/blocking-a-user-from-your-organization) effects. So let's not, yeah?

------

# Screenshots

### Home
![Home Screen](https://i.imgur.com/oQBKg8X.png)
![Home Screen](https://i.imgur.com/7xH1BkE.gif)

### Contacts
![Contacts App](https://i.imgur.com/1FcOcJc.png)
![Contacts App](https://i.imgur.com/xL9I0xq.png)
![Contacts App](https://i.imgur.com/3tyUB7p.png)
![Contacts App](https://i.imgur.com/kNQOc14.gif)
![Contacts App](https://i.imgur.com/ItGpCwf.gif)
![Contacts App](https://i.imgur.com/2sBWhZY.gif)

### Phone
![Phone App](https://i.imgur.com/6zo2A7x.png)
![Phone App](https://i.imgur.com/EQLigc1.png)

### Messages
![Messages App](https://i.imgur.com/H2lae7o.png)
![Messages App](https://i.imgur.com/FSVIusg.png)
![Messages App](https://i.imgur.com/t3CSGm2.png)
![Messages App](https://i.imgur.com/8OaYbbY.gif)