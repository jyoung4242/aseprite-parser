[![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/bukotsunikki.svg?style=social&label=Follow%20%40jyoung424242)](https://twitter.com/jyoung424242)

<h4 align="center">TypeScript based Aseprite Parsing Module</h4>

![Screenshot](/screenshot.png?raw=true "Screenshot")

# 👋 Introducing `aseprite-parser`

`aseprite-parser` is an simple npm package that allows users to pass the _.ase or _.aseprite file, and can pull images, animations, and spritesheets out

# 🔥 Features

`aseprite-parser` comes with a bundle of features already. You can do the followings with it:

## 🔢 Pass relative path or file object

- Gives flexibility in its usage

## 🏗️ Can pull whole spritesheets or individual images out of the parser

![Frames](/frames.png?raw=true "Frames")

- Spritesheets can be configured by rows/columns, or it can be split into an array of individual images

## 📢 If animation tags are used in aseprite, the animation frames tied to that tag can be pulled out

- this can be extracted as a spritesheet, or as an array of images

![Tags](/tags.png?raw=true "Tags")

## 💘 You can also pull the color palettes, animation tags, and drawing layers out of the module

![Palette](/palette.png?raw=true "Palette")
![Layers](/layers.png?raw=true "Layers")

# Usage

## Getting Started!!!!

1. Navigate to your current project where you need Aseprite files parsed

2. `npm -i aseprite-parser`

3.

```js
import { AsepriteParser } from "./components/Aseprite";
```

4.

```js
const myAsepriteParser = new AsepriteParser("./src/myAsepriteFile.aseprite");
myAsepriteParser.initialize();
```

5.

```js
const mySprite = myAsepriteParser.getImage(0);
```

or some of the other methods to extract images...

# API

## Exported Types

### AsepriteHeader

```ts
export interface AsepriteHeader {
  fileSize: number;
  imageWidth: number;
  imageHeight: number;
  frameCount: number;
  colorDepth: number;
}
```

### AsepriteFrame

```ts
export interface AsepriteFrame {
  layers: Array<FrameLayer>;
  duration: number;
  image: HTMLImageElement;
}
```

### AsepriteLayer

```ts
export interface AsepriteLayer {
  layerID: number;
  layerName: string;
}
```

### AsepriteTag

```ts
export interface AsepriteTag {
  startIndex: number;
  endIndex: number;
  tagName: string;
}
```

### SpriteSheetOptions

```ts
export interface SpriteSheetOptions {
  frames: Array<number> | "all"; // 'all' has been added to imrove dev experience
  rows: number;
  cols: number;
}
```

## Properties

### header

- AsepriteHeader containing properties that are tied to the overall file in accordance with the AsepriteHeader interface above.

### frames

- Array of AsepriteFrames

### tags

- Array of AsepriteTags

### layers

- Array of AsepriteLayers

### palette

- Array of strings, all of which are color codes i.e. `#000000ff`

### loaded: boolean

- Boolean flag that becomes set once the Aseprite file is properly parsed

## Methods

### getTags()

    params - none
    returns - Array of AsepriteTag Objects

    This returns that array of 'tags' or animation sequences from Aseprite, and in the object is the frame indexes associated with them.

### getPalette()

    params - none
    returns - Array of color string

    This returns that array of color strings i.e. `#000000ff` that are included in the Aseprite file that's parsed

### async getTaggedAnimation(tag: string, split: boolean = true)

    params

    - `tag` : string, this is the Aseprite tag that's used to indicate an animation sequence
    - `split`: boolean, this flag determines how the images are returned, defaults true

    returns - Promise<Array<HTMLImageElement | HTMLImageElement>

    - if split is true, the promise returns and array of Images,
    - if split is false, the promise returns on spritesheet image

### async getFrames(from: number, to: number, split: boolean = true)

    params

    - `from` : number, this is the starting index for retrieving image frames
    - `to` : number, this is the ending index for retrieving image frames
    - `split`: boolean, this flag determines how the images are returned defaults true

    returns - Promise<Array<HTMLImageElement | HTMLImageElement>

    - if split is true, the promise returns and array of Images,
    - if split is false, the promise returns on spritesheet image

### async getSpriteSheet(options: SpriteSheetOptions)

    params

    - `options` : SpriteSheetOptions

    returns - Promise<HTMLImageElement>

    - when resolved, returns the spritesheet
