module.exports =

{
  "presets": ["babel-preset-expo"],
  "env": {
    "development": {
      "plugins": []
    },
    "production": {
      "plugins": ["transform-remove-console"]
    }
  }
}

;
