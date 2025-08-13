// Install dependencies first:
// npm install express canvas moment

const express = require("express");
const { createCanvas, loadImage, registerFont } = require("canvas");
const moment = require("moment-timezone");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Register your font
registerFont(path.join(__dirname, "roboto.ttf"), { family: "Roboto" });

app.get("/", async (req, res) => {
  try {
    const number = req.query.number || "01986-343907";
    const transactionId = req.query.transaction || "730MGQGC";
    const amount = req.query.amount || "9999";
    const charge = req.query.charge || "5";
    const total = req.query.total || "9999";

    // Time format in Asia/Dhaka
    const time = moment().tz("Asia/Dhaka").format("DD MMMM YYYY, hh:mm A");
    const timeeee = moment().tz("Asia/Dhaka").format("hh:mm A");

    // Load background image
    const background = await loadImage(path.join(__dirname, "ss.jpg"));
    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.drawImage(background, 0, 0);

    // Colors
    const grey = "rgb(128,128,128)";
    const white = "rgb(255,255,255)";

    // Font sizes
    const fontSize = 50;
    const fontSizeBold = 55;
    const trim = 47;

    // Text positions
    const textStyles = {
      number: { x: 1199, y: 1090, size: fontSizeBold, color: grey },
      transactionId: { x: 1790, y: 1280, size: fontSize, color: grey },
      amount: { x: 1630, y: 1385, size: fontSize, color: grey },
      charge: { x: 1630, y: 1505, size: fontSize, color: grey },
      total: { x: 1630, y: 1620, size: fontSize, color: grey },
      time: { x: 1790, y: 1740, size: fontSize, color: grey },
      timeeee: { x: 370, y: 105, size: trim, color: white },
    };

    // Right align function
    const drawRightAligned = (text, style) => {
      ctx.font = `${style.size}px Roboto`;
      const textWidth = ctx.measureText(text).width;
      ctx.fillStyle = style.color;
      ctx.fillText(text, style.x - textWidth, style.y);
    };

    // Draw all texts
    drawRightAligned(number, textStyles.number);
    drawRightAligned(transactionId, textStyles.transactionId);
    drawRightAligned(amount, textStyles.amount);
    drawRightAligned(charge, textStyles.charge);
    drawRightAligned(total, textStyles.total);
    drawRightAligned(time, textStyles.time);
    drawRightAligned(timeeee, textStyles.timeeee);

    // Set headers for PNG download
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", 'attachment; filename="devzeron.png"');

    canvas.pngStream().pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating image");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
