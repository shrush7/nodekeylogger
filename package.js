{
  "name": "custom-node-keylogger",
  "version": "0.1.0",
  "description": "Custom Node.js keylogger using event listeners",
  "main": "dist/main.js",
  "scripts": {
    "build": "babel --presets @babel/preset-env src/ -q -d dist/",
    "prepare": "npm run build",
    "test": "echo \"Tests not implemented yet\" && exit 1"
  },
  "keywords": [
    "keylogger",
    "keyboard-input",
    "nodejs",
    "linux"
  ]
}
