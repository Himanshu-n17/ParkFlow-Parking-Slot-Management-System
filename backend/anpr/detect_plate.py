import base64
import json
import sys

import cv2
import numpy as np
import easyocr

reader = easyocr.Reader(['en'])


def decode_image(image_b64: str):
    image_bytes = base64.b64decode(image_b64)
    nparr = np.frombuffer(image_bytes, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)


def encode_image(img):
    ok, buffer = cv2.imencode(".jpg", img)
    if not ok:
        return None
    return base64.b64encode(buffer.tobytes()).decode("utf-8")


def locate_plate(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 11, 17, 17)

    cascade_path = cv2.data.haarcascades + "haarcascade_russian_plate_number.xml"
    cascade = cv2.CascadeClassifier(cascade_path)

    if cascade.empty():
        return None, None

    boxes = cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=4,
        minSize=(120, 40)
    )

    if len(boxes) == 0:
        return None, None

    # Pick largest candidate by area for stability.
    x, y, w, h = max(boxes, key=lambda b: b[2] * b[3])
    pad_x = int(w * 0.08)
    pad_y = int(h * 0.2)

    x1 = max(0, x - pad_x)
    y1 = max(0, y - pad_y)
    x2 = min(img.shape[1], x + w + pad_x)
    y2 = min(img.shape[0], y + h + pad_y)

    crop = img[y1:y2, x1:x2]
    bbox = {"x": int(x1), "y": int(y1), "w": int(x2 - x1), "h": int(y2 - y1)}
    return crop, bbox


def main():
    try:
        payload = json.loads(sys.stdin.read() or "{}")
        image_b64 = payload.get("image", "")
        if not image_b64:
            raise ValueError("Image is required")

        img = decode_image(image_b64)
        if img is None:
            raise ValueError("Invalid image")

        crop, bbox = locate_plate(img)

        if crop is None:
            print(
                json.dumps(
                    {
                        "found": False,
                        "plateImage": None,
                        "bbox": None,
                    }
                )
            )
            return

        gray_crop = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
        # Reduce noise
        gray_crop = cv2.GaussianBlur(gray_crop, (3, 3), 0)
        gray_crop = cv2.threshold(
            gray_crop,
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU
            )[1]
        
        # Sharpen image
        kernel = np.array([
            [-1, -1, -1],
            [-1,  9, -1],
            [-1, -1, -1]
        ])
        gray_crop = cv2.filter2D(gray_crop, -1, kernel)
        # Upscale image for better OCR
        gray_crop = cv2.resize(
            gray_crop,
            None,
            fx=3,
            fy=3,
            interpolation=cv2.INTER_CUBIC
        )

        ocr_result = reader.readtext(
            gray_crop,
            allowlist='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        )        
        plate_text = ""

        if ocr_result:
            plate_text = ocr_result[0][1]

            # Clean OCR output
            plate_text = "".join(
                ch for ch in plate_text if ch.isalnum()
            ).upper()
        

        plate_img_b64 = encode_image(crop)
        print(
            json.dumps(
                {
                    "found": bool(plate_img_b64),
                    "plateImage": plate_img_b64,
                    "bbox": bbox,
                    "plateText": plate_text
                }
            )
        )
    except Exception as err:
        print(json.dumps({"found": False, "error": str(err)}))


if __name__ == "__main__":
    main()
