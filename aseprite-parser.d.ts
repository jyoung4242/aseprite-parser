export interface AsepriteHeader {
    fileSize: number;
    imageWidth: number;
    imageHeight: number;
    frameCount: number;
    colorDepth: number;
}
export interface AsepriteFrame {
    layers: Array<FrameLayer>;
    duration: number;
    image: HTMLImageElement;
}
export interface AsepriteLayer {
    layerID: number;
    layerName: string;
}
export interface AsepriteTag {
    startIndex: number;
    endIndex: number;
    tagName: string;
}
interface FrameLayer {
    layerID: number;
    position: {
        x: number;
        y: number;
    };
    size: {
        w: number;
        h: number;
    };
    imageData: Uint8Array;
}
export interface SpriteSheetOptions {
    /**
     * Frames: Array<number>
     */
    frames: Array<number>;
    /**
     *rows: number - number of rows in spritesheet
     */
    rows: number;
    /**
     *cols: number - number of columns in spritesheet
     */
    cols: number;
}
export declare class AsepriteParser {
    file: File | undefined;
    filepath: string;
    reader: FileReader;
    loaded: boolean;
    header: AsepriteHeader | undefined;
    frames: Array<AsepriteFrame>;
    tags: Array<AsepriteTag>;
    layers: Array<AsepriteLayer>;
    palette: Array<string>;
    constructor(file: File | string);
    /**
     * initialize - requiired call prior to making other calls
     * reads in and parses asepreite or ase file
     * Asynchronous function
     * @returns Promise<boolean>
     */
    initialize(): Promise<boolean>;
    /**
     * getTags() returns the parsed animation tags from the Aseprite file
     * @returns Array<AsepriteTag>
     */
    getTags(): Array<AsepriteTag>;
    /**
     * getPalette - returns the array of colors that are in the aseprite file
     * @returns Array<string>
     */
    getPalette(): string[];
    /**
     * getTaggedAnimation - finds the animation tag from aseprite and uses the frame indexes associated
     * to return either the spritesheet or an array of images associated with that tag, throws error
     * if it cannot find that tag
     * Asynchronous function
     * @param {string} tag - the string text that is listed in the aseprite file for a collection of frames
     * @param {boolean} split  - the boolean flag to return a spritesheet (false), or an array of images (true)
     * @returns {HTMLImageElement|Array<HTMLImageElement>}
     */
    getTaggedAnimation(tag: string, split?: boolean): Promise<Array<HTMLImageElement> | HTMLImageElement>;
    /**
     * getFrames - returns specific frame content as spritesheet or array of images
     * Asynchronous function
     * @param {number} from - starting index for retrieving image frames
     * @param {number} to - ending index for retrieving image frames
     * @param {boolean} split - the boolean flag to return a spritesheet (false), or an array of images (true)
     * @returns {HTMLImageElement|Array<HTMLImageElement>}
     */
    getFrames(from: number, to: number, split?: boolean): Promise<Array<HTMLImageElement> | HTMLImageElement>;
    /**
     * getSpriteSheet - returns a spritesheet based on options parameters
     * Asynchronous function
     * @param {SpriteSheetOptions} options - frames, rows, cols
     * @returns {HTMLImageElement}
     */
    getSpriteSheet(options: SpriteSheetOptions): Promise<HTMLImageElement>;
    /**
     * getImage - pulls the image element for given frame
     * @param {number} frame - number representing the index of the frame to pull image from
     * @returns {HTMLIFrameElement}
     */
    getImage(frame: number): HTMLImageElement | undefined;
    private _parseHeader;
    private _parseFrames;
    private _convertRGBAtoHexSTring;
    private _makeSpriteSheet;
    private _readByteString;
    private _getBytes;
    private _readLayersChunk;
    private _readTagsChunk;
    private _readPalletChunk;
    private _readCelChunk;
    private _loadCheck;
    private _asyncLoadImageSrc;
}
export {};
//# sourceMappingURL=aseprite-parser.d.ts.map