/*
 * Copyright (c) 2021 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

const fs = require("fs");

const filePath = "./tslintresult.xml";

try {
    let content = fs.readFileSync(filePath).toString().split("\n");
    content.shift();
    content.shift();
    content = content.join("\n");
    fs.writeFileSync(filePath, content);
} catch (e) {
    console.error(e);
    console.log("Error while trying to fix", filePath);
}
