const path = require("path");
const { spawn } = require("child_process");
const Tesseract = require("tesseract.js");
const AnprDetection = require("../models/AnprDetection");

let worker = null;
const MIN_ANPR_CONFIDENCE = Number(process.env.ANPR_MIN_CONFIDENCE || 40);
const MIN_PLATE_SCORE = Number(process.env.ANPR_MIN_PLATE_SCORE || 70);
const OCR_WHITELIST = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789- ";
const PYTHON_BIN = process.env.ANPR_PYTHON_BIN || "python";
const PY_DETECT_SCRIPT = path.join(__dirname, "../anpr/detect_plate.py");

const VALID_INDIAN_STATE_CODES = new Set([
  "AN",
  "AP",
  "AR",
  "AS",
  "BR",
  "CG",
  "CH",
  "DD",
  "DL",
  "DN",
  "GA",
  "GJ",
  "HP",
  "HR",
  "JH",
  "JK",
  "KA",
  "KL",
  "LA",
  "LD",
  "MH",
  "ML",
  "MN",
  "MP",
  "MZ",
  "NL",
  "OD",
  "PB",
  "PY",
  "RJ",
  "SK",
  "TN",
  "TR",
  "TS",
  "UK",
  "UP",
  "WB",
]);

const initWorker = async () => {
  if (worker) return worker;

  worker = await Tesseract.createWorker("eng");
  await worker.setParameters({
    tessedit_char_whitelist: OCR_WHITELIST,
  });
  return worker;
};

const normalizePlate = (value = "") => value.toUpperCase().replace(/[^A-Z0-9]/g, "");

const LETTER_LIKE_TO_DIGIT = {
  O: "0",
  Q: "0",
  D: "0",
  I: "1",
  L: "1",
  Z: "2",
  S: "5",
  B: "8",
  G: "6",
};

const DIGIT_LIKE_TO_LETTER = {
  "0": "O",
  "1": "I",
  "2": "Z",
  "5": "S",
  "6": "G",
  "8": "B",
};

const toLetter = (ch = "") => DIGIT_LIKE_TO_LETTER[ch] || ch;
const toDigit = (ch = "") => LETTER_LIKE_TO_DIGIT[ch] || ch;

const normalizeIndianPlateShape = (plate = "") => {
  const compact = normalizePlate(plate);
  if (compact.length < 8 || compact.length > 11) return compact;

  const chars = compact.split("");
  const corrected = [];

  for (let i = 0; i < chars.length; i += 1) {
    const c = chars[i];

    // AA
    if (i <= 1) {
      corrected.push(toLetter(c));
      continue;
    }

    // Last 4 are digits
    if (i >= chars.length - 4) {
      corrected.push(toDigit(c));
      continue;
    }

    // 1-2 district digits after state code
    if (i <= 3) {
      corrected.push(toDigit(c));
      continue;
    }

    // Middle 1-3 series letters
    corrected.push(toLetter(c));
  }

  return corrected.join("");
};

const extractMatches = (text = "") => {
  const normalizedText = text.toUpperCase().replace(/[^A-Z0-9\s-]/g, " ");
  const candidates = new Set();
  const loosePattern = /[A-Z]{2}[\s-]?[0-9]{1,2}[\s-]?[A-Z]{1,3}[\s-]?[0-9]{3,4}/g;

  for (const match of normalizedText.match(loosePattern) || []) {
    const compact = normalizeIndianPlateShape(match);
    if (compact.length >= 8 && compact.length <= 11) {
      candidates.add(compact);
    }
  }

  for (const token of normalizedText.split(/\s+/).filter(Boolean)) {
    const compact = normalizeIndianPlateShape(token);
    if (/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{3,4}$/.test(compact)) {
      candidates.add(compact);
    }
  }

  // Sliding window fallback to recover from noisy OCR blocks.
  const compactText = normalizePlate(normalizedText);
  for (let len = 8; len <= 11; len += 1) {
    for (let i = 0; i + len <= compactText.length; i += 1) {
      const segment = normalizeIndianPlateShape(compactText.slice(i, i + len));
      if (/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{3,4}$/.test(segment)) {
        candidates.add(segment);
      }
    }
  }

  return [...candidates];
};

const scorePlateCandidate = (plate = "") => {
  const strictPattern = /^([A-Z]{2})([0-9]{1,2})([A-Z]{1,3})([0-9]{3,4})$/;
  const match = plate.match(strictPattern);
  if (!match) return 0;

  const [, state, district, series, number] = match;
  let score = 0;

  if (VALID_INDIAN_STATE_CODES.has(state)) score += 45;
  else score += 15;

  if (district.length >= 1 && district.length <= 2) score += 15;
  if (series.length >= 1 && series.length <= 3) score += 20;
  if (number.length >= 3 && number.length <= 4) score += 20;

  return Math.min(100, score);
};

