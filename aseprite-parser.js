"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsepriteParser = void 0;
const pako_1 = require("pako");
var chunktype;
(function (chunktype) {
    chunktype[chunktype["OldPalletChunk1"] = 4] = "OldPalletChunk1";
    chunktype[chunktype["OldPalletChunk2"] = 17] = "OldPalletChunk2";
    chunktype[chunktype["LayerChunk"] = 8196] = "LayerChunk";
    chunktype[chunktype["CelChunk"] = 8197] = "CelChunk";
    chunktype[chunktype["CelExtraChunk"] = 8198] = "CelExtraChunk";
    chunktype[chunktype["ColorProfileChunk"] = 8199] = "ColorProfileChunk";
    chunktype[chunktype["ExternalFilesChunk"] = 8200] = "ExternalFilesChunk";
    chunktype[chunktype["MaskChunk"] = 8214] = "MaskChunk";
    chunktype[chunktype["TagsChunk"] = 8216] = "TagsChunk";
    chunktype[chunktype["PalletChunk"] = 8217] = "PalletChunk";
    chunktype[chunktype["UserDataChunk"] = 8224] = "UserDataChunk";
    chunktype[chunktype["SliceChunk"] = 8226] = "SliceChunk";
    chunktype[chunktype["TileSetChunk"] = 8227] = "TileSetChunk";
})(chunktype || (chunktype = {}));
class AsepriteParser {
    /*Public Methods */
    constructor(file) {
        this.filepath = "";
        this.loaded = false;
        this._parseFrames = async (fileData) => {
            return new Promise(async (resolve, reject) => {
                let numBytesinFrame = 0;
                let magicWord = 0;
                let oldChunks, newChunks, numChunks;
                let frameDuration = 0;
                let newPalletChunk = false;
                let framelayers = [];
                //remove Aseprite Header
                const frameBytes = fileData.slice(128);
                let fileCursor = 0;
                const tempFrames = [];
                for (let frameIndex = 0; frameIndex < this.header.frameCount; frameIndex++) {
                    numBytesinFrame = new DataView(frameBytes.buffer).getUint32(fileCursor, true);
                    magicWord = new DataView(frameBytes.buffer).getUint16(fileCursor + 4, true);
                    oldChunks = new DataView(frameBytes.buffer).getUint16(fileCursor + 6, true);
                    frameDuration = new DataView(frameBytes.buffer).getUint16(fileCursor + 8, true);
                    newChunks = new DataView(frameBytes.buffer).getUint32(fileCursor + 12, true);
                    numChunks = newChunks === 0 ? oldChunks : newChunks;
                    fileCursor += 16;
                    //iterate over chunks
                    framelayers = [];
                    for (let chunkIndex = 0; chunkIndex < numChunks; chunkIndex++) {
                        //Chunk Parsing
                        let chunkSize = new DataView(frameBytes.buffer).getUint32(fileCursor, true);
                        const chunkStartIndex = fileCursor;
                        let chunkType = new DataView(frameBytes.buffer).getUint16(fileCursor + 4, true);
                        switch (chunkType) {
                            case chunktype.OldPalletChunk1:
                                if (newPalletChunk)
                                    break;
                                break;
                            case chunktype.OldPalletChunk2:
                                if (newPalletChunk)
                                    break;
                                break;
                            case chunktype.LayerChunk:
                                this._readLayersChunk(fileCursor, frameBytes.buffer);
                                break;
                            case chunktype.CelChunk:
                                let frameLayer = this._readCelChunk(fileCursor, frameBytes, chunkSize, chunkStartIndex);
                                framelayers.push(frameLayer);
                                break;
                            case chunktype.CelExtraChunk:
                                break;
                            case chunktype.ColorProfileChunk:
                                break;
                            case chunktype.ExternalFilesChunk:
                                break;
                            case chunktype.MaskChunk:
                                break;
                            case chunktype.TagsChunk:
                                this._readTagsChunk(fileCursor, frameBytes);
                                break;
                            case chunktype.PalletChunk:
                                this._readPalletChunk(fileCursor, frameBytes);
                                break;
                            case chunktype.UserDataChunk:
                                break;
                            case chunktype.SliceChunk:
                                break;
                            case chunktype.TileSetChunk:
                                break;
                        }
                        fileCursor += chunkSize;
                        //Last Chunk, build out frame data
                        if (chunkIndex == numChunks - 1) {
                            let myCanvas = document.createElement("canvas");
                            myCanvas.width = this.header?.imageWidth;
                            myCanvas.height = this.header?.imageHeight;
                            let ctx = myCanvas.getContext("2d");
                            ctx?.clearRect(0, 0, this.header?.imageWidth, this.header?.imageHeight);
                            //build out frame entry in array
                            framelayers.forEach((frame) => {
                                let myClampedArray = new Uint8ClampedArray(frame?.imageData);
                                const newImageData = new ImageData(myClampedArray, frame?.size.w, frame?.size.h);
                                let tempCanvas = document.createElement("canvas");
                                tempCanvas.width = frame.size.w;
                                tempCanvas.height = frame.size.h;
                                let tempctx = tempCanvas.getContext("2d");
                                tempctx?.putImageData(newImageData, 0, 0);
                                ctx?.drawImage(tempCanvas, frame.position.x, frame.position.y, frame.size.w, frame.size.h);
                            });
                            //all imagedata is drawn to canvas
                            //grab canvas image and set frame image to that
                            let frameImage = new Image(this.header?.imageWidth, this.header?.imageHeight);
                            await this._asyncLoadImageSrc(frameImage, myCanvas.toDataURL());
                            tempFrames.push({
                                layers: framelayers,
                                duration: frameDuration,
                                image: frameImage,
                            });
                        }
                    }
                }
                resolve(tempFrames);
            });
        };
        if (typeof file == "string") {
            this.filepath = file;
            this.file = undefined;
        }
        else {
            this.file = file;
            this.filepath = "";
        }
        this.reader = new FileReader();
        this.tags = [];
        this.palette = [];
        this.layers = [];
        this.frames = [];
    }
    /**
     * initialize - requiired call prior to making other calls
     * reads in and parses asepreite or ase file
     * Asynchronous function
     * @returns Promise<boolean>
     */
    async initialize() {
        return new Promise(async (resolve, reject) => {
            //do stuff with class
            if (this.filepath !== "") {
                let response = await fetch(this.filepath);
                let data = await response.blob();
                this.file = new File([data], "");
            }
            this.reader.onload = async (event) => {
                if (!event.target || !event.target.result) {
                    throw new Error("Failed to read file.");
                }
                const fileData = new Uint8Array(event.target.result);
                this.header = await this._parseHeader(fileData);
                this.frames = await this._parseFrames(fileData);
                if (!this.header || !this.frames)
                    reject(this.loaded);
                if (this.header.fileSize != 0 && this.frames.length != 0) {
                    this.loaded = true;
                }
                resolve(this.loaded);
            };
            this.reader.onerror = event => {
                throw new Error("Failed to read file.");
            };
            this.reader.readAsArrayBuffer(this.file);
        });
    }
    /**
     * getTags() returns the parsed animation tags from the Aseprite file
     * @returns Array<AsepriteTag>
     */
    getTags() {
        if (!this.loaded)
            throw new Error("Aseprite file not loaded");
        return this.tags;
    }
    /**
     * getPalette - returns the array of colors that are in the aseprite file
     * @returns Array<string>
     */
    getPalette() {
        if (!this.loaded)
            throw new Error("Aseprite file not loaded");
        return this.palette;
    }
    /**
     * getTaggedAnimation - finds the animation tag from aseprite and uses the frame indexes associated
     * to return either the spritesheet or an array of images associated with that tag, throws error
     * if it cannot find that tag
     * Asynchronous function
     * @param {string} tag - the string text that is listed in the aseprite file for a collection of frames
     * @param {boolean} split  - the boolean flag to return a spritesheet (false), or an array of images (true)
     * @returns {HTMLImageElement|Array<HTMLImageElement>}
     */
    async getTaggedAnimation(tag, split = true) {
        if (!this.loaded)
            throw new Error("Aseprite file not loaded");
        //find tag
        const foundTag = this.tags.findIndex(tagstring => tag == tagstring.tagName);
        if (foundTag == -1)
            throw new Error("tagname not found");
        //tagindex found
        const result = await this.getFrames(this.tags[foundTag].startIndex, this.tags[foundTag].endIndex, split);
        return result;
    }
    /**
     * getFrames - returns specific frame content as spritesheet or array of images
     * Asynchronous function
     * @param {number} from - starting index for retrieving image frames
     * @param {number} to - ending index for retrieving image frames
     * @param {boolean} split - the boolean flag to return a spritesheet (false), or an array of images (true)
     * @returns {HTMLImageElement|Array<HTMLImageElement>}
     */
    async getFrames(from, to, split = true) {
        if (!this.loaded)
            throw new Error("Aseprite file not loaded");
        if (split) {
            let tempArray = [];
            for (let index = from; index <= to; index++) {
                tempArray.push(this.frames[index].image);
            }
            return tempArray;
        }
        else {
            let tempArray = [];
            //console.log(from, to);
            for (let index = from; index <= to; index++) {
                tempArray.push(index);
            }
            //console.log(tempArray);
            const tempImage = await this._makeSpriteSheet(tempArray, 1, tempArray.length);
            return tempImage;
        }
    }
    /**
     * getSpriteSheet - returns a spritesheet based on options parameters
     * Asynchronous function
     * @param {SpriteSheetOptions} options - frames, rows, cols
     * @returns {HTMLImageElement}
     */
    async getSpriteSheet(options) {
        if (!this.loaded)
            throw new Error("Aseprite file not loaded");
        const tempImage = await this._makeSpriteSheet(options.frames, options.rows, options.cols);
        return tempImage;
    }
    /**
     * getImage - pulls the image element for given frame
     * @param {number} frame - number representing the index of the frame to pull image from
     * @returns {HTMLIFrameElement}
     */
    getImage(frame) {
        this._loadCheck();
        if (!this.frames)
            return undefined;
        return this.frames[frame].image;
    }
    /*Private Methods */
    async _parseHeader(fileData) {
        return new Promise((resolve, reject) => {
            //isolate Aseprite Header
            const headerBytes = fileData.slice(0, 128);
            // Parse the header fields
            const fileSize = new DataView(headerBytes.buffer).getUint32(0, true);
            const frameCount = new DataView(headerBytes.buffer).getUint16(6, true);
            const imageWidth = new DataView(headerBytes.buffer).getUint16(8, true);
            const imageHeight = new DataView(headerBytes.buffer).getUint16(10, true);
            const colorDepth = new DataView(headerBytes.buffer).getUint16(12, true);
            resolve({ fileSize, imageWidth, imageHeight, colorDepth, frameCount });
        });
    }
    _convertRGBAtoHexSTring(color) {
        function padTo2(str) {
            return str.padStart(2, "0");
        }
        const hexR = padTo2(color.r.toString(16));
        const hexG = padTo2(color.g.toString(16));
        const hexB = padTo2(color.b.toString(16));
        const hexA = padTo2(color.a.toString(16));
        return `#${hexR}${hexG}${hexB}${hexA}`;
    }
    async _makeSpriteSheet(frames, rows, cols) {
        if (!this.loaded)
            throw new Error("Aseprite file not loaded");
        let tempFrames = [];
        let rowIndex = 0;
        let colIndex = 0;
        let ssWidth = 0;
        let ssHeight = 0;
        if (this.header) {
            ssWidth = this.header.imageWidth * cols;
            ssHeight = this.header.imageHeight * rows;
        }
        let tempCanvas = document.createElement("canvas");
        tempCanvas.width = ssWidth;
        tempCanvas.height = ssHeight;
        let tempCtx = tempCanvas.getContext("2d");
        let tempImage = new Image(ssWidth, ssHeight);
        let imageIndex = 0;
        if (frames === "all") {
            //console.log(this.header?.frameCount);
            if (this.header)
                for (let index = 0; index < this.header?.frameCount; index++) {
                    //console.log("loop index: ", index);
                    tempFrames.push(index);
                }
        }
        else {
            tempFrames = [...frames];
        }
        //console.log(tempFrames);
        tempFrames.forEach(frame => {
            colIndex = imageIndex % cols;
            rowIndex = Math.floor(imageIndex / cols);
            let drawX, drawY;
            if (this.header)
                drawX = colIndex * this.header?.imageWidth;
            if (this.header)
                drawY = rowIndex * this.header?.imageHeight;
            //console.log(rowIndex, colIndex, drawX, drawY);
            tempCtx?.drawImage(this.frames[frame].image, drawX, drawY);
            imageIndex++;
        });
        await this._asyncLoadImageSrc(tempImage, tempCanvas.toDataURL());
        return tempImage;
    }
    _readByteString(frameBuffer, startingIndex, length) {
        const myStringArray = new Uint8Array(length);
        for (let i = 0; i < myStringArray.length; i++) {
            myStringArray[i] = new DataView(frameBuffer).getUint8(startingIndex + i);
        }
        let decoder = new TextDecoder();
        return decoder.decode(myStringArray);
    }
    _getBytes(n, start, buffer) {
        return new Uint8Array(buffer.slice(start, start + n));
    }
    _readLayersChunk(cursor, buffer) {
        let layerCursor = cursor + 6;
        let layerNameLength = new DataView(buffer).getInt16(layerCursor + 16, true);
        layerCursor += 18;
        let layerName = this._readByteString(buffer, layerCursor, layerNameLength);
        let layerID = this.layers?.length;
        this.layers?.push({ layerID: layerID, layerName: layerName });
    }
    _readTagsChunk(cursor, parentbuffer) {
        let tagsChunkOffsetCursor = cursor + 6;
        let buffer = parentbuffer.buffer;
        let numTags = new DataView(buffer).getUint16(tagsChunkOffsetCursor, true);
        tagsChunkOffsetCursor += 10;
        for (let index = 0; index < numTags; index++) {
            let fromIndex = new DataView(buffer).getUint16(tagsChunkOffsetCursor, true);
            let toIndex = new DataView(buffer).getUint16(tagsChunkOffsetCursor + 2, true);
            tagsChunkOffsetCursor += 17;
            let nameLength = new DataView(buffer).getUint16(tagsChunkOffsetCursor, true);
            tagsChunkOffsetCursor += 2;
            let tagName = this._readByteString(buffer, tagsChunkOffsetCursor, nameLength);
            tagsChunkOffsetCursor += nameLength;
            this.tags?.push({
                startIndex: fromIndex,
                endIndex: toIndex,
                tagName: tagName,
            });
        }
    }
    _readPalletChunk(cursor, parentbuffer) {
        let palletCursor = cursor + 6;
        let buffer = parentbuffer.buffer;
        let newPalletSize = new DataView(buffer).getUint32(palletCursor, true);
        palletCursor += 20;
        for (let index = 0; index < newPalletSize; index++) {
            let red = new DataView(buffer).getUint8(palletCursor + 2);
            let green = new DataView(buffer).getUint8(palletCursor + 3);
            let blue = new DataView(buffer).getUint8(palletCursor + 4);
            let alpha = new DataView(buffer).getUint8(palletCursor + 5);
            let colorstring = this._convertRGBAtoHexSTring({ r: red, g: green, b: blue, a: alpha });
            this.palette?.push(colorstring);
        }
    }
    _readCelChunk(cursor, parentbuffer, size, startIndex) {
        let celCursor = cursor + 6;
        let buffer = parentbuffer.buffer;
        let framelayers = [];
        let layer = new DataView(buffer).getUint16(celCursor, true);
        let xpos = new DataView(buffer).getInt16(celCursor + 2, true);
        let ypos = new DataView(buffer).getInt16(celCursor + 4, true);
        let opacity = new DataView(buffer).getUint8(celCursor + 6);
        let celType = new DataView(buffer).getUint16(celCursor + 7, true);
        let zindex = new DataView(buffer).getInt16(celCursor + 9, true);
        let pixelWidth, pixelHeight;
        celCursor += 16;
        switch (celType) {
            case 0:
                //raw image
                break;
            case 1:
                //linked cell
                break;
            case 2:
                //compressed image
                pixelWidth = new DataView(buffer).getUint16(celCursor, true);
                pixelHeight = new DataView(buffer).getUint16(celCursor + 2, true);
                celCursor += 4;
                const bytesToRead = size - (celCursor - startIndex);
                let compressedArray = this._getBytes(bytesToRead, celCursor, parentbuffer);
                let decompressedArray;
                try {
                    decompressedArray = (0, pako_1.inflate)(compressedArray);
                }
                catch (error) {
                    throw new Error("Error unpacking compressed Image");
                }
                return {
                    layerID: layer,
                    position: { x: xpos, y: ypos },
                    size: { w: pixelWidth, h: pixelHeight },
                    imageData: decompressedArray,
                };
                break;
            case 3:
                //compressed tilemap
                break;
        }
    }
    _loadCheck() {
        if (!this.loaded)
            throw new Error("Aseprite file not loaded");
    }
    _asyncLoadImageSrc(image, src) {
        return new Promise((resolve, reject) => {
            image.onload = () => {
                resolve();
            };
            image.onerror = () => {
                reject();
            };
            image.src = src;
        });
    }
}
exports.AsepriteParser = AsepriteParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNlcHJpdGUtcGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXNlcHJpdGUtcGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUErQjtBQTRFL0IsSUFBSyxTQWNKO0FBZEQsV0FBSyxTQUFTO0lBQ1osK0RBQXFCLENBQUE7SUFDckIsZ0VBQXNCLENBQUE7SUFDdEIsd0RBQW1CLENBQUE7SUFDbkIsb0RBQWlCLENBQUE7SUFDakIsOERBQXNCLENBQUE7SUFDdEIsc0VBQTBCLENBQUE7SUFDMUIsd0VBQTJCLENBQUE7SUFDM0Isc0RBQWtCLENBQUE7SUFDbEIsc0RBQWtCLENBQUE7SUFDbEIsMERBQW9CLENBQUE7SUFDcEIsOERBQXNCLENBQUE7SUFDdEIsd0RBQW1CLENBQUE7SUFDbkIsNERBQXFCLENBQUE7QUFDdkIsQ0FBQyxFQWRJLFNBQVMsS0FBVCxTQUFTLFFBY2I7QUFFRCxNQUFhLGNBQWM7SUFZekIsbUJBQW1CO0lBQ25CLFlBQVksSUFBbUI7UUFWL0IsYUFBUSxHQUFXLEVBQUUsQ0FBQztRQUVmLFdBQU0sR0FBWSxLQUFLLENBQUM7UUEyS3ZCLGlCQUFZLEdBQUcsS0FBSyxFQUFFLFFBQW9CLEVBQWlDLEVBQUU7WUFDbkYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO2dCQUMzQyxJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUM7Z0JBQ3hCLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQztnQkFDcEMsSUFBSSxhQUFhLEdBQVcsQ0FBQyxDQUFDO2dCQUM5QixJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUM7Z0JBQzNCLElBQUksV0FBVyxHQUFRLEVBQUUsQ0FBQztnQkFFMUIsd0JBQXdCO2dCQUN4QixNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FB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