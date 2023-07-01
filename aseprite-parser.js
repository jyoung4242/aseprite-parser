"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsepriteParser = void 0;
var pako_1 = require("pako");
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
var AsepriteParser = /** @class */ (function () {
    /*Public Methods */
    function AsepriteParser(file) {
        var _this = this;
        this.filepath = "";
        this.loaded = false;
        this._parseFrames = function (fileData) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var numBytesinFrame, magicWord, oldChunks, newChunks, numChunks, frameDuration, newPalletChunk, framelayers, frameBytes, fileCursor, tempFrames, frameIndex, _loop_1, this_1, chunkIndex;
                        var _a, _b, _c, _d, _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    numBytesinFrame = 0;
                                    magicWord = 0;
                                    frameDuration = 0;
                                    newPalletChunk = false;
                                    framelayers = [];
                                    frameBytes = fileData.slice(128);
                                    fileCursor = 0;
                                    tempFrames = [];
                                    frameIndex = 0;
                                    _g.label = 1;
                                case 1:
                                    if (!(frameIndex < this.header.frameCount)) return [3 /*break*/, 6];
                                    numBytesinFrame = new DataView(frameBytes.buffer).getUint32(fileCursor, true);
                                    magicWord = new DataView(frameBytes.buffer).getUint16(fileCursor + 4, true);
                                    oldChunks = new DataView(frameBytes.buffer).getUint16(fileCursor + 6, true);
                                    frameDuration = new DataView(frameBytes.buffer).getUint16(fileCursor + 8, true);
                                    newChunks = new DataView(frameBytes.buffer).getUint32(fileCursor + 12, true);
                                    numChunks = newChunks === 0 ? oldChunks : newChunks;
                                    fileCursor += 16;
                                    //iterate over chunks
                                    framelayers = [];
                                    _loop_1 = function (chunkIndex) {
                                        var chunkSize, chunkStartIndex, chunkType, frameLayer, myCanvas, ctx_1, frameImage;
                                        return __generator(this, function (_h) {
                                            switch (_h.label) {
                                                case 0:
                                                    chunkSize = new DataView(frameBytes.buffer).getUint32(fileCursor, true);
                                                    chunkStartIndex = fileCursor;
                                                    chunkType = new DataView(frameBytes.buffer).getUint16(fileCursor + 4, true);
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
                                                            this_1._readLayersChunk(fileCursor, frameBytes.buffer);
                                                            break;
                                                        case chunktype.CelChunk:
                                                            frameLayer = this_1._readCelChunk(fileCursor, frameBytes, chunkSize, chunkStartIndex);
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
                                                            this_1._readTagsChunk(fileCursor, frameBytes);
                                                            break;
                                                        case chunktype.PalletChunk:
                                                            this_1._readPalletChunk(fileCursor, frameBytes);
                                                            break;
                                                        case chunktype.UserDataChunk:
                                                            break;
                                                        case chunktype.SliceChunk:
                                                            break;
                                                        case chunktype.TileSetChunk:
                                                            break;
                                                    }
                                                    fileCursor += chunkSize;
                                                    if (!(chunkIndex == numChunks - 1)) return [3 /*break*/, 2];
                                                    myCanvas = document.createElement("canvas");
                                                    myCanvas.width = (_a = this_1.header) === null || _a === void 0 ? void 0 : _a.imageWidth;
                                                    myCanvas.height = (_b = this_1.header) === null || _b === void 0 ? void 0 : _b.imageHeight;
                                                    ctx_1 = myCanvas.getContext("2d");
                                                    ctx_1 === null || ctx_1 === void 0 ? void 0 : ctx_1.clearRect(0, 0, (_c = this_1.header) === null || _c === void 0 ? void 0 : _c.imageWidth, (_d = this_1.header) === null || _d === void 0 ? void 0 : _d.imageHeight);
                                                    //build out frame entry in array
                                                    framelayers.forEach(function (frame) {
                                                        var myClampedArray = new Uint8ClampedArray(frame === null || frame === void 0 ? void 0 : frame.imageData);
                                                        var newImageData = new ImageData(myClampedArray, frame === null || frame === void 0 ? void 0 : frame.size.w, frame === null || frame === void 0 ? void 0 : frame.size.h);
                                                        var tempCanvas = document.createElement("canvas");
                                                        tempCanvas.width = frame.size.w;
                                                        tempCanvas.height = frame.size.h;
                                                        var tempctx = tempCanvas.getContext("2d");
                                                        tempctx === null || tempctx === void 0 ? void 0 : tempctx.putImageData(newImageData, 0, 0);
                                                        ctx_1 === null || ctx_1 === void 0 ? void 0 : ctx_1.drawImage(tempCanvas, frame.position.x, frame.position.y, frame.size.w, frame.size.h);
                                                    });
                                                    frameImage = new Image((_e = this_1.header) === null || _e === void 0 ? void 0 : _e.imageWidth, (_f = this_1.header) === null || _f === void 0 ? void 0 : _f.imageHeight);
                                                    return [4 /*yield*/, this_1._asyncLoadImageSrc(frameImage, myCanvas.toDataURL())];
                                                case 1:
                                                    _h.sent();
                                                    tempFrames.push({
                                                        layers: framelayers,
                                                        duration: frameDuration,
                                                        image: frameImage,
                                                    });
                                                    _h.label = 2;
                                                case 2: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    this_1 = this;
                                    chunkIndex = 0;
                                    _g.label = 2;
                                case 2:
                                    if (!(chunkIndex < numChunks)) return [3 /*break*/, 5];
                                    return [5 /*yield**/, _loop_1(chunkIndex)];
                                case 3:
                                    _g.sent();
                                    _g.label = 4;
                                case 4:
                                    chunkIndex++;
                                    return [3 /*break*/, 2];
                                case 5:
                                    frameIndex++;
                                    return [3 /*break*/, 1];
                                case 6:
                                    resolve(tempFrames);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); };
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
    AsepriteParser.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var response, data;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(this.filepath !== "")) return [3 /*break*/, 3];
                                    return [4 /*yield*/, fetch(this.filepath)];
                                case 1:
                                    response = _a.sent();
                                    return [4 /*yield*/, response.blob()];
                                case 2:
                                    data = _a.sent();
                                    this.file = new File([data], "");
                                    _a.label = 3;
                                case 3:
                                    this.reader.onload = function (event) { return __awaiter(_this, void 0, void 0, function () {
                                        var fileData, _a, _b;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0:
                                                    if (!event.target || !event.target.result) {
                                                        throw new Error("Failed to read file.");
                                                    }
                                                    fileData = new Uint8Array(event.target.result);
                                                    _a = this;
                                                    return [4 /*yield*/, this._parseHeader(fileData)];
                                                case 1:
                                                    _a.header = _c.sent();
                                                    _b = this;
                                                    return [4 /*yield*/, this._parseFrames(fileData)];
                                                case 2:
                                                    _b.frames = _c.sent();
                                                    if (!this.header || !this.frames)
                                                        reject(this.loaded);
                                                    if (this.header.fileSize != 0 && this.frames.length != 0) {
                                                        this.loaded = true;
                                                    }
                                                    resolve(this.loaded);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); };
                                    this.reader.onerror = function (event) {
                                        throw new Error("Failed to read file.");
                                    };
                                    this.reader.readAsArrayBuffer(this.file);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * getTags() returns the parsed animation tags from the Aseprite file
     * @returns Array<AsepriteTag>
     */
    AsepriteParser.prototype.getTags = function () {
        if (!this.loaded)
            throw new Error("Aseprite file not loaded");
        return this.tags;
    };
    /**
     * getPalette - returns the array of colors that are in the aseprite file
     * @returns Array<string>
     */
    AsepriteParser.prototype.getPalette = function () {
        if (!this.loaded)
            throw new Error("Aseprite file not loaded");
        return this.palette;
    };
    /**
     * getTaggedAnimation - finds the animation tag from aseprite and uses the frame indexes associated
     * to return either the spritesheet or an array of images associated with that tag, throws error
     * if it cannot find that tag
     * Asynchronous function
     * @param {string} tag - the string text that is listed in the aseprite file for a collection of frames
     * @param {boolean} split  - the boolean flag to return a spritesheet (false), or an array of images (true)
     * @returns {HTMLImageElement|Array<HTMLImageElement>}
     */
    AsepriteParser.prototype.getTaggedAnimation = function (tag, split) {
        if (split === void 0) { split = true; }
        return __awaiter(this, void 0, void 0, function () {
            var foundTag, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.loaded)
                            throw new Error("Aseprite file not loaded");
                        foundTag = this.tags.findIndex(function (tagstring) { return tag == tagstring.tagName; });
                        if (foundTag == -1)
                            throw new Error("tagname not found");
                        return [4 /*yield*/, this.getFrames(this.tags[foundTag].startIndex, this.tags[foundTag].endIndex, split)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * getFrames - returns specific frame content as spritesheet or array of images
     * Asynchronous function
     * @param {number} from - starting index for retrieving image frames
     * @param {number} to - ending index for retrieving image frames
     * @param {boolean} split - the boolean flag to return a spritesheet (false), or an array of images (true)
     * @returns {HTMLImageElement|Array<HTMLImageElement>}
     */
    AsepriteParser.prototype.getFrames = function (from, to, split) {
        if (split === void 0) { split = true; }
        return __awaiter(this, void 0, void 0, function () {
            var tempArray, index, tempArray, index, tempImage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.loaded)
                            throw new Error("Aseprite file not loaded");
                        if (!split) return [3 /*break*/, 1];
                        tempArray = [];
                        for (index = from; index <= to; index++) {
                            tempArray.push(this.frames[index].image);
                        }
                        return [2 /*return*/, tempArray];
                    case 1:
                        tempArray = [];
                        console.log(from, to);
                        for (index = from; index <= to; index++) {
                            tempArray.push(index);
                        }
                        console.log(tempArray);
                        return [4 /*yield*/, this._makeSpriteSheet(tempArray, 1, tempArray.length)];
                    case 2:
                        tempImage = _a.sent();
                        return [2 /*return*/, tempImage];
                }
            });
        });
    };
    /**
     * getSpriteSheet - returns a spritesheet based on options parameters
     * Asynchronous function
     * @param {SpriteSheetOptions} options - frames, rows, cols
     * @returns {HTMLImageElement}
     */
    AsepriteParser.prototype.getSpriteSheet = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var tempImage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.loaded)
                            throw new Error("Aseprite file not loaded");
                        return [4 /*yield*/, this._makeSpriteSheet(options.frames, options.rows, options.cols)];
                    case 1:
                        tempImage = _a.sent();
                        return [2 /*return*/, tempImage];
                }
            });
        });
    };
    /**
     * getImage - pulls the image element for given frame
     * @param {number} frame - number representing the index of the frame to pull image from
     * @returns {HTMLIFrameElement}
     */
    AsepriteParser.prototype.getImage = function (frame) {
        this._loadCheck();
        if (!this.frames)
            return undefined;
        return this.frames[frame].image;
    };
    /*Private Methods */
    AsepriteParser.prototype._parseHeader = function (fileData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        //isolate Aseprite Header
                        var headerBytes = fileData.slice(0, 128);
                        // Parse the header fields
                        var fileSize = new DataView(headerBytes.buffer).getUint32(0, true);
                        var frameCount = new DataView(headerBytes.buffer).getUint16(6, true);
                        var imageWidth = new DataView(headerBytes.buffer).getUint16(8, true);
                        var imageHeight = new DataView(headerBytes.buffer).getUint16(10, true);
                        var colorDepth = new DataView(headerBytes.buffer).getUint16(12, true);
                        resolve({ fileSize: fileSize, imageWidth: imageWidth, imageHeight: imageHeight, colorDepth: colorDepth, frameCount: frameCount });
                    })];
            });
        });
    };
    AsepriteParser.prototype._convertRGBAtoHexSTring = function (color) {
        function padTo2(str) {
            return str.padStart(2, "0");
        }
        var hexR = padTo2(color.r.toString(16));
        var hexG = padTo2(color.g.toString(16));
        var hexB = padTo2(color.b.toString(16));
        var hexA = padTo2(color.a.toString(16));
        return "#".concat(hexR).concat(hexG).concat(hexB).concat(hexA);
    };
    AsepriteParser.prototype._makeSpriteSheet = function (frames, rows, cols) {
        return __awaiter(this, void 0, void 0, function () {
            var rowIndex, colIndex, ssWidth, ssHeight, tempCanvas, tempCtx, tempImage, imageIndex;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.loaded)
                            throw new Error("Aseprite file not loaded");
                        rowIndex = 0;
                        colIndex = 0;
                        ssWidth = 0;
                        ssHeight = 0;
                        if (this.header) {
                            ssWidth = this.header.imageWidth * cols;
                            ssHeight = this.header.imageHeight * rows;
                        }
                        tempCanvas = document.createElement("canvas");
                        tempCanvas.width = ssWidth;
                        tempCanvas.height = ssHeight;
                        tempCtx = tempCanvas.getContext("2d");
                        tempImage = new Image(ssWidth, ssHeight);
                        imageIndex = 0;
                        frames.forEach(function (frame) {
                            var _a, _b;
                            colIndex = imageIndex % cols;
                            rowIndex = Math.floor(imageIndex / cols);
                            var drawX, drawY;
                            if (_this.header)
                                drawX = colIndex * ((_a = _this.header) === null || _a === void 0 ? void 0 : _a.imageWidth);
                            if (_this.header)
                                drawY = rowIndex * ((_b = _this.header) === null || _b === void 0 ? void 0 : _b.imageHeight);
                            //console.log(rowIndex, colIndex, drawX, drawY);
                            tempCtx === null || tempCtx === void 0 ? void 0 : tempCtx.drawImage(_this.frames[frame].image, drawX, drawY);
                            imageIndex++;
                        });
                        return [4 /*yield*/, this._asyncLoadImageSrc(tempImage, tempCanvas.toDataURL())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, tempImage];
                }
            });
        });
    };
    AsepriteParser.prototype._readByteString = function (frameBuffer, startingIndex, length) {
        var myStringArray = new Uint8Array(length);
        for (var i = 0; i < myStringArray.length; i++) {
            myStringArray[i] = new DataView(frameBuffer).getUint8(startingIndex + i);
        }
        var decoder = new TextDecoder();
        return decoder.decode(myStringArray);
    };
    AsepriteParser.prototype._getBytes = function (n, start, buffer) {
        return new Uint8Array(buffer.slice(start, start + n));
    };
    AsepriteParser.prototype._readLayersChunk = function (cursor, buffer) {
        var _a, _b;
        var layerCursor = cursor + 6;
        var layerNameLength = new DataView(buffer).getInt16(layerCursor + 16, true);
        layerCursor += 18;
        var layerName = this._readByteString(buffer, layerCursor, layerNameLength);
        var layerID = (_a = this.layers) === null || _a === void 0 ? void 0 : _a.length;
        (_b = this.layers) === null || _b === void 0 ? void 0 : _b.push({ layerID: layerID, layerName: layerName });
    };
    AsepriteParser.prototype._readTagsChunk = function (cursor, parentbuffer) {
        var _a;
        var tagsChunkOffsetCursor = cursor + 6;
        var buffer = parentbuffer.buffer;
        var numTags = new DataView(buffer).getUint16(tagsChunkOffsetCursor, true);
        tagsChunkOffsetCursor += 10;
        for (var index = 0; index < numTags; index++) {
            var fromIndex = new DataView(buffer).getUint16(tagsChunkOffsetCursor, true);
            var toIndex = new DataView(buffer).getUint16(tagsChunkOffsetCursor + 2, true);
            tagsChunkOffsetCursor += 17;
            var nameLength = new DataView(buffer).getUint16(tagsChunkOffsetCursor, true);
            tagsChunkOffsetCursor += 2;
            var tagName = this._readByteString(buffer, tagsChunkOffsetCursor, nameLength);
            tagsChunkOffsetCursor += nameLength;
            (_a = this.tags) === null || _a === void 0 ? void 0 : _a.push({
                startIndex: fromIndex,
                endIndex: toIndex,
                tagName: tagName,
            });
        }
    };
    AsepriteParser.prototype._readPalletChunk = function (cursor, parentbuffer) {
        var _a;
        var palletCursor = cursor + 6;
        var buffer = parentbuffer.buffer;
        var newPalletSize = new DataView(buffer).getUint32(palletCursor, true);
        palletCursor += 20;
        for (var index = 0; index < newPalletSize; index++) {
            var red = new DataView(buffer).getUint8(palletCursor + 2);
            var green = new DataView(buffer).getUint8(palletCursor + 3);
            var blue = new DataView(buffer).getUint8(palletCursor + 4);
            var alpha = new DataView(buffer).getUint8(palletCursor + 5);
            var colorstring = this._convertRGBAtoHexSTring({ r: red, g: green, b: blue, a: alpha });
            (_a = this.palette) === null || _a === void 0 ? void 0 : _a.push(colorstring);
        }
    };
    AsepriteParser.prototype._readCelChunk = function (cursor, parentbuffer, size, startIndex) {
        var celCursor = cursor + 6;
        var buffer = parentbuffer.buffer;
        var framelayers = [];
        var layer = new DataView(buffer).getUint16(celCursor, true);
        var xpos = new DataView(buffer).getInt16(celCursor + 2, true);
        var ypos = new DataView(buffer).getInt16(celCursor + 4, true);
        var opacity = new DataView(buffer).getUint8(celCursor + 6);
        var celType = new DataView(buffer).getUint16(celCursor + 7, true);
        var zindex = new DataView(buffer).getInt16(celCursor + 9, true);
        var pixelWidth, pixelHeight;
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
                var bytesToRead = size - (celCursor - startIndex);
                var compressedArray = this._getBytes(bytesToRead, celCursor, parentbuffer);
                var decompressedArray = void 0;
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
    };
    AsepriteParser.prototype._loadCheck = function () {
        if (!this.loaded)
            throw new Error("Aseprite file not loaded");
    };
    AsepriteParser.prototype._asyncLoadImageSrc = function (image, src) {
        return new Promise(function (resolve, reject) {
            image.onload = function () {
                resolve();
            };
            image.onerror = function () {
                reject();
            };
            image.src = src;
        });
    };
    return AsepriteParser;
}());
exports.AsepriteParser = AsepriteParser;
