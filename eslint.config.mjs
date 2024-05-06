import globals from "globals";
import pluginJs from "./src/js/index";


export default [
  "airbnb-base",
      {
       files: ["**/*.js"],
       languageOptions: {
         sourceType: "script",
         parserOptions: {
           ecmaVersion: "latest",
           sourceType: "module"
       },
       },
       rules: {
       "no-trailing-spaces":"off",
       "linebreak-style": ["error", "windows"]
       }
    },
    {
    languageOptions: { 
      globals: globals.browser
     }
    },
];