const locatePlateWithPython = (imageBase64) =>
  new Promise((resolve, reject) => {
    const python = spawn(PYTHON_BIN, [PY_DETECT_SCRIPT], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    python.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    python.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    python.on("error", (error) => {
      reject(error);
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `Python ANPR exited with code ${code}`));
        return;
      }

      try {
        const parsed = JSON.parse(stdout || "{}");
        resolve(parsed);
      } catch (error) {
        reject(new Error(`Invalid Python ANPR output: ${error.message}`));
      }
    });

    python.stdin.write(JSON.stringify({ image: imageBase64 }));
    python.stdin.end();
  });

const detectFromImageBuffer = async (imageBuffer) => {
  const ocrWorker = await initWorker();
  const ocrRuns = [];

  const psmModes = [7, 6, 11];
  for (const mode of psmModes) {
    try {
      await ocrWorker.setParameters({
        tessedit_char_whitelist: OCR_WHITELIST,
        tessedit_pageseg_mode: String(mode),
      });
      ocrRuns.push(await ocrWorker.recognize(imageBuffer));
    } catch {
      // Skip failing OCR mode and continue with other modes.
    }
  }

  if (ocrRuns.length === 0) {
    throw new Error("OCR failed for all scan modes.");
  }

  const candidates = new Map();
  for (const run of ocrRuns) {
    const data = run?.data || {};
    const extracted = extractMatches(data.text || "");
    const runConfidence = Number(data.confidence?.toFixed?.(2) || 0);

    for (const item of extracted) {
      const score = scorePlateCandidate(item);
      const existing = candidates.get(item);
      if (!existing || existing.score < score || existing.confidence < runConfidence) {
        candidates.set(item, { plate: item, score, confidence: runConfidence });
      }
    }
  }

  const ranked = [...candidates.values()].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.confidence - a.confidence;
  });

  const best = ranked[0] || null;
  return {
    plate: best?.plate || "",
    confidence: Number(best?.confidence || 0),
    plateScore: Number(best?.score || 0),
    rawText: ocrRuns.map((run) => run?.data?.text || "").join("\n---\n").trim(),
  };
};

exports.detectNumberPlate = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image || typeof image !== "string") {
      return res.status(400).json({ message: "Image is required." });
    }

    const base64 = image.includes(",") ? image.split(",")[1] : image;
    const originalImageBuffer = Buffer.from(base64, "base64");

    let detectionImageBuffer = originalImageBuffer;
    let detectorMeta = { detector: "tesseract-only", localized: false, bbox: null };

    try {
      const located = await locatePlateWithPython(base64);
      if (located?.found && located?.plateImage) {
        detectionImageBuffer = Buffer.from(located.plateImage, "base64");
        detectorMeta = {
          detector: "opencv-haar-python",
          localized: true,
          bbox: located.bbox || null,
        };
      }
    } catch {
      // Fallback: keep OCR on full frame when Python/OpenCV is unavailable.
    }

    let scan = await detectFromImageBuffer(detectionImageBuffer);
    const needsFallbackScan = !scan.plate || scan.plateScore < MIN_PLATE_SCORE;

    // If localized crop is bad, retry on full frame so detection does not fail silently.
    if (needsFallbackScan && detectorMeta.localized) {
      const fullFrameScan = await detectFromImageBuffer(originalImageBuffer);
      if (
        fullFrameScan.plateScore > scan.plateScore ||
        (fullFrameScan.plateScore === scan.plateScore &&
          fullFrameScan.confidence > scan.confidence)
      ) {
        scan = fullFrameScan;
        detectorMeta = { detector: "tesseract-full-frame", localized: false, bbox: null };
      }
    }
    const plate = scan.plate;
    const parsedConfidence = scan.confidence;
    const plateScore = scan.plateScore;
    const isReliable = parsedConfidence >= MIN_ANPR_CONFIDENCE && plateScore >= MIN_PLATE_SCORE;
    let savedDetection = null;

    if (plate && isReliable && req.user?._id) {
      savedDetection = await AnprDetection.create({
        user: req.user._id,
        plate,
        confidence: parsedConfidence,
        source: "webcam",
      });
    }

    return res.json({
      detected: Boolean(plate) && isReliable,
      plate: Boolean(plate) && isReliable ? plate : null,
      confidence: parsedConfidence,
      plateScore,
      rawText: scan.rawText,
      minConfidence: MIN_ANPR_CONFIDENCE,
      minPlateScore: MIN_PLATE_SCORE,
      ...detectorMeta,
      saved: Boolean(savedDetection),
      detectionId: savedDetection?._id || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("ANPR detectNumberPlate error:", error);
    return res.status(500).json({
      message: "Failed to detect number plate.",
      error: error.message,
    });
  }
};

exports.getMyDetections = async (req, res) => {
  try {
    const detections = await AnprDetection.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.json(detections);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch ANPR detections.",
      error: error.message,
    });
  }
};
