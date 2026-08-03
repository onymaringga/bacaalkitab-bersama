declare module "page-flip/dist/js/page-flip.module.js" {
  export class PageFlip {
    constructor(
      element: HTMLElement,
      settings: {
        startPage?: number;
        size?: "fixed" | "stretch";
        width: number;
        height: number;
        minWidth?: number;
        maxWidth?: number;
        minHeight?: number;
        maxHeight?: number;
        drawShadow?: boolean;
        flippingTime?: number;
        usePortrait?: boolean;
        startZIndex?: number;
        autoSize?: boolean;
        maxShadowOpacity?: number;
        showCover?: boolean;
        mobileScrollSupport?: boolean;
        clickEventForward?: boolean;
        useMouseEvents?: boolean;
        swipeDistance?: number;
        showPageCorners?: boolean;
        disableFlipByClick?: boolean;
      },
    );
    loadFromHTML(items: HTMLElement[] | NodeListOf<HTMLElement>): void;
    updateFromHtml(items: HTMLElement[] | NodeListOf<HTMLElement>): void;
    destroy(): void;
    update(): void;
    flip(pageNum: number, corner?: "top" | "bottom"): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    turnToPage(pageNum: number): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    on(
      event: "flip" | "changeState" | "init" | "update",
      callback: (e: { data: number | string }) => void,
    ): this;
    off(event: string): void;
  }
}